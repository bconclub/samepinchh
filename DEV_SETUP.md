# Development Setup Guide

## PHP Server Setup for Development

Next.js development server doesn't execute PHP files. You need to run a PHP server separately for form submissions to work during development.

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

