'use client';

import Link from 'next/link';
import { BlogThemeProvider } from '@/components/another-me/digital-blog/BlogThemeProvider';
import FlickeringGrid from '@/components/another-me/digital-blog/FlickeringGrid';
import { getRelatedPosts } from '@/components/another-me/digital-blog/blog-posts';
import BlogCard from '@/components/another-me/digital-blog/BlogCard';
import '@/components/another-me/digital-blog/blog.css';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function parseContent(content) {
  const lines = content.trim().split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        if (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) continue;
        html += '</ul></li></ul>';
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith('### ')) {
      html += `<h3>${trimmed.slice(4)}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      html += `<h2>${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith('# ')) {
      html += `<h1>${trimmed.slice(2)}</h1>`;
    } else if (trimmed.startsWith('> ')) {
      html += `<blockquote>${trimmed.slice(2)}</blockquote>`;
    } else if (trimmed.startsWith('- ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${trimmed.slice(2)}</li>`;
    } else if (trimmed.match(/^\d+\. /)) {
      if (!inList) {
        html += '<ol>';
        inList = true;
      }
      html += `<li>${trimmed.replace(/^\d+\.\s*/, '')}</li>`;
    } else if (trimmed.startsWith('| ')) {
      // Skip table lines for simplicity
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${trimmed}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

export default function BlogPostClient({ post }) {
  const formattedDate = formatDate(post.date);
  const relatedPosts = getRelatedPosts(post.slug, post.tags, 3);
  const contentHtml = parseContent(post.content);

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

        <div
          className="relative z-10"
          style={{ borderBottom: '1px solid var(--blog-border)' }}
        >
          <div
            className="blog-post-container"
            style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div className="blog-post-meta">
              <Link href="/digital/blog" className="blog-post-back" aria-label="Back to all articles">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>
              {post.tags && post.tags.length > 0 && (
                <div className="blog-post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-post-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <time style={{ fontWeight: 500 }}>{formattedDate}</time>
            </div>

            <h1 className="blog-post-title">{post.title}</h1>

            {post.description && (
              <p className="blog-post-desc">{post.description}</p>
            )}
          </div>
        </div>

        <div
          className="blog-post-layout"
          style={{ borderBottom: '1px solid var(--blog-border)' }}
        >
          <div className="blog-post-side-border" />

          <main className="blog-post-main">
            {post.thumbnail && (
              <div className="blog-post-thumb">
                <img src={post.thumbnail} alt={post.title} />
              </div>
            )}
            <div className="blog-post-content">
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>

            {relatedPosts.length > 0 && (
              <div className="blog-post-related">
                <h2 className="related-title">Bài viết liên quan</h2>
                <div className="related-grid">
                  {relatedPosts.map((rp) => (
                    <BlogCard
                      key={rp.slug}
                      url={`/digital/blog/${rp.slug}`}
                      title={rp.title}
                      description={rp.description}
                      date={formatDate(rp.date)}
                      thumbnail={rp.thumbnail || undefined}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="blog-post-sidebar">
            <div className="blog-post-sidebar-inner">
              <div className="author-card">
                <div className="author-avatar">
                  <img src="/logo.png" alt="Tachy" />
                </div>
                <div>
                  <div className="author-name">{post.author || 'Tachy'}</div>
                  <div className="author-role">Digital Marketer</div>
                </div>
              </div>

              <div className="toc-wrapper">
                <h3 className="toc-title">Table of Contents</h3>
                <ul className="toc-list">
                  {(post.content.match(/^#{1,3} .+/gm) || []).map((heading) => {
                    const level = heading.match(/^#+/)[0].length;
                    const text = heading.replace(/^#+\s*/, '');
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <li key={id} className="toc-item">
                        <a
                          href={`#${id}`}
                          className={`toc-link h${level}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BlogThemeProvider>
  );
}
