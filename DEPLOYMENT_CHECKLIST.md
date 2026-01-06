# Deployment Checklist

## Pre-Deployment

- [ ] Update `.env.production` with your actual domain URLs
- [ ] Verify PHP files are ready (`api/submit.php`, `api/download.php`)
- [ ] Ensure `.htaccess` file exists in `uploads/audio-recordings/`

## Build Process

1. **Build the Next.js app:**
   ```bash
   npm run build
   ```
   This will create the `out/` directory with all static files.

2. **Verify build output:**
   - Check that `out/` directory exists
   - Verify all HTML, CSS, and JS files are present

## Deployment Options

### Option 1: Automated Deployment (Recommended)
```bash
npm run deploy
```
This will:
- Build the Next.js app
- Upload all files via FTP
- Upload PHP files
- Create uploads directory structure
- Upload .htaccess file

### Option 2: Manual Upload via File Manager

1. **Upload Next.js build files:**
   - Go to Hostinger File Manager
   - Navigate to `public_html`
   - Upload all contents from `out/` directory

2. **Upload PHP files:**
   - Create `public_html/api/` directory
   - Upload `api/submit.php` → `public_html/api/submit.php`
   - Upload `api/download.php` → `public_html/api/download.php`

3. **Create uploads directory:**
   - Create `public_html/uploads/audio-recordings/`
   - Set permissions to 755
   - Upload `uploads/audio-recordings/.htaccess` → `public_html/uploads/audio-recordings/.htaccess`

### Option 3: Manual Upload via FTP

Use an FTP client (FileZilla, WinSCP, etc.) to upload:
- All files from `out/` directory → `public_html/`
- `api/submit.php` → `public_html/api/submit.php`
- `api/download.php` → `public_html/api/download.php`
- `uploads/audio-recordings/.htaccess` → `public_html/uploads/audio-recordings/.htaccess`

## Post-Deployment

- [ ] Verify website loads correctly
- [ ] Test form submission with text message
- [ ] Test form submission with audio recording
- [ ] Verify audio files are saved in `uploads/audio-recordings/`
- [ ] Check that audio player works on thank-you page
- [ ] Verify file permissions (755 for directories, 644 for files)
- [ ] Test download script: `/api/download.php?file=test.webm`

## Troubleshooting

### Build Issues
- Clear `.next` and `out` directories: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Upload Issues
- Verify FTP credentials in `scripts/deploy.js`
- Check file permissions on server
- Ensure PHP is enabled on Hostinger

### Runtime Issues
- Check PHP error logs in Hostinger hPanel
- Verify environment variables are set correctly
- Test PHP files directly: `https://yourdomain.com/api/submit.php`

