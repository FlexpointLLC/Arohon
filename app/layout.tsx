import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  title: 'Arohon - Move Smarter with the Future of Ride Sharing',
  description:
    'Book rides instantly, track drivers in real time, and manage operations effortlessly. A powerful ride-sharing platform built for speed, safety, and scale.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className={`antialiased ${inter.className}`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
