/**
 * MIGRATION PATH TO CMS:
 * 1. Create a CMS schema matching MusicRelease interface
 * 2. Replace `releases` array with async fetch from lib/cms.ts
 * 3. Update page.tsx to use: const releases = await getAllReleases()
 * 4. Update [slug]/page.tsx to use: const release = await getReleaseBySlug(slug)
 * All component interfaces remain unchanged.
 */

export interface StreamingLinks {
  spotify?: string
  youtube?: string
  apple_music?: string
  amazon_music?: string
  youtube_music?: string
  soundcloud?: string
  tidal?: string
  deezer?: string
}

export interface MusicRelease {
  id: string
  slug: string
  title: string
  type: 'EP' | 'Single' | 'Album' | 'Collab'
  release_date: string        // "YYYY-MM-DD"
  cover_art: string           // path under /public/images/releases/
  description?: string
  streaming_links: StreamingLinks
  featured: boolean
}

export const releases: MusicRelease[] = [
  {
    id: '1',
    slug: 'ep-the-love',
    title: 'EP. The Love',
    type: 'EP',
    release_date: '2024-02-14',
    cover_art: '/images/releases/ep-the-love.jpg',
    description: 'A heartfelt EP exploring love in all its forms.',
    streaming_links: {
      spotify: '#',
      youtube: '#',
      apple_music: '#',
      amazon_music: '#',
      youtube_music: '#',
      soundcloud: '#',
      tidal: '#',
      deezer: '#',
    },
    featured: true,
  },
  {
    id: '2',
    slug: 'cant-stop',
    title: "Can't Stop",
    type: 'Single',
    release_date: '2024-05-01',
    cover_art: '/images/releases/cant-stop.jpg',
    description: "Can't Stop is a high-energy track about relentless drive.",
    streaming_links: {
      spotify: '#',
      youtube: '#',
      apple_music: '#',
      amazon_music: '#',
      youtube_music: '#',
      soundcloud: '#',
      tidal: '#',
      deezer: '#',
    },
    featured: true,
  },
  {
    id: '3',
    slug: 'not-me',
    title: 'Not Me',
    type: 'Single',
    release_date: '2023-11-10',
    cover_art: '/images/releases/not-me.jpg',
    description: 'A moody introspective single.',
    streaming_links: {
      spotify: '#',
      youtube: '#',
      apple_music: '#',
      soundcloud: '#',
    },
    featured: false,
  },
  {
    id: '4',
    slug: 'like-me',
    title: 'Like Me',
    type: 'Single',
    release_date: '2023-07-20',
    cover_art: '/images/releases/like-me.jpg',
    streaming_links: {
      spotify: '#',
      youtube: '#',
      apple_music: '#',
      soundcloud: '#',
    },
    featured: false,
  },
  {
    id: '5',
    slug: 'lets-get-drunk',
    title: "Let's Get Drunk",
    type: 'Single',
    release_date: '2023-03-15',
    cover_art: '/images/releases/lets-get-drunk.jpg',
    streaming_links: {
      spotify: '#',
      youtube: '#',
      apple_music: '#',
      soundcloud: '#',
    },
    featured: false,
  },
]

// Helper: get single release by slug
export function getReleaseBySlug(slug: string): MusicRelease | undefined {
  return releases.find((r) => r.slug === slug)
}

// Helper: get all slugs (for generateStaticParams)
export function getAllReleaseSlugs(): string[] {
  return releases.map((r) => r.slug)
}
