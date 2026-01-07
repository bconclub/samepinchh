# Development Setup Guide

## PHP Server Setup for Development

Next.js development server doesn't execute PHP files. You need to run a PHP server separately for form submissions to work during development.

### Installing PHP on Windows

If you get `'php' is not recognized`, you need to install PHP first:

**Option 1: Download PHP directly (Recommended)**
1. Download PHP from https://windows.php.net/download/
   - Choose "VS16 x64 Non Thread Safe" ZIP file (latest version)
2. Extract to `C:\php` (or any folder you prefer)
3. Add PHP to PATH:
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Click "New" → Add `C:\php`
   - Click OK on all dialogs
4. Restart PowerShell/terminal
5. Verify: Run `php -v` (should show PHP version)

**Option 2: Use XAMPP**
1. Download XAMPP from https://www.apachefriends.org/
2. Install it (includes PHP automatically)
3. PHP will be at `C:\xampp\php\php.exe`
4. Add `C:\xampp\php` to your PATH (see Option 1, step 3)

**Option 3: Use Chocolatey (if you have it)**
```powershell
choco install php
```

### Quick Setup

1. **Open a new terminal window** (keep Next.js dev server running in the first terminal)

2. **Navigate to project root:**
   ```bash
   cd C:\Users\user\Builds\Samepinchh
   ```

3. **Start PHP development server:**
   ```bash
   php -S localhost:8000
   ```

4. **Create `.env.local` file** in project root:
   ```
   NEXT_PUBLIC_UPLOAD_URL=http://localhost:8000/api/submit.php
   ```

5. **Restart Next.js dev server** (if it was already running)

### Alternative: Use Full Production URL

If you want to test against production server:

Create `.env.local`:
```
NEXT_PUBLIC_UPLOAD_URL=https://samepinchh.com/api/submit.php
```

### Verify Setup

1. PHP server should be running on `http://localhost:8000`
2. Test PHP endpoint: Visit `http://localhost:8000/api/submit.php` in browser
3. Should see JSON response (not 404)
4. Form submissions should now work in development

### Notes

- **Production**: PHP files are served by your web server (Hostinger), so no separate PHP server needed
- **Development**: You need both Next.js dev server (port 3000) and PHP server (port 8000) running
- The form will automatically use the URL from `NEXT_PUBLIC_UPLOAD_URL` environment variable

## Deployment to Hostinger

**Important:** Git push alone does NOT deploy files to Hostinger. You need to upload files to the server.

### How PHP Works on Hostinger

1. **Hostinger already has PHP installed** - You don't need to install PHP on the server
2. **PHP runs automatically** - When you upload PHP files to `public_html/api/`, Hostinger's web server will execute them
3. **Deploy using the script:**
   ```bash
   npm run deploy
   ```
   This uploads:
   - Your Next.js build files
   - PHP files (`api/submit.php`, `api/download.php`)
   - Creates uploads directory structure

### After Deployment

Once files are on Hostinger:
- PHP will run automatically (no setup needed)
- Visit `https://samepinchh.com/api/submit.php` to test
- Form submissions will work immediately

**Remember:** Git is just for version control. To actually deploy, you must upload files to Hostinger using `npm run deploy` or manually via FTP/File Manager.

