'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function TagFilter({ tags, selectedTag, tagCounts }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    if (tag !== 'All') {
      params.set('tag', tag);
    }
    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="tag-filter-desktop">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
          >
            <span>{tag}</span>
            {tagCounts?.[tag] != null && (
              <span className="tag-count">{tagCounts[tag]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="tag-filter-mobile">
        <button
          onClick={() => setMobileOpen(true)}
          className="tag-filter-mobile-trigger"
        >
          <span className="capitalize">{selectedTag}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div
        className={`tag-filter-mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={`tag-filter-mobile-panel ${mobileOpen ? 'open' : ''}`}>
        <div className="tag-filter-mobile-header">Select Category</div>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`tag-filter-mobile-btn ${selectedTag === tag ? 'active' : ''}`}
          >
            <span>{tag}</span>
            {tagCounts?.[tag] != null && (
              <span className="tag-filter-mobile-count">{tagCounts[tag]}</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
