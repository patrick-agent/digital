import { Suspense } from 'react';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog — Another Me',
  description: 'Digital Marketing insights, chiến lược, và kiến thức từ Tachy.',
};

export default function DigitalBlogPage() {
  return (
    <Suspense fallback={<div className="blog-wrapper dark" style={{ minHeight: '100vh', padding: '48px' }}><p style={{ color: '#999' }}>Loading articles...</p></div>}>
      <BlogClient />
    </Suspense>
  );
}
