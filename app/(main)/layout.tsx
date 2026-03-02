import { headers } from 'next/headers';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const isBlogSite = host === 'blogs.arohon.co' || host === 'blog.arohon.co';

  return (
    <>
      <NavBar isBlogSite={isBlogSite} />
      {children}
      <Footer isBlogSite={isBlogSite} />
    </>
  );
}
