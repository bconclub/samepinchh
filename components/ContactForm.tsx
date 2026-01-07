'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Lock, Heart, Shield, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import TagSelector, { type Tag } from './TagSelector';
import InputToggle from './InputToggle';

// @ts-ignore - react-datepicker types conflict with Next.js dynamic import  
const DatePicker: any = dynamic(
    () => import('react-datepicker').then((mod: any) => {
        // Ensure CSS is loaded
        if (typeof window !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/react-datepicker@4.25.0/dist/react-datepicker.css';
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                document.head.appendChild(link);
            }
        }
        return mod.default || mod;
    }),
    { 
        ssr: false,
        loading: () => (
            <input
                readOnly
                required
                className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                value=""
                placeholder="Select a Saturday"
            />
        ),
    }
);

type RecordingState = 'idle' | 'recording' | 'stopped';

// Helper functions for IST timezone (UTC+5:30)
const getISTNow = (): Date => {
    // Return current time (Date objects are always in UTC internally)
    // Use getISTComponents() to get IST-specific components
    return new Date();
};

// Get date components in IST timezone
const getISTComponents = (date: Date) => {
    // Fallback if Intl API is not available (SSR)
    if (typeof window === 'undefined' || !Intl || !Intl.DateTimeFormat) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        };
    }
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const dayNames: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    
    const yearPart = parts.find(p => p.type === 'year');
    const monthPart = parts.find(p => p.type === 'month');
    const dayPart = parts.find(p => p.type === 'day');
    const weekdayPart = parts.find(p => p.type === 'weekday');
    const hourPart = parts.find(p => p.type === 'hour');
    const minutePart = parts.find(p => p.type === 'minute');
    const secondPart = parts.find(p => p.type === 'second');
    
    if (!yearPart || !monthPart || !dayPart || !weekdayPart || !hourPart || !minutePart || !secondPart) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        };
    }
    
    return {
        year: parseInt(yearPart.value),
        month: parseInt(monthPart.value) - 1,
        date: parseInt(dayPart.value),
        day: dayNames[weekdayPart.value] ?? date.getDay(),
        hours: parseInt(hourPart.value),
        minutes: parseInt(minutePart.value),
        seconds: parseInt(secondPart.value)
    };
};

const createISTDate = (year: number, month: number, day: number, hours: number = 0, minutes: number = 0, seconds: number = 0): Date => {
    // Create date string in IST format (UTC+5:30)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}+05:30`;
    return new Date(dateStr);
};

const setISTHours = (date: Date, hours: number, minutes: number = 0, seconds: number = 0): Date => {
    // Get date components in IST and create new date with specified time
    const components = getISTComponents(date);
    return createISTDate(components.year, components.month, components.date, hours, minutes, seconds);
};

const getISTDateOnly = (date: Date): Date => {
    // Get date at midnight IST
    const components = getISTComponents(date);
    return createISTDate(components.year, components.month, components.date, 0, 0, 0);
};

export default function ContactForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        selectedDate: null as Date | null,
        message: ''
    });
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    
    const handleModeChange = (mode: 'text' | 'voice') => {
        setInputMode(mode);
        // Clear the other mode's data when switching
        if (mode === 'text' && audioBlob) {
            resetRecording();
        } else if (mode === 'voice' && formData.message.trim()) {
            setFormData({ ...formData, message: '' });
        }
    };
    const [isMounted, setIsMounted] = useState(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [micPermissionDenied, setMicPermissionDenied] = useState(false);
    const [mediaRecorderSupported, setMediaRecorderSupported] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [currentStep, setCurrentStep] = useState(1);
    
    // Calculate initial next Saturday date in IST
    const calculateNextSaturday = () => {
        const now = getISTNow();
        const nowComponents = getISTComponents(now);
        
        // Calculate days until next Saturday (6 is Saturday)
        let daysUntilSaturday = (6 - nowComponents.day + 7) % 7 || 7;
        
        // Create a date object for the target Saturday
        let targetDate = new Date(nowComponents.year, nowComponents.month, nowComponents.date + daysUntilSaturday);
        let targetComponents = getISTComponents(targetDate);
        
        // Create next Saturday date in IST at 7 PM
        let nextSaturday = createISTDate(
            targetComponents.year, 
            targetComponents.month, 
            targetComponents.date, 
            19, 0, 0
        );
        
        // If we've passed this Saturday 7 PM IST, get next Saturday
        if (now.getTime() > nextSaturday.getTime()) {
            // Add 7 days to the target date
            targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
            targetComponents = getISTComponents(targetDate);
            nextSaturday = createISTDate(
                targetComponents.year,
                targetComponents.month,
                targetComponents.date,
                19, 0, 0
            );
        }
        
        // Always use the Saturday that's at least 7 days away (skip this coming Saturday)
        // If the calculated Saturday is less than 7 days away, add 7 more days
        const daysUntilCalculatedSaturday = Math.floor((nextSaturday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilCalculatedSaturday < 7) {
            targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
            targetComponents = getISTComponents(targetDate);
            nextSaturday = createISTDate(
                targetComponents.year,
                targetComponents.month,
                targetComponents.date,
                19, 0, 0
            );
        }
        
        return nextSaturday;
    };
    
    const [nextSpaceDate, setNextSpaceDate] = useState<Date>(calculateNextSaturday());
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check MediaRecorder support on mount and load datepicker CSS
    useEffect(() => {
        // Set isMounted immediately - this is a client component so window will be defined
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            if (!window.MediaRecorder) {
                setMediaRecorderSupported(false);
            }
            // Load datepicker CSS
            // @ts-ignore - CSS import
            import('react-datepicker/dist/react-datepicker.css');
        }
    }, []);

    // Countdown timer to next Saturday 7 PM IST
    useEffect(() => {
        const updateCountdown = () => {
            const now = getISTNow();
            const nowComponents = getISTComponents(now);
            
            // Calculate days until next Saturday (6 is Saturday)
            let daysUntilSaturday = (6 - nowComponents.day + 7) % 7 || 7;
            
            // Create a date object for the target Saturday
            let targetDate = new Date(nowComponents.year, nowComponents.month, nowComponents.date + daysUntilSaturday);
            let targetComponents = getISTComponents(targetDate);
            
            // Create next Saturday date in IST at 7 PM
            let nextSaturday = createISTDate(
                targetComponents.year, 
                targetComponents.month, 
                targetComponents.date, 
                19, 0, 0
            );
            
            // If we've passed this Saturday 7 PM IST, get next Saturday
            if (now.getTime() > nextSaturday.getTime()) {
                // Add 7 days to the target date
                targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
                targetComponents = getISTComponents(targetDate);
                nextSaturday = createISTDate(
                    targetComponents.year,
                    targetComponents.month,
                    targetComponents.date,
                    19, 0, 0
                );
            }
            
            // Always use the Saturday that's at least 7 days away (skip this coming Saturday)
            // If the calculated Saturday is less than 7 days away, add 7 more days
            const daysUntilCalculatedSaturday = Math.floor((nextSaturday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilCalculatedSaturday < 7) {
                targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
                targetComponents = getISTComponents(targetDate);
                nextSaturday = createISTDate(
                    targetComponents.year,
                    targetComponents.month,
                    targetComponents.date,
                    19, 0, 0
                );
            }
            
            setNextSpaceDate(nextSaturday);
            
            const diff = nextSaturday.getTime() - now.getTime();
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                setCountdown({ days, hours, minutes, seconds });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    const formatDate = (date: Date): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        
        // Get ordinal suffix (st, nd, rd, th)
        const getOrdinalSuffix = (n: number): string => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        
        return `${day}${getOrdinalSuffix(day)} ${month}, ${dayName} 7PM IST`;
    };

    const formatSimpleDate = (date: Date): string => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const components = getISTComponents(date);
        const day = components.date;
        const month = months[components.month];
        const year = components.year;
        
        // Get ordinal suffix (st, nd, rd, th)
        const getOrdinalSuffix = (n: number): string => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        
        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            // Reset previous recording and clear text if present
            setAudioBlob(null);
            setRecordingTime(0);
            setShowWarning(false);
            chunksRef.current = [];
            // Clear text when starting to record (user chooses audio over text)
            if (formData.message.trim()) {
                setFormData({ ...formData, message: '' });
            }
            // Switch to voice mode if not already
            if (inputMode !== 'voice') {
                setInputMode('voice');
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            streamRef.current = stream;
            setAudioStream(stream);

            // Determine supported MIME type
            let mimeType = 'audio/webm';
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                if (MediaRecorder.isTypeSupported('audio/ogg')) {
                    mimeType = 'audio/ogg';
                } else {
                    mimeType = 'audio/webm'; // Fallback, browser will choose
                }
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                
                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
                setAudioStream(null);
            };

            mediaRecorder.start(100); // Collect data every 100ms
            setRecordingState('recording');
            setMicPermissionDenied(false);

            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    
                    // Show warning at 50 seconds
                    if (newTime === 50) {
                        setShowWarning(true);
                    }
                    
                    // Auto-stop at 60 seconds
                    if (newTime >= 60) {
                        setTimeout(() => stopRecording(), 0);
                    }
                    
                    return newTime;
                });
            }, 1000);

        } catch (error: any) {
            console.error('Error accessing microphone:', error);
            setMicPermissionDenied(true);
            setRecordingState('idle');
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('stopped');
            
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            
            setShowWarning(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
        setRecordingState('idle');
        setShowWarning(false);
        chunksRef.current = [];
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setAudioStream(null);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getUTMParameters = () => {
        // Standard UTM parameters
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        // Ad platform click IDs
        const adClickIds = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'];
        // Combine all tracking parameters
        const allTrackingKeys = [...utmKeys, ...adClickIds];
        const utmParams: any = {};
        
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            // Capture all tracking parameters from URL
            allTrackingKeys.forEach(key => {
                const value = urlParams.get(key);
                // Always include all parameters, use empty string if not present
                utmParams[key] = value || '';
            });
        } else {
            // SSR: return empty strings for all tracking parameters
            allTrackingKeys.forEach(key => {
                utmParams[key] = '';
            });
        }
        
        return utmParams;
    };

    const handleStep1Next = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate step 1 fields
        if (!formData.name.trim()) {
            alert('Please enter your name');
            return;
        }
        if (!formData.contact.trim()) {
            alert('Please enter your contact information');
            return;
        }
        if (!formData.selectedDate) {
            alert('Please select a date');
            return;
        }
        
        // Move to step 2
        setCurrentStep(2);
    };

    const handleStep2Back = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate that either text or audio is provided based on current mode
        if (inputMode === 'voice' && !audioBlob) {
            alert('Please record audio or switch to text mode');
            return;
        }
        if (inputMode === 'text' && !formData.message.trim()) {
            alert('Please type a message or switch to voice mode');
            return;
        }
        
        // Format selected date
        const dateStr = formData.selectedDate 
            ? formData.selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
            }) + ' at 7 PM'
            : 'Not selected';
        
        // Get UTM parameters
        const utmParams = getUTMParameters();
        
        // Prepare form data for PHP upload endpoint
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('contact', formData.contact);
        formDataToSend.append('date', dateStr);
        
        // Always add all UTM parameters (even if empty)
        Object.keys(utmParams).forEach(key => {
            formDataToSend.append(key, utmParams[key] || '');
        });
        
        // Handle audio or text message
        if (audioBlob) {
            // Determine file extension based on MIME type
            let extension = 'webm';
            if (audioBlob.type.includes('ogg')) {
                extension = 'ogg';
            } else if (audioBlob.type.includes('mp3') || audioBlob.type.includes('mpeg')) {
                extension = 'mp3';
            } else if (audioBlob.type.includes('wav')) {
                extension = 'wav';
            }
            
            // Create a File object from the Blob
            const audioFile = new File([audioBlob], `recording.${extension}`, {
                type: audioBlob.type,
                lastModified: Date.now()
            });
            
            formDataToSend.append('audio', audioFile);
        } else {
            formDataToSend.append('story', formData.message);
        }
        
        // Add tags
        if (selectedTags.length > 0) {
            formDataToSend.append('tags', JSON.stringify(selectedTags));
        }
        
        // Add input mode
        formDataToSend.append('input_mode', inputMode);
        
        // Add audio duration if available
        if (audioBlob && recordingTime) {
            formDataToSend.append('audio_duration', recordingTime.toString());
        }
        
        // Send to PHP upload endpoint
        await sendToUploadEndpoint(formDataToSend, {
            name: formData.name,
            contact: formData.contact,
            selectedDate: dateStr,
            hasAudio: !!audioBlob,
            audioDuration: audioBlob ? recordingTime : undefined,
            message: audioBlob ? `[Audio recording - ${formatTime(recordingTime)}]` : formData.message,
            ...utmParams
        });
    };
    
    const sendToUploadEndpoint = async (formData: FormData, payload: any) => {
        try {
            // Get upload endpoint URL
            // In development: Use Next.js API route (which proxies to PHP server)
            // In production: Use PHP endpoint directly (static export doesn't support API routes)
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 
                (typeof window !== 'undefined' 
                    ? process.env.NODE_ENV === 'development'
                        ? `${window.location.origin}/api/submit`  // Next.js API route in dev
                        : `${window.location.origin}/api/submit.php`  // PHP directly in production
                    : '/api/submit.php');
            
            console.log('Uploading to:', uploadUrl);
            console.log('Form data keys:', Array.from(formData.keys()));
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            // Try to get response text first to see what we're dealing with
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            // Check if response is HTML (error page) before trying to parse JSON
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                console.error('Server returned HTML instead of JSON');
                if (response.status === 500) {
                    throw new Error('Server error (500). The PHP file may have an error or the server is misconfigured. Please contact support.');
                } else if (response.status === 404) {
                    throw new Error('Endpoint not found (404). Please make sure /api/submit.php exists on the server.');
                } else {
                    throw new Error('Server returned an HTML error page. Please contact support.');
                }
            }
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                throw new Error(`Server returned invalid response format. Expected JSON but received: ${responseText.substring(0, 100)}...`);
            }
            
            if (!response.ok) {
                const errorMsg = result.error || result.message || `Upload failed: ${response.statusText}`;
                const debugInfo = result.debug ? `\n\nDebug info: ${JSON.stringify(result.debug, null, 2)}` : '';
                throw new Error(errorMsg + debugInfo);
            }
            
            if (!result.success) {
                const errorMsg = result.error || result.message || 'Upload failed';
                const debugInfo = result.debug ? `\n\nDebug info: ${JSON.stringify(result.debug, null, 2)}` : '';
                throw new Error(errorMsg + debugInfo);
            }
            
            // Log webhook status
            console.log('=== WEBHOOK STATUS ===');
            console.log('Webhook URL:', result.webhook_url || 'Not provided');
            console.log('Webhook sent:', result.webhook_sent ? 'YES ✅' : 'NO ❌');
            if (result.webhook_http_code) {
                console.log('Webhook HTTP Code:', result.webhook_http_code);
            }
            if (result.webhook_error) {
                console.error('Webhook error:', result.webhook_error);
            }
            
            // Log all tracking parameters (UTM + Ad Click IDs)
            console.log('=== TRACKING PARAMETERS ===');
            const trackingParams = [
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                'gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'
            ];
            trackingParams.forEach(key => {
                if (result[key]) {
                    console.log(`${key}:`, result[key]);
                }
            });
            
            console.log('Full response:', result);
            
            // Redirect to thank you page with file information
            redirectToThankYou({
                ...payload,
                audioFile: result.audio_file || null
            });
        } catch (error: any) {
            console.error('Error uploading file:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Extract user-friendly error message
            let userMessage = error.message || 'Please try again';
            
            // Check if it's a PHP server connection error
            if (userMessage.includes('PHP server is not running') || userMessage.includes('Could not connect')) {
                userMessage = 'PHP server is not running.\n\nTo fix this:\n1. Open a terminal in the project root\n2. Run: php -S localhost:8000\n3. Then try submitting again';
            } else if (userMessage.includes('HTML error page') || userMessage.includes('Server returned HTML')) {
                userMessage = 'Server configuration error.\n\nThe PHP server returned an error page. This may be a server-side issue. Please try again later or contact support.';
            } else if (userMessage.includes('Invalid response from server')) {
                userMessage = 'Server error.\n\nThe server returned an unexpected response. Please try again or contact support if the problem persists.';
            }
            
            // Show detailed error message
            alert(`Failed to submit form:\n\n${userMessage}\n\nPlease check the browser console for more details.`);
            // Optionally still redirect to thank you page even if upload fails
            // redirectToThankYou(payload);
        }
    };
    
    const redirectToThankYou = (payload: any) => {
        const params = new URLSearchParams({
            name: payload.name,
            contact: payload.contact,
            selectedDate: payload.selectedDate,
            message: payload.message || '',
            hasAudio: payload.hasAudio ? 'true' : 'false',
            ...(payload.audioDuration && { audioDuration: payload.audioDuration.toString() }),
            ...(payload.audioFile && { audioFile: payload.audioFile })
        });
        // Use Next.js router for proper client-side navigation
        router.push(`/thank-you?${params.toString()}`);
    };

    return (
        <section id="contact" className="contact-form contact-form-section relative px-6 max-w-xl mx-auto z-10">
            <div className="meetup-banner bg-black text-white text-center py-3 px-4 rounded-lg mb-6" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}>
                <div className="flex flex-col items-center gap-2">
                    {/* Three lines - same format for mobile and desktop */}
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[18px] sm:text-[16px]" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif", fontWeight: 300, letterSpacing: '0.05em' }}>
                            Next Space in
                        </p>
                        <p className="text-[32px] sm:text-[36px]" style={{ fontFamily: 'var(--font-classyvogue), sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}>
                            {countdown.days} {countdown.days === 1 ? 'day' : 'days'} and {countdown.hours} {countdown.hours === 1 ? 'hour' : 'hours'}
                        </p>
                        <p className="text-[20px] flex items-center gap-2" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif", fontWeight: 400 }}>
                            <Calendar size={18} className="inline-block" />
                            {formatSimpleDate(nextSpaceDate)}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="contact-form__container contact-form-container frosted-glass rounded-[16px]"
            >
                <div className="text-center" style={{ lineHeight: '1.2' }}>
                    <h3 className="contact-form__title contact-form-title" style={{ marginBottom: '4px' }}>Join Your Space</h3>
                    <p style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif", fontSize: '20px', letterSpacing: '0.05em', marginTop: '0' }}>(Online)</p>
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                        <div className={`h-2 w-8 rounded-full transition-all ${currentStep === 1 ? 'bg-black' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-8 rounded-full transition-all ${currentStep === 2 ? 'bg-black' : 'bg-gray-300'}`}></div>
                    </div>
                </div>
                
                <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="contact-form__form space-y-3"
                            onSubmit={handleStep1Next}
                        >
                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Contact</label>
                        <input
                            type="tel"
                            required
                            value={formData.contact}
                            onChange={(e) => {
                                // Only allow numbers, spaces, +, -, and parentheses
                                const value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                                setFormData({ ...formData, contact: value });
                            }}
                            className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                            placeholder="Phone number"
                        />
                    </div>

                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Select your date</label>
                        {isMounted ? (
                            <div className="react-datepicker-wrapper">
                                <DatePicker
                                    selected={formData.selectedDate}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            // Ensure time is set to 7 PM
                                            date.setHours(19, 0, 0, 0);
                                        }
                                        setFormData({ ...formData, selectedDate: date });
                                    }}
                                    filterDate={(date: Date) => {
                                        // Only allow Saturdays (day 6) and dates in the future
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date.getDay() === 6 && date >= today;
                                    }}
                                    minDate={new Date()}
                                    maxDate={(() => {
                                        const maxDate = new Date();
                                        maxDate.setDate(maxDate.getDate() + (8 * 7)); // 8 weeks from today
                                        return maxDate;
                                    })()}
                                    dateFormat="EEEE, MMM do, h:mm aa"
                                    placeholderText="Select a Saturday"
                                    className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                                    calendarClassName="saturday-date-picker"
                                    dayClassName={(date: Date) => {
                                        const isSaturday = date.getDay() === 6;
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const isPast = date < today;
                                        
                                        if (isPast) {
                                            return 'react-datepicker__day--disabled';
                                        }
                                        if (isSaturday) {
                                            return 'saturday-day';
                                        }
                                        return 'disabled-day';
                                    }}
                                    showPopperArrow={false}
                                    required
                                    withPortal={false}
                                />
                            </div>
                        ) : (
                            <input
                                readOnly
                                required
                                className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                                value=""
                                placeholder="Select a Saturday"
                            />
                        )}
                    </div>

                            <motion.button
                                whileHover={{
                                    y: -4,
                                    scale: 1.02,
                                    boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.25), -6px -6px 16px rgba(0, 0, 0, 0.15)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="contact-form__submit contact-form-submit w-full font-black py-3 rounded-[12px] transition-all mt-2"
                            >
                                Next
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="contact-form__form space-y-3"
                            onSubmit={handleSubmit}
                        >
                            <div className="contact-form__field space-y-1">
                                <InputToggle mode={inputMode} onModeChange={handleModeChange} />
                                
                                <AnimatePresence mode="wait">
                                    {inputMode === 'text' ? (
                                        <motion.div
                                            key="text-input"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative"
                                        >
                                            <textarea
                                                rows={4}
                                                required={!audioBlob}
                                                value={formData.message}
                                                maxLength={500}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, message: e.target.value });
                                                    // If user types, clear audio recording
                                                    if (e.target.value.trim() && audioBlob) {
                                                        resetRecording();
                                                    }
                                                }}
                                                className="contact-form__textarea contact-form-textarea w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500 resize-none"
                                                placeholder="Share your story..."
                                            />
                                            <div className="text-right text-xs text-gray-500 mt-1">
                                                {formData.message.length}/500
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="voice-input"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex flex-col items-center justify-center py-8 rounded-[12px] frosted-glass border-2 border-black/30">
                                                <div className="flex flex-col items-center gap-3">
                                                    {recordingState === 'recording' && (
                                                        <div className="text-lg font-bold text-red-600">
                                                            {formatTime(recordingTime)}
                                                        </div>
                                                    )}
                                                    
                                                    {mediaRecorderSupported ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (recordingState === 'idle') {
                                                                    startRecording();
                                                                } else if (recordingState === 'recording') {
                                                                    stopRecording();
                                                                } else if (recordingState === 'stopped') {
                                                                    resetRecording();
                                                                }
                                                            }}
                                                            disabled={micPermissionDenied || (recordingState === 'recording' && recordingTime >= 60)}
                                                            className={`contact-form__mic-button p-4 rounded-full transition-all flex items-center justify-center ${
                                                                recordingState === 'recording'
                                                                    ? 'bg-red-500 text-white shadow-lg'
                                                                    : recordingState === 'stopped'
                                                                    ? 'bg-gray-400 text-white'
                                                                    : micPermissionDenied
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                                            }`}
                                                            title={
                                                                micPermissionDenied
                                                                    ? 'Microphone access denied'
                                                                    : recordingState === 'recording'
                                                                    ? 'Stop recording'
                                                                    : recordingState === 'stopped'
                                                                    ? 'Re-record'
                                                                    : 'Start recording'
                                                            }
                                                        >
                                                            {micPermissionDenied ? (
                                                                <MicOff size={24} />
                                                            ) : (
                                                                <Mic size={24} />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">
                                                            Voice recording not supported in this browser
                                                        </div>
                                                    )}
                                                    
                                                    <div className="text-sm text-gray-600 text-center">
                                                        {recordingState === 'idle' && 'Click to start recording'}
                                                        {recordingState === 'recording' && 'Recording...'}
                                                        {recordingState === 'stopped' && 'Recording complete'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {showWarning && recordingState === 'recording' && (
                                                <div className="text-xs text-orange-600 font-semibold animate-pulse text-center">
                                                    ⚠️ 10 seconds remaining
                                                </div>
                                            )}
                                            {recordingState === 'stopped' && audioBlob && (
                                                <div className="flex items-center justify-between text-xs text-green-600 font-semibold bg-green-50 p-3 rounded-[12px]">
                                                    <span>✓ Audio recorded ({formatTime(recordingTime)})</span>
                                                    <button
                                                        type="button"
                                                        onClick={resetRecording}
                                                        className="text-red-600 hover:text-red-800 underline"
                                                    >
                                                        Delete & re-record
                                                    </button>
                                                </div>
                                            )}
                                            {micPermissionDenied && (
                                                <div className="text-xs text-red-600 font-semibold text-center">
                                                    Microphone access denied. Please allow microphone access to record audio.
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="contact-form__field space-y-1">
                                <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleStep2Back}
                                    className="contact-form__back-button w-1/3 font-black py-3 rounded-[12px] transition-all border-2 border-black/30 bg-white text-black"
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{
                                        y: -4,
                                        scale: 1.02,
                                        boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.25), -6px -6px 16px rgba(0, 0, 0, 0.15)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="contact-form__submit contact-form-submit flex-1 font-black py-3 rounded-[12px] transition-all"
                                >
                                    Send
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="flex flex-row flex-wrap justify-center gap-4 text-xs text-gray-600 mt-4">
                <div className="flex items-center gap-2">
                    <Lock size={14} className="flex-shrink-0" />
                    <span>Private & confidential</span>
                </div>
                <div className="flex items-center gap-2">
                    <Heart size={14} className="flex-shrink-0" />
                    <span>No pressure, no commitment</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield size={14} className="flex-shrink-0" />
                    <span>Safe space for survivors</span>
                </div>
            </div>
        </section>
    );
}
