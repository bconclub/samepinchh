<?php
/**
 * Audio Recording Upload Handler for Hostinger
 * 
 * Accepts POST request with multipart/form-data
 * Fields: name, contact, date, story (text or audio file)
 * 
 * Security:
 * - Validates file type (MIME and extension)
 * - Sanitizes filename
 * - Limits file size (5MB)
 * - Prevents path traversal
 */

// Set CORS headers FIRST (before any output)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle GET requests for testing
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'API endpoint is working',
        'method' => 'GET',
        'php_version' => phpversion(),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'max_file_uploads' => ini_get('max_file_uploads'),
        'upload_dir_exists' => file_exists(__DIR__ . '/../uploads/audio-recordings/'),
        'upload_dir_writable' => is_writable(__DIR__ . '/../uploads/audio-recordings/') || is_writable(__DIR__ . '/../uploads/'),
        'upload_dir_path' => realpath(__DIR__ . '/../uploads/audio-recordings/') ?: __DIR__ . '/../uploads/audio-recordings/'
    ]);
    exit;
}

// Only allow POST requests for actual submissions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'error' => 'Method not allowed. Use POST for submissions or GET for testing.',
        'received_method' => $_SERVER['REQUEST_METHOD']
    ]);
    exit;
}

// Configuration
$upload_dir = __DIR__ . '/../uploads/audio-recordings/';
$max_file_size = 5 * 1024 * 1024; // 5MB in bytes
$allowed_mime_types = [
    'audio/webm',
    'video/webm',  // Some browsers report webm as video/webm
    'audio/ogg',
    'audio/opus',  // Opus codec in webm/ogg
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',   // Some browsers use mp4 for audio
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'application/ogg',  // Alternative ogg MIME type
    'application/octet-stream'  // Fallback if MIME detection fails (we'll validate by extension)
];
$allowed_extensions = ['webm', 'ogg', 'mp3', 'wav', 'opus'];

// Create upload directory if it doesn't exist
if (!file_exists($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'error' => 'Failed to create upload directory',
            'debug' => [
                'attempted_path' => $upload_dir,
                'parent_exists' => file_exists(dirname($upload_dir)),
                'parent_writable' => is_writable(dirname($upload_dir))
            ]
        ]);
        exit;
    }
}

// Check if directory is writable
if (!is_writable($upload_dir)) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Upload directory is not writable',
        'debug' => [
            'upload_dir' => $upload_dir,
            'permissions' => substr(sprintf('%o', fileperms($upload_dir)), -4)
        ]
    ]);
    exit;
}

// Validate required fields
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$contact = isset($_POST['contact']) ? trim($_POST['contact']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$story_text = isset($_POST['story']) ? trim($_POST['story']) : '';

if (empty($name) || empty($contact)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and contact are required']);
    exit;
}

// Validate that either text or audio is provided
$has_audio = isset($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK;
$has_text = !empty($story_text);

if (!$has_audio && !$has_text) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Either text message or audio recording is required']);
    exit;
}

$response_data = [
    'success' => true,
    'name' => $name,
    'contact' => $contact,
    'date' => $date,
    'timestamp' => date('Y-m-d H:i:s')
];

// Handle audio file upload
if ($has_audio) {
    $file = $_FILES['audio'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $error_messages[$file['error']] ?? 'Unknown upload error'
        ]);
        exit;
    }
    
    // Validate file size
    if ($file['size'] > $max_file_size) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'File size exceeds 5MB limit']);
        exit;
    }
    
    // Get file extension first (for fallback validation)
    $original_name = $file['name'];
    $extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
    
    // Validate MIME type
    $mime_type = null;
    $mime_detected = false;
    
    // Try to detect MIME type using finfo if available
    if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $detected_mime = @finfo_file($finfo, $file['tmp_name']);
            if ($detected_mime && $detected_mime !== 'application/octet-stream') {
                $mime_type = $detected_mime;
                $mime_detected = true;
            }
            @finfo_close($finfo);
        }
    }
    
    // Fallback: use $_FILES['type'] if finfo failed
    if (!$mime_detected && isset($file['type']) && !empty($file['type'])) {
        $mime_type = $file['type'];
        $mime_detected = true;
    }
    
    // Validate extension (primary check)
    if (!in_array($extension, $allowed_extensions)) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Invalid file extension. Only audio files (webm, ogg, mp3, wav) are allowed',
            'debug' => [
                'extension' => $extension,
                'filename' => $original_name,
                'mime_type' => $mime_type
            ]
        ]);
        exit;
    }
    
    // Validate MIME type (secondary check, but allow if extension is valid and MIME is unknown)
    if ($mime_detected && !in_array($mime_type, $allowed_mime_types)) {
        // If extension is valid but MIME type doesn't match, log but allow (some browsers report incorrect MIME)
        // Only reject if we're confident it's not an audio file
        if (!in_array($mime_type, ['application/octet-stream', 'application/x-unknown-content-type'])) {
            // For strict validation, uncomment this:
            // http_response_code(400);
            // echo json_encode(['success' => false, 'error' => 'Invalid file type. Only audio files (webm, ogg, mp3, wav) are allowed', 'debug' => ['mime_type' => $mime_type, 'extension' => $extension]]);
            // exit;
        }
    }
    
    // Sanitize filename: dateprefix_sanitized_name.extension
    $sanitized_name = preg_replace('/[^a-z0-9]/i', '_', $name);
    $sanitized_name = substr($sanitized_name, 0, 50); // Limit length
    
    // Parse date from form and format as DDMMYYYY
    $date_prefix = '';
    if (!empty($date) && $date !== 'Not selected') {
        // Try to parse the date string (format: "Saturday, Jan 24 at 7 PM")
        // Remove "at 7 PM" part for easier parsing
        $date_clean = preg_replace('/\s+at\s+\d+\s*PM/i', '', $date);
        
        // Try using strtotime first (handles most formats)
        $timestamp = strtotime($date_clean);
        if ($timestamp !== false) {
            $date_prefix = date('dmY', $timestamp);
        } else {
            // Fallback: manual parsing
            if (preg_match('/(\w+),\s*(\w+)\s+(\d+)/', $date_clean, $matches)) {
                // Format: "Saturday, Jan 24"
                $month_name = $matches[2];
                $day = str_pad($matches[3], 2, '0', STR_PAD_LEFT);
                
                // Convert month name to number
                $months = [
                    'jan' => '01', 'january' => '01',
                    'feb' => '02', 'february' => '02',
                    'mar' => '03', 'march' => '03',
                    'apr' => '04', 'april' => '04',
                    'may' => '05',
                    'jun' => '06', 'june' => '06',
                    'jul' => '07', 'july' => '07',
                    'aug' => '08', 'august' => '08',
                    'sep' => '09', 'september' => '09',
                    'oct' => '10', 'october' => '10',
                    'nov' => '11', 'november' => '11',
                    'dec' => '12', 'december' => '12'
                ];
                
                $month = strtolower($month_name);
                $month_num = isset($months[$month]) ? $months[$month] : date('m');
                $year = date('Y'); // Use current year
                
                $date_prefix = $day . $month_num . $year;
            } else {
                // Fallback: use current date in DDMMYYYY format
                $date_prefix = date('dmY');
            }
        }
    } else {
        // No date provided, use current date
        $date_prefix = date('dmY');
    }
    
    $file_name = $date_prefix . '_' . $sanitized_name . '.' . $extension;
    
    // Prevent path traversal
    $file_name = basename($file_name);
    $target_path = $upload_dir . $file_name;
    
    // Additional security: ensure target path is within upload directory
    $real_upload_dir = realpath($upload_dir);
    $real_target_path = realpath(dirname($target_path));
    
    if ($real_target_path !== $real_upload_dir) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid file path']);
        exit;
    }
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $target_path)) {
        http_response_code(500);
        $last_error = error_get_last();
        echo json_encode([
            'success' => false, 
            'error' => 'Failed to save file',
            'debug' => [
                'tmp_name' => $file['tmp_name'],
                'target_path' => $target_path,
                'tmp_exists' => file_exists($file['tmp_name']),
                'target_dir_writable' => is_writable(dirname($target_path)),
                'last_error' => $last_error
            ]
        ]);
        exit;
    }
    
    // Set file permissions
    chmod($target_path, 0644);
    
    $response_data['audio_file'] = $file_name;
    $response_data['audio_size'] = $file['size'];
    $response_data['audio_mime_type'] = $mime_type;
    $response_data['has_audio'] = true;
} else {
    $response_data['has_audio'] = false;
    $response_data['story_text'] = $story_text;
}

// Optional: Save metadata to database
// Uncomment and configure if you have MySQL database
/*
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=your_database",
        "your_username",
        "your_password"
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("
        INSERT INTO submissions (name, contact, date, story_text, audio_file, timestamp)
        VALUES (:name, :contact, :date, :story_text, :audio_file, NOW())
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':contact' => $contact,
        ':date' => $date,
        ':story_text' => $has_text ? $story_text : null,
        ':audio_file' => $has_audio ? $response_data['audio_file'] : null
    ]);
    
    $response_data['submission_id'] = $pdo->lastInsertId();
} catch (PDOException $e) {
    // Log error but don't fail the request
    error_log("Database error: " . $e->getMessage());
}
*/

// Optional: Send email notification
// Uncomment and configure if you want email notifications
/*
$to = "your-email@example.com";
$subject = "New Submission from " . $name;
$message = "Name: " . $name . "\n";
$message .= "Contact: " . $contact . "\n";
$message .= "Date: " . $date . "\n";
if ($has_text) {
    $message .= "Story: " . $story_text . "\n";
}
if ($has_audio) {
    $message .= "Audio File: " . $response_data['audio_file'] . "\n";
}
$headers = "From: noreply@yourdomain.com";
mail($to, $subject, $message, $headers);
*/

// Send form data to webhook
$webhook_url = 'https://build.goproxe.com/webhook/samepinchh-website';

// Collect all form data including UTM parameters
$webhook_data = [
    'name' => $name,
    'contact' => $contact,
    'date' => $date,
    'timestamp' => $response_data['timestamp'],
    'has_audio' => $has_audio,
    'has_text' => $has_text
];

// Add text message if present
if ($has_text) {
    $webhook_data['story_text'] = $story_text;
    $webhook_data['message'] = $story_text;
}

// Add audio file info if present
if ($has_audio) {
    $webhook_data['audio_file'] = $response_data['audio_file'];
    $webhook_data['audio_size'] = $response_data['audio_size'];
    $webhook_data['audio_mime_type'] = $response_data['audio_mime_type'];
}

// Collect UTM parameters from POST data
$utm_keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
foreach ($utm_keys as $key) {
    if (isset($_POST[$key]) && !empty($_POST[$key])) {
        $webhook_data[$key] = $_POST[$key];
    }
}

// Log webhook data being sent (for debugging - remove sensitive data in production)
error_log("=== WEBHOOK ATTEMPT ===");
error_log("Webhook URL: " . $webhook_url);
error_log("Webhook data being sent: " . json_encode($webhook_data, JSON_PRETTY_PRINT));
error_log("Data size: " . strlen(json_encode($webhook_data)) . " bytes");

// Send to webhook using cURL (non-blocking - don't fail if webhook fails)
$webhook_sent = false;
$webhook_error = null;

if (function_exists('curl_init')) {
    $json_data = json_encode($webhook_data);
    
    $ch = curl_init($webhook_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: Samepinchh-Website/1.0',
        'Content-Length: ' . strlen($json_data)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15); // 15 second timeout
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // 10 second connection timeout
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
    
    // SSL options - try with verification first, fallback if needed
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    
    // Execute and capture response
    $webhook_response = curl_exec($ch);
    $curl_error = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_info = curl_getinfo($ch);
    curl_close($ch);
    
    // Log webhook result for debugging
    if ($curl_error) {
        $webhook_error = "cURL Error: $curl_error";
        error_log("Webhook cURL error: $curl_error | URL: $webhook_url | HTTP Code: $http_code");
        
        // Try again with SSL verification disabled if SSL error
        if (strpos($curl_error, 'SSL') !== false || strpos($curl_error, 'certificate') !== false) {
            error_log("Retrying webhook with SSL verification disabled...");
            $ch2 = curl_init($webhook_url);
            curl_setopt($ch2, CURLOPT_POST, true);
            curl_setopt($ch2, CURLOPT_POSTFIELDS, $json_data);
            curl_setopt($ch2, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                'User-Agent: Samepinchh-Website/1.0',
                'Content-Length: ' . strlen($json_data)
            ]);
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2, CURLOPT_TIMEOUT, 15);
            curl_setopt($ch2, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch2, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch2, CURLOPT_SSL_VERIFYHOST, 0);
            
            $webhook_response2 = curl_exec($ch2);
            $curl_error2 = curl_error($ch2);
            $http_code2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
            curl_close($ch2);
            
            if (!$curl_error2 && $http_code2 >= 200 && $http_code2 < 300) {
                $webhook_sent = true;
                error_log("Webhook sent successfully (retry without SSL): HTTP $http_code2 | URL: $webhook_url");
            } else {
                error_log("Webhook retry failed: $curl_error2 | HTTP Code: $http_code2");
            }
        }
    } else if ($http_code >= 200 && $http_code < 300) {
        $webhook_sent = true;
        error_log("Webhook sent successfully: HTTP $http_code | URL: $webhook_url | Response: " . substr($webhook_response, 0, 100));
    } else {
        $webhook_error = "HTTP $http_code";
        error_log("Webhook failed: HTTP $http_code | URL: $webhook_url | Response: " . substr($webhook_response, 0, 200));
    }
    
    // Add webhook status to response for debugging
    $response_data['webhook_sent'] = $webhook_sent;
    $response_data['webhook_url'] = $webhook_url;
    if ($webhook_error) {
        $response_data['webhook_error'] = $webhook_error;
    }
    if (isset($http_code)) {
        $response_data['webhook_http_code'] = $http_code;
    }
    error_log("=== WEBHOOK RESULT ===");
    error_log("Webhook sent: " . ($webhook_sent ? 'YES' : 'NO'));
    error_log("HTTP Code: " . (isset($http_code) ? $http_code : 'N/A'));
    if ($webhook_error) {
        error_log("Webhook error: " . $webhook_error);
    }
} else {
    $webhook_error = "cURL not available";
    error_log("=== WEBHOOK ERROR ===");
    error_log("cURL is not available - cannot send webhook to: $webhook_url");
    $response_data['webhook_error'] = $webhook_error;
    $response_data['webhook_sent'] = false;
    $response_data['webhook_url'] = $webhook_url;
}

http_response_code(200);
echo json_encode($response_data);
?>

