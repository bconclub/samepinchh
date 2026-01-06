<?php
/**
 * Simple test script to verify PHP upload functionality
 * 
 * Usage: Visit https://samepinchh.com/api/test.php in browser
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP Upload Test - Samepinchh</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; }
        .error { color: red; }
        .info { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
        pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>PHP Upload Configuration Test</h1>
    
    <?php
    $upload_dir = __DIR__ . '/../uploads/audio-recordings/';
    $api_file = __DIR__ . '/submit.php';
    
    echo '<div class="info">';
    echo '<h2>PHP Configuration</h2>';
    echo '<p><strong>PHP Version:</strong> ' . phpversion() . '</p>';
    echo '<p><strong>Upload Max Filesize:</strong> ' . ini_get('upload_max_filesize') . '</p>';
    echo '<p><strong>Post Max Size:</strong> ' . ini_get('post_max_size') . '</p>';
    echo '<p><strong>Max File Uploads:</strong> ' . ini_get('max_file_uploads') . '</p>';
    echo '<p><strong>Max Execution Time:</strong> ' . ini_get('max_execution_time') . 's</p>';
    echo '<p><strong>Memory Limit:</strong> ' . ini_get('memory_limit') . '</p>';
    echo '</div>';
    
    echo '<div class="info">';
    echo '<h2>File System Checks</h2>';
    
    // Check if submit.php exists
    if (file_exists($api_file)) {
        echo '<p class="success">✓ submit.php exists at: ' . $api_file . '</p>';
        echo '<p>File permissions: ' . substr(sprintf('%o', fileperms($api_file)), -4) . '</p>';
    } else {
        echo '<p class="error">✗ submit.php NOT FOUND at: ' . $api_file . '</p>';
    }
    
    // Check upload directory
    if (file_exists($upload_dir)) {
        echo '<p class="success">✓ Upload directory exists: ' . $upload_dir . '</p>';
        echo '<p>Directory permissions: ' . substr(sprintf('%o', fileperms($upload_dir)), -4) . '</p>';
        
        if (is_writable($upload_dir)) {
            echo '<p class="success">✓ Upload directory is writable</p>';
        } else {
            echo '<p class="error">✗ Upload directory is NOT writable</p>';
            echo '<p>Fix: chmod 755 ' . $upload_dir . '</p>';
        }
    } else {
        echo '<p class="error">✗ Upload directory does NOT exist: ' . $upload_dir . '</p>';
        echo '<p>Attempting to create...</p>';
        if (mkdir($upload_dir, 0755, true)) {
            echo '<p class="success">✓ Directory created successfully</p>';
        } else {
            echo '<p class="error">✗ Failed to create directory</p>';
        }
    }
    
    echo '</div>';
    
    echo '<div class="info">';
    echo '<h2>Test API Endpoint</h2>';
    echo '<p>Test the submit.php endpoint:</p>';
    echo '<p><a href="submit.php" target="_blank">Open submit.php (GET request)</a></p>';
    echo '<p>Expected: JSON response with configuration info</p>';
    echo '</div>';
    
    echo '<div class="info">';
    echo '<h2>Server Information</h2>';
    echo '<pre>';
    echo 'Server Software: ' . $_SERVER['SERVER_SOFTWARE'] . "\n";
    echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . "\n";
    echo 'Script Path: ' . __FILE__ . "\n";
    echo 'Real Path: ' . realpath(__FILE__) . "\n";
    echo '</pre>';
    echo '</div>';
    
    echo '<div class="info">';
    echo '<h2>Next Steps</h2>';
    echo '<ol>';
    echo '<li>Verify all checks show ✓ (green)</li>';
    echo '<li>Test submit.php endpoint (click link above)</li>';
    echo '<li>Try submitting the form on your website</li>';
    echo '<li>Check browser console for errors</li>';
    echo '<li>Check Hostinger error logs if issues persist</li>';
    echo '</ol>';
    echo '</div>';
    ?>
</body>
</html>

