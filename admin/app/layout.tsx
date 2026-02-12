import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Arohon Admin",
  description: "Admin dashboard for Arohon ride-sharing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakarta.variable} min-h-screen bg-slate-900 text-slate-100 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
