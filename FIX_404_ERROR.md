# Fix: 404 Error on Form Submission

## The Problem

The form is trying to POST to `/api/submit.php` but getting a 404 error. This means **the PHP file is not on the server** at that location.

## Immediate Solution

### Option 1: Upload PHP Files Now (Recommended)

1. **Log in to Hostinger hPanel**
2. **Open File Manager**
3. **Navigate to `public_html/`**
4. **Create `api` folder** (if it doesn't exist):
   - Click "New Folder"
   - Name it: `api`
5. **Upload PHP files:**
   - Go into `public_html/api/`
   - Click "Upload"
   - Upload these 3 files from your local `api/` folder:
     - ✅ `submit.php`
     - ✅ `download.php`
     - ✅ `test.php` (optional, for testing)

6. **Test immediately:**
   - Visit: `https://samepinchh.com/api/submit.php`
   - Should see JSON response (not 404)

### Option 2: Use Automated Deployment

Run this command to upload everything:
```bash
npm run deploy
```

This will automatically:
- Build the Next.js app
- Upload all files via FTP
- Upload PHP files to `public_html/api/`
- Create uploads directory

## Verify the Fix

After uploading, test:

1. **Visit in browser:**
   ```
   https://samepinchh.com/api/submit.php
   ```
   Should return JSON (not 404 HTML page)

2. **Try form submission again**
   - Should now work!

## Why This Happened

The PHP files exist in your local `api/` folder but were never uploaded to the server. The Next.js build only includes static files - PHP files must be uploaded separately.

## File Structure on Server

After fixing, your server should have:

```
public_html/
├── api/
│   ├── submit.php      ← THIS WAS MISSING
│   ├── download.php
│   └── test.php
├── uploads/
│   └── audio-recordings/
│       └── .htaccess
└── [Next.js build files]
```

## Updated Code

I've also updated the form to use absolute URLs (instead of relative), which will help avoid path issues. After you rebuild and upload, the form will use:
- `https://samepinchh.com/api/submit.php` (absolute)
- Instead of `/api/submit.php` (relative)

## Next Steps

1. ✅ Upload PHP files to server (see Option 1 above)
2. ✅ Test endpoint: `https://samepinchh.com/api/submit.php`
3. ✅ Rebuild app: `npm run build`
4. ✅ Upload new build (or run `npm run deploy`)
5. ✅ Test form submission

The 404 will be resolved once the PHP file is on the server!



