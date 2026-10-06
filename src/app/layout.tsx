import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai } from 'next/font/google';
import './globals.css';

const plexThai = IBM_Plex_Sans_Thai({
  variable: '--font-plex-thai',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'RADIANT Coffee & Bakery',
  description: 'คำนวณต้นทุนและบันทึกยอดขายร้านกาแฟ',
  manifest: '/manifest.json',
  icons: { icon: '/assets/shop-logo.svg', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: 'Coffee Manager', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#4A2C0A',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="th" className={`${plexThai.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
