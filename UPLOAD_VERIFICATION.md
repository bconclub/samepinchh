# PHP File Upload Verification

## Problem: 404 Error on `/api/submit.php`

The error shows that `https://samepinchh.com/api/submit.php` returns a 404 page, meaning the PHP file is not at that location on the server.

## Quick Fix Steps

### Step 1: Verify File Exists on Server

**Via Hostinger File Manager:**
1. Log in to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html/`
4. Check if `api/` folder exists
5. Check if `api/submit.php` exists inside

**Expected structure:**
```
public_html/
├── api/
│   ├── submit.php      ← MUST EXIST HERE
│   ├── download.php
│   └── test.php
├── uploads/
│   └── audio-recordings/
└── [your Next.js files]
```

### Step 2: Upload PHP Files Manually (If Missing)

If the files don't exist:

1. **Create `api` folder:**
   - In File Manager, go to `public_html/`
   - Click **New Folder**
   - Name it `api`

2. **Upload PHP files:**
   - Go into `public_html/api/`
   - Click **Upload**
   - Upload these files from your local `api/` folder:
     - `submit.php`
     - `download.php`
     - `test.php` (optional, for testing)

3. **Set permissions:**
   - Right-click `submit.php` → **Change Permissions** → `644`
   - Right-click `download.php` → **Change Permissions** → `644`

### Step 3: Test PHP File Directly

Visit in browser:
```
https://samepinchh.com/api/submit.php
```

**Expected response (GET):**
```json
{
  "success": true,
  "message": "API endpoint is working",
  "method": "GET",
  ...
}
```

**If still 404:**
- File is not at `public_html/api/submit.php`
- Check file path carefully
- Try `https://samepinchh.com/api/test.php` to verify

### Step 4: Use Automated Deployment

If files are missing, run:
```bash
npm run deploy
```

This will automatically upload:
- All Next.js build files
- PHP files to `public_html/api/`
- Create uploads directory
- Upload .htaccess file

### Step 5: Verify After Upload

1. **Test endpoint:**
   ```
   https://samepinchh.com/api/submit.php
   ```

2. **Test diagnostic page:**
   ```
   https://samepinchh.com/api/test.php
   ```

3. **Try form submission again**

## Alternative: Use Full URL

If the relative path isn't working, you can update the form to use the full URL. However, the issue is that the file doesn't exist on the server, so uploading it is the real fix.

## Common Issues

### Issue: File uploaded but still 404
- **Check:** File is in `public_html/api/submit.php` (not `public_html/submit.php`)
- **Check:** File permissions are 644
- **Check:** File extension is `.php` (not `.php.txt`)

### Issue: 500 Error instead of 404
- PHP syntax error
- Check Hostinger error logs
- Verify PHP version compatibility

### Issue: Still getting HTML response
- File exists but PHP isn't executing
- Check if PHP is enabled on Hostinger
- Verify file has `.php` extension

## Verification Checklist

- [ ] `public_html/api/` folder exists
- [ ] `public_html/api/submit.php` file exists
- [ ] File permissions are 644
- [ ] `https://samepinchh.com/api/submit.php` returns JSON (not 404)
- [ ] `https://samepinchh.com/api/test.php` shows diagnostic page
- [ ] Form submission works

## Next Steps

1. **Upload PHP files** (if missing)
2. **Test endpoint** in browser
3. **Try form submission** again
4. **Check browser console** for new errors

The 404 error will be resolved once the PHP file is uploaded to the correct location on the server.



