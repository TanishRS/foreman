import type { Metadata } from 'next';
import { Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const barlow = Barlow_Condensed({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
});

const plex = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Foreman — AI Automation Studio',
  description:
    'Foreman builds custom n8n workflows and the web systems around them — the unglamorous plumbing that saves you hours every week. Discovery first, always.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // font variables live on <html> so :root-level token vars can resolve them
    <html lang="en" className={`${barlow.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
