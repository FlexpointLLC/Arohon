import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'pfm6u125',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "mainImage": mainImage.asset->url,
  readTime
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  body,
  "mainImage": mainImage.asset->url,
  readTime
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;
