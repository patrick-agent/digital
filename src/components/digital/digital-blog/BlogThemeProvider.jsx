'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from './blog-theme';

const BlogThemeContext = createContext(null);

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());

    const handler = (e) => {
      setTheme(e.detail);
    };
    window.addEventListener('blog-theme-change', handler);
    return () => window.removeEventListener('blog-theme-change', handler);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      window.dispatchEvent(new CustomEvent('blog-theme-change', { detail: next }));
      return next;
    });
  };

  if (!mounted) {
    return <div className="blog-wrapper dark">{children}</div>;
  }

  return (
    <BlogThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`blog-wrapper ${theme}`}>{children}</div>
    </BlogThemeContext.Provider>
  );
}
