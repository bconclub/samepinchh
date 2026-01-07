import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Next.js API Route that proxies form submissions to PHP endpoint
 * 
 * In development: This route will work and proxy to the PHP file
 * In production (static export): This route won't be available.
 * For production, set NEXT_PUBLIC_UPLOAD_URL environment variable
 * to point to your PHP server URL.
 */
export async function POST(request: NextRequest) {
    try {
        // Get the PHP endpoint URL from environment variable
        // In production, use the production PHP server URL
        // In development, use localhost
        const phpEndpoint = process.env.NEXT_PUBLIC_UPLOAD_URL || 
            (process.env.NODE_ENV === 'development' 
                ? 'http://localhost:8000/api/submit.php'
                : 'https://samepinchh.com/api/submit.php'); // Production PHP endpoint

        if (!phpEndpoint) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Upload endpoint not configured. Please set NEXT_PUBLIC_UPLOAD_URL environment variable.',
                    message: 'For development, run: php -S localhost:8000 in the project root. For production, set NEXT_PUBLIC_UPLOAD_URL to your PHP server URL.'
                },
                { status: 500 }
            );
        }

        // Get form data from request
        const formData = await request.formData();

        // Forward the request to PHP endpoint
        let response;
        try {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            response = await fetch(phpEndpoint, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type - browser/formData will set it with boundary
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
        } catch (fetchError: any) {
            // Handle connection errors (server not running, network issues, etc.)
            if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch failed') || fetchError.cause?.code === 'ECONNREFUSED') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'PHP server is not running',
                        message: `Could not connect to ${phpEndpoint}. Please start the PHP server by running: php -S localhost:8000 in the project root directory.`,
                        debug: process.env.NODE_ENV === 'development' ? {
                            phpEndpoint,
                            error: fetchError.message,
                            hint: 'Make sure the PHP server is running on port 8000'
                        } : undefined
                    },
                    { status: 503 } // Service Unavailable
                );
            }
            throw fetchError; // Re-throw if it's a different error
        }

        const responseText = await response.text();
        
        // Check if response is HTML (error page) instead of JSON
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Server returned HTML instead of JSON',
                    message: 'The PHP server returned an HTML error page. This usually means the PHP file has an error or the server is misconfigured. Please check the PHP server logs.',
                    isHtmlResponse: true,
                    status: response.status
                },
                { status: response.status || 500 }
            );
        }
        
        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            // If not JSON, return error
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid response from server',
                    message: 'The server returned an unexpected response format. Expected JSON but received: ' + responseText.substring(0, 100) + '...',
                    status: response.status
                },
                { status: response.status || 500 }
            );
        }

        // Return the PHP response
        return NextResponse.json(result, { 
            status: response.ok ? 200 : response.status 
        });

    } catch (error: any) {
        console.error('Error proxying to PHP endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process form submission',
                message: error.message || 'Unknown error',
                debug: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack,
                    phpEndpoint: process.env.NEXT_PUBLIC_UPLOAD_URL
                } : undefined
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

