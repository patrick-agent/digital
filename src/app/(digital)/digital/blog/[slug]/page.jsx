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
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <BlogPostClient post={post} />;
}
