# Hostinger Backend Storage Setup Guide

This guide will help you set up audio recording storage on your Hostinger server.

## Prerequisites

- Hostinger hosting account with PHP support
- FTP/SSH access to your server
- Basic knowledge of file permissions

## Step 1: Folder Structure Setup

### Option A: Using Hostinger File Manager

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to **File Manager**
3. Go to your website's root directory (usually `public_html`)
4. Create the following folder structure:
   ```
   public_html/
     uploads/
       audio-recordings/
   ```

### Option B: Using SSH (if available)

```bash
# SSH into your Hostinger server
ssh your-username@your-domain.com

# Navigate to public_html
cd public_html

# Create directories
mkdir -p uploads/audio-recordings
```

## Step 2: Set Folder Permissions

### Using File Manager:
1. Right-click on `uploads` folder → **Change Permissions**
2. Set to `755` (or `rwxr-xr-x`)
3. Right-click on `audio-recordings` folder → **Change Permissions**
4. Set to `755` (or `rwxr-xr-x`)

### Using SSH:
```bash
chmod 755 uploads
chmod 755 uploads/audio-recordings
```

## Step 3: Upload PHP Files

Upload the following files to your server:

1. **`api/submit.php`** → Upload to `public_html/api/submit.php`
2. **`api/download.php`** → Upload to `public_html/api/download.php`
3. **`uploads/audio-recordings/.htaccess`** → Upload to `public_html/uploads/audio-recordings/.htaccess`

### Using File Manager:
1. Navigate to the target directory
2. Click **Upload** button
3. Select the files and upload

### Using FTP:
```bash
# Upload files via FTP client (FileZilla, etc.)
# Or use command line:
scp api/submit.php your-username@your-domain.com:public_html/api/
scp api/download.php your-username@your-domain.com:public_html/api/
scp uploads/audio-recordings/.htaccess your-username@your-domain.com:public_html/uploads/audio-recordings/
```

## Step 4: Configure PHP Settings

### Check PHP Upload Limits

1. In Hostinger hPanel, go to **Advanced** → **PHP Configuration**
2. Ensure the following settings:
   - `upload_max_filesize = 5M`
   - `post_max_size = 6M`
   - `max_execution_time = 30`

### Alternative: Create `.htaccess` in Root

If you can't modify PHP settings directly, create/update `public_html/.htaccess`:

```apache
php_value upload_max_filesize 5M
php_value post_max_size 6M
php_value max_execution_time 30
```

## Step 5: Configure Environment Variables

In your Next.js application, set the following environment variables:

### For Development (`.env.local`):
```env
NEXT_PUBLIC_UPLOAD_URL=http://localhost/api/submit.php
NEXT_PUBLIC_DOWNLOAD_URL=http://localhost/api/download.php
```

### For Production (Hostinger):
```env
NEXT_PUBLIC_UPLOAD_URL=https://yourdomain.com/api/submit.php
NEXT_PUBLIC_DOWNLOAD_URL=https://yourdomain.com/api/download.php
```

**Note:** Since your Next.js app uses `output: 'export'` (static export), you'll need to:
1. Build the app locally with these environment variables
2. Upload the built files to Hostinger
3. Or use Hostinger's environment variable settings if available

## Step 6: Test the Upload

1. Visit your website
2. Fill out the contact form
3. Record an audio message (or type text)
4. Submit the form
5. Check `public_html/uploads/audio-recordings/` to verify the file was uploaded

## Step 7: Security Configuration (Optional but Recommended)

### Enable HTTPS
1. In Hostinger hPanel, go to **SSL/TLS**
2. Install a free SSL certificate (Let's Encrypt)
3. Force HTTPS redirect

### Secure Download Script
The `download.php` script includes optional authentication. To enable:

1. Edit `api/download.php`
2. Uncomment the authentication section:
```php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    http_response_code(403);
    die('Access denied');
}
```

3. Create an admin login page if needed

## Step 8: Database Storage (Optional)

If you want to store submission metadata in a database:

1. **Create Database:**
   - In Hostinger hPanel, go to **Databases** → **MySQL Databases**
   - Create a new database and user

2. **Create Table:**
```sql
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    date VARCHAR(255),
    story_text TEXT,
    audio_file VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255)
);
```

3. **Update `api/submit.php`:**
   - Uncomment the database section
   - Update connection credentials:
```php
$pdo = new PDO(
    "mysql:host=localhost;dbname=your_database",
    "your_username",
    "your_password"
);
```

## Step 9: Email Notifications (Optional)

To receive email notifications for new submissions:

1. Edit `api/submit.php`
2. Uncomment the email section
3. Update the recipient email:
```php
$to = "your-email@example.com";
```

## Troubleshooting

### Issue: "Failed to create upload directory"
**Solution:** Check folder permissions (should be 755) and ensure PHP has write access.

### Issue: "File size exceeds limit"
**Solution:** 
- Check PHP `upload_max_filesize` and `post_max_size` settings
- Verify file is under 5MB

### Issue: "Invalid file type"
**Solution:** 
- Check that the audio file is one of: webm, ogg, mp3, wav
- Verify MIME type validation in `submit.php`

### Issue: "CORS errors"
**Solution:** The PHP script includes CORS headers. If issues persist, check your server's CORS configuration.

### Issue: Files not uploading
**Solution:**
- Check PHP error logs in Hostinger hPanel
- Verify `uploads/audio-recordings/` folder exists and has correct permissions
- Test PHP file upload functionality separately

## File Structure Summary

```
public_html/
├── api/
│   ├── submit.php          # Upload handler
│   └── download.php        # Secure download handler
├── uploads/
│   └── audio-recordings/
│       ├── .htaccess       # Prevent direct access
│       └── [audio files]   # Uploaded recordings
└── [your Next.js build files]
```

## Security Checklist

- [ ] Folder permissions set to 755
- [ ] `.htaccess` in place to prevent direct access
- [ ] PHP upload limits configured
- [ ] HTTPS enabled
- [ ] File type validation working
- [ ] File size limits enforced
- [ ] Filenames sanitized
- [ ] Path traversal protection enabled

## Support

For Hostinger-specific issues, contact Hostinger support.
For application issues, check the PHP error logs in hPanel → **Advanced** → **Error Log**.

