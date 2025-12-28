import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

const daylight = localFont({
  src: '../public/Daylight.ttf',
  variable: '--font-daylight',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  title: 'Samepinchh',
  description: 'Samepinchh. Same people. Same understanding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} ${daylight.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
