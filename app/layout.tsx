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
  openGraph: {
    title: 'Samepinchh',
    description: 'Survived something that changed everything? Connect with people who get it.',
    images: [
      {
        url: 'https://samepinchh.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Samepinchh',
      },
    ],
    type: 'website',
    siteName: 'Samepinchh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samepinchh',
    description: 'Survived something that changed everything? Connect with people who get it.',
    images: ['https://samepinchh.com/og-image.jpg'],
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
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ux0u1wgc21");
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
