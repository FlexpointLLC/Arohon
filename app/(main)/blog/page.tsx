import type { Metadata } from 'next';
import { client, POSTS_QUERY } from '@/lib/sanity';
import { BLOG_URL } from '@/lib/seo';
import type { BlogPost } from '@/components/BlogSection';
import { BlogList } from '@/components/blog/BlogList';

export const revalidate = 60; // Revalidate every 60 seconds to show new posts

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: 'Journal | Stories from the road',
  description: 'Ride tips, product news and stories from Arohon, the Bangladeshi ride and delivery app.',
  alternates: { canonical: '/' },
};

export default async function BlogPage() {
  const posts = await client.fetch<BlogPost[]>(POSTS_QUERY);
  // on blogs.arohon.co posts live at /slug; in local dev (no rewrite) at /blog/slug. Reading headers would make the page dynamic.
  const hrefBase = process.env.NODE_ENV === 'development' ? '/blog' : '';
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <BlogList posts={posts} hrefBase={hrefBase} />
    </main>
  );
}
