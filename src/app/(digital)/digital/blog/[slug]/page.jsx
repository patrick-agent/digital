import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/components/another-me/digital-blog/blog-posts';
import BlogPostClient from './BlogPostClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: `${post.title} — Another Me Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} — Another Me Blog`,
      description: post.description,
      type: 'article',
      url: `https://tachy.io.vn/digital/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Another Me Blog`,
      description: post.description,
    },
    alternates: {
      canonical: `https://tachy.io.vn/digital/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `https://tachy.io.vn/digital/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.author || 'Tachy',
    },
    datePublished: post.date,
    dateModified: post.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
