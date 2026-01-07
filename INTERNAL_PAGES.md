# Internal Pages - Route Links

This document lists all internal pages created in the Samepinchh application.

## Public Pages

### 1. Home Page
- **Route:** `/`
- **File:** `app/page.tsx`
- **Description:** Main landing page with hero, video, carousel, social proof, and contact form
- **Link:** `http://localhost:3000/` (dev) or `https://yourdomain.com/` (production)

### 2. Thank You Page
- **Route:** `/thank-you`
- **File:** `app/thank-you/page.tsx`
- **Description:** Confirmation page shown after form submission
- **Link:** `http://localhost:3000/thank-you` (dev) or `https://yourdomain.com/thank-you` (production)

## Internal/User Pages

### 3. Connections Page (User Connections/Leads)
- **Route:** `/connections`
- **File:** `app/connections/page.tsx`
- **Description:** View user connections/leads with search and filter functionality
- **Features:**
  - View all connections
  - Search by name or notes
  - Filter by recent (last 7 days)
  - Edit notes for each connection
  - Click to view session details
- **Link:** `http://localhost:3000/connections` (dev) or `https://yourdomain.com/connections` (production)

### 4. Spaces/Radar Page (Find Users)
- **Route:** `/spaces`
- **File:** `app/spaces/page.tsx`
- **Description:** Radar page to find and connect with online users
- **Features:**
  - View online users count
  - Toggle online/offline status
  - Find and connect with other users
- **Link:** `http://localhost:3000/spaces` (dev) or `https://yourdomain.com/spaces` (production)

### 5. Session Page (Individual Match Session)
- **Route:** `/spaces/session/[sessionId]`
- **File:** `app/spaces/session/[sessionId]/page.tsx`
- **Description:** Individual session/match page showing session details
- **Features:**
  - View session information
  - Real-time session updates
  - Leave session option
- **Link:** `http://localhost:3000/spaces/session/{sessionId}` (dev) or `https://yourdomain.com/spaces/session/{sessionId}` (production)
- **Example:** `http://localhost:3000/spaces/session/123e4567-e89b-12d3-a456-426614174000`

## Quick Access Links (Development)

```
Home:              http://localhost:3000/
Thank You:         http://localhost:3000/thank-you
Connections:       http://localhost:3000/connections
Spaces/Radar:      http://localhost:3000/spaces
Session (example): http://localhost:3000/spaces/session/[session-id]
```

## Quick Access Links (Production)

Replace `yourdomain.com` with your actual domain:

```
Home:              https://yourdomain.com/
Thank You:         https://yourdomain.com/thank-you
Connections:       https://yourdomain.com/connections
Spaces/Radar:      https://yourdomain.com/spaces
Session (example): https://yourdomain.com/spaces/session/[session-id]
```

## Notes

- **Connections Page** requires user authentication (uses localStorage for user ID)
- **Spaces Page** requires user authentication (creates/uses user ID from localStorage)
- **Session Page** requires a valid session ID from the URL parameter
- All pages use Supabase for data (ensure environment variables are set)

## Environment Setup Required

To use the internal pages, you need to set these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

See `SUPABASE_SETUP.md` for detailed setup instructions.

