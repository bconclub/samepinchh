import SessionPageClient from './SessionPageClient';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // Return a placeholder param - actual sessions are handled client-side
  // This satisfies Next.js static export requirement
  return [{ sessionId: 'placeholder' }];
}

export default function SessionPage() {
  return <SessionPageClient />;
}
