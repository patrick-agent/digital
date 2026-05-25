'use client';

import { useSearchParams } from 'next/navigation';
import { BlogThemeProvider } from '@/components/another-me/digital-blog/BlogThemeProvider';
import FlickeringGrid from '@/components/another-me/digital-blog/FlickeringGrid';
import BlogCard from '@/components/another-me/digital-blog/BlogCard';
import TagFilter from '@/components/another-me/digital-blog/TagFilter';
import { getAllPosts, getAllTags, getTagCounts } from '@/components/another-me/digital-blog/blog-posts';
import '@/components/another-me/digital-blog/blog.css';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogClient() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') || 'All';

  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const tagCounts = getTagCounts();

  const filteredPosts =
    selectedTag === 'All'
      ? allPosts
      : allPosts.filter((post) => (post.tags || []).includes(selectedTag));

  return (
    <BlogThemeProvider>
      <div className="min-h-screen" style={{ background: 'var(--blog-bg)' }}>
        <div className="absolute top-0 left-0 z-0 w-full h-[200px] flicker-mask">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>

        <div className="blog-header">
          <div className="blog-header-inner">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h1 className="blog-title">Another Me Blog</h1>
              <p className="blog-subtitle">
                Digital Marketing insights, chiến lược, và kiến thức từ Tachy.
              </p>
            </div>
          </div>
          {allTags.length > 0 && (
            <div className="blog-header-inner">
              <TagFilter
                tags={allTags}
                selectedTag={selectedTag}
                tagCounts={tagCounts}
              />
            </div>
          )}
        </div>

        <div className="blog-grid-container">
          <div
            className={`blog-grid ${filteredPosts.length < 4 ? 'border-bottom' : ''}`}
            style={{
              borderLeft: '1px solid var(--blog-border)',
              borderRight: '1px solid var(--blog-border)',
            }}
          >
            {filteredPosts.length === 0 && (
              <p className="empty-text" style={{ gridColumn: '1 / -1' }}>
                No posts found in this category.
              </p>
            )}
            {filteredPosts.map((post) => {
              const date = formatDate(post.date);
              return (
                <BlogCard
                  key={post.slug}
                  url={`/digital/blog/${post.slug}`}
                  title={post.title}
                  description={post.description}
                  date={date}
                  thumbnail={post.thumbnail || undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    </BlogThemeProvider>
  );
}
