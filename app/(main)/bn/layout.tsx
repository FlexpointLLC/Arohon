import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'আরোহন', template: '%s | আরোহন' },
  openGraph: { locale: 'bn_BD' },
};

export default function BnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
