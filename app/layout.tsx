import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arohon',
  description: 'Track your ride',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
