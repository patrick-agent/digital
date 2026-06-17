'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from './blog-theme';
import { useHydrated } from '@/hooks/useHydrated';

const BlogThemeContext = createContext(null);

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }) {
  const hydrated = useHydrated();
  const [theme, setTheme] = useState(() => getStoredTheme());

  useEffect(() => {
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

  if (!hydrated) {
    return <div className="blog-wrapper dark">{children}</div>;
  }

  return (
    <BlogThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`blog-wrapper ${theme}`}>{children}</div>
    </BlogThemeContext.Provider>
  );
}
