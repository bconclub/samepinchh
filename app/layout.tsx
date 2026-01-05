import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
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

const classyvogue = localFont({
  src: '../public/Classyvogueregular.ttf',
  variable: '--font-classyvogue',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  title: 'Samepinchh - Not Therapy, Just Real Conversations',
  description: 'Samepinchh. Same people. Same understanding.',
  icons: {
    icon: '/Samepinch-Icon-V1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} ${classyvogue.variable} antialiased`} suppressHydrationWarning>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZRFTNW5GC6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZRFTNW5GC6');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
