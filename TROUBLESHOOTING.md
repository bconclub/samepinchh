# Troubleshooting Form Submission & File Upload

## Quick Debug Steps

### 1. Test PHP Endpoint Directly

Visit in browser:
```
https://samepinchh.com/api/submit.php
```

**Expected response (GET request):**
```json
{
  "success": true,
  "message": "API endpoint is working",
  "method": "GET",
  "php_version": "8.x.x",
  "upload_max_filesize": "5M",
  "post_max_size": "6M",
  ...
}
```

**If you get 404:**
- PHP file is not at `public_html/api/submit.php`
- Check file path on server

**If you get 500 error:**
- Check Hostinger error logs
- PHP syntax error or permission issue

### 2. Check Browser Console

Open browser DevTools (F12) → Console tab
- Look for error messages
- Check Network tab for failed requests
- Look at response details

### 3. Verify File Structure on Server

```
public_html/
├── api/
│   ├── submit.php          ← Must exist here
│   └── download.php
├── uploads/
│   └── audio-recordings/    ← Must exist with 755 permissions
│       └── .htaccess
└── [your Next.js files]
```

## Common Issues & Fixes

### Issue 1: 404 Not Found

**Symptoms:**
- Browser console shows 404 error
- Network tab shows request to `/api/submit.php` failed

**Fix:**
1. Verify file exists: `public_html/api/submit.php`
2. Check file permissions (should be 644)
3. Ensure file is actually uploaded (not just in local folder)

### Issue 2: CORS Error

**Symptoms:**
- Browser console: "CORS policy blocked"
- "Access-Control-Allow-Origin" error

**Fix:**
- CORS headers are already in `submit.php`
- If still failing, check if Hostinger has additional CORS restrictions
- Try adding to `.htaccess` in root:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
```

### Issue 3: File Size Limit Exceeded

**Symptoms:**
- Error: "File exceeds upload_max_filesize"
- Error code: UPLOAD_ERR_INI_SIZE

**Fix:**
1. Check Hostinger PHP settings:
   - `upload_max_filesize` should be ≥ 5M
   - `post_max_size` should be ≥ 6M

2. Create/update `public_html/.htaccess`:
```apache
php_value upload_max_filesize 5M
php_value post_max_size 6M
php_value max_execution_time 30
```

3. Or contact Hostinger support to increase limits

### Issue 4: Permission Denied

**Symptoms:**
- Error: "Failed to create upload directory"
- Error: "Upload directory is not writable"

**Fix:**
1. Set folder permissions:
```bash
chmod 755 public_html/uploads
chmod 755 public_html/uploads/audio-recordings
```

2. Via Hostinger File Manager:
   - Right-click folder → Change Permissions → 755

### Issue 5: POST Method Blocked

**Symptoms:**
- Error: "Method not allowed"
- 405 status code

**Fix:**
1. Check if `.htaccess` blocks POST:
   - Remove any `LimitRequestBody` or method restrictions

2. Check Hostinger security settings:
   - Some security plugins block POST to PHP files
   - Whitelist `/api/submit.php`

### Issue 6: File Not Saving

**Symptoms:**
- Form submits but file doesn't appear in folder
- Error: "Failed to save file"

**Fix:**
1. Check directory exists and is writable
2. Check disk space on server
3. Check PHP error logs in Hostinger hPanel
4. Verify `move_uploaded_file()` has permission

## Debug Mode

The updated `submit.php` includes debug information in error responses. Check the `debug` object in error responses for detailed information.

## Testing Checklist

- [ ] PHP endpoint accessible: `https://samepinchh.com/api/submit.php` (GET)
- [ ] Uploads directory exists: `public_html/uploads/audio-recordings/`
- [ ] Directory permissions: 755
- [ ] PHP upload limits: ≥ 5MB
- [ ] Test with text-only submission (no file)
- [ ] Test with small audio file (< 1MB)
- [ ] Test with larger audio file (3-4MB)
- [ ] Check browser console for errors
- [ ] Check Hostinger error logs

## Getting More Help

1. **Check Hostinger Error Logs:**
   - hPanel → Advanced → Error Log
   - Look for PHP errors related to uploads

2. **Enable PHP Error Logging:**
   Add to top of `submit.php` (temporarily):
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ini_set('log_errors', 1);
   ini_set('error_log', __DIR__ . '/../php-errors.log');
   ```

3. **Test with cURL:**
   ```bash
   curl -X POST https://samepinchh.com/api/submit.php \
     -F "name=Test" \
     -F "contact=1234567890" \
     -F "date=Test Date" \
     -F "story=Test message"
   ```

## Contact Support

If issues persist:
1. Collect error messages from browser console
2. Check Hostinger error logs
3. Test PHP endpoint directly (GET request)
4. Verify file structure and permissions
5. Contact Hostinger support with specific error messages


