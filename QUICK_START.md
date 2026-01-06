# Quick Start - Deploy to Hostinger

## Your build is ready! 🎉

The Next.js application has been built successfully. All files are in the `out/` directory.

## Deploy Now (3 Options)

### 🚀 Option 1: Automated Deployment (Easiest)

Simply run:
```bash
npm run deploy
```

This will:
- ✅ Upload all files automatically via FTP
- ✅ Upload PHP backend files
- ✅ Create uploads directory
- ✅ Set up security files

**Note:** FTP credentials are already configured in `scripts/deploy.js`

---

### 📁 Option 2: Manual Upload via Hostinger File Manager

1. **Log in to Hostinger hPanel**
2. **Open File Manager**
3. **Upload Next.js files:**
   - Go to `public_html/`
   - Upload ALL files from `out/` directory
4. **Create API directory:**
   - Create `public_html/api/` folder
   - Upload `api/submit.php` → `public_html/api/submit.php`
   - Upload `api/download.php` → `public_html/api/download.php`
5. **Create uploads directory:**
   - Create `public_html/uploads/audio-recordings/` folder
   - Set permissions to 755
   - Upload `uploads/audio-recordings/.htaccess` → `public_html/uploads/audio-recordings/.htaccess`

---

### 🔌 Option 3: Manual Upload via FTP Client

1. **Connect to FTP:**
   - Host: `82.25.107.25`
   - User: `u550740391.samepinchh.com`
   - Port: `21`

2. **Upload files:**
   - Upload `out/*` → `public_html/`
   - Upload `api/*.php` → `public_html/api/`
   - Upload `uploads/audio-recordings/.htaccess` → `public_html/uploads/audio-recordings/`

---

## After Deployment

1. **Visit your website** - Should load immediately
2. **Test the form:**
   - Fill out contact form
   - Try text submission
   - Try audio recording
3. **Verify uploads:**
   - Check `public_html/uploads/audio-recordings/` for uploaded files

## Need Help?

- **Detailed setup:** See `HOSTINGER_SETUP.md`
- **Deployment checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **Build info:** See `BUILD_READY.md`

---

## Files to Upload Summary

```
✅ out/ directory → public_html/
✅ api/submit.php → public_html/api/submit.php
✅ api/download.php → public_html/api/download.php
✅ uploads/audio-recordings/.htaccess → public_html/uploads/audio-recordings/.htaccess
```

**That's it! Your site is ready to go live.** 🚀

