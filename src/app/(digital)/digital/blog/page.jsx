import { Suspense } from 'react';
import BlogClient from './BlogClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Blog Digital Marketing & Creative Strategy | Another Me',
  description: 'Bài viết về digital marketing, content strategy, SEO và hệ thống tăng trưởng từ góc nhìn thực chiến của Tachy.',
  path: '/digital/blog',
  keywords: ['digital marketing', 'content strategy', 'SEO', 'growth systems', 'Another Me'],
});

export default function DigitalBlogPage() {
  return (
    <Suspense fallback={<div className="blog-wrapper dark" style={{ minHeight: '100vh', padding: '48px' }}><p style={{ color: '#999' }}>Loading articles...</p></div>}>
      <BlogClient />
    </Suspense>
  );
}
