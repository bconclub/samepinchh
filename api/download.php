<?php
/**
 * Secure Audio File Download Handler
 * 
 * Allows authorized access to audio recordings
 * Usage: /api/download.php?file=timestamp_name.webm
 */

// Configuration
$upload_dir = __DIR__ . '/../uploads/audio-recordings/';
$allowed_extensions = ['webm', 'ogg', 'mp3', 'wav'];

// Get filename from query parameter
$file_name = isset($_GET['file']) ? basename($_GET['file']) : '';

if (empty($file_name)) {
    http_response_code(400);
    die('File name is required');
}

// Validate file extension
$extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
if (!in_array($extension, $allowed_extensions)) {
    http_response_code(400);
    die('Invalid file type');
}

// Prevent path traversal
$file_name = basename($file_name);
$file_path = $upload_dir . $file_name;

// Verify file exists
if (!file_exists($file_path)) {
    http_response_code(404);
    die('File not found');
}

// Optional: Add authentication/authorization here
// For example, check for admin session or API key
/*
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    http_response_code(403);
    die('Access denied');
}
*/

// Optional: Log download access
// error_log("Audio file downloaded: " . $file_name . " by " . $_SERVER['REMOTE_ADDR']);

// Set headers for file download
$mime_types = [
    'webm' => 'audio/webm',
    'ogg' => 'audio/ogg',
    'mp3' => 'audio/mpeg',
    'wav' => 'audio/wav'
];

$mime_type = $mime_types[$extension] ?? 'application/octet-stream';

header('Content-Type: ' . $mime_type);
header('Content-Length: ' . filesize($file_path));
header('Content-Disposition: inline; filename="' . $file_name . '"');
header('Cache-Control: private, max-age=3600');

// Output file
readfile($file_path);
exit;
?>

