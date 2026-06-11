# DESIGN.md

## Purpose

This file captures the current design language of the Tachy website so future UI work stays visually consistent across the public site, the Digital persona, the shop, the blog, and the admin CMS.

It is a description of the current system, not an abstract brand deck.

## Product Surfaces

The website currently has three distinct visual systems:

1. Public artist site
   Paths: `/`, `/about`, `/contact`, `/blog`, `/bio-music`, `/shop`, legal pages.

2. Digital persona site
   Path: `/digital`
   Code references were renamed from `another-me` to `digital` in a bulk cleanup.

3. Admin CMS
   Path: `/admin`

Each system should remain internally coherent. Do not accidentally mix admin styling into the public site, or public glassmorphism into admin screens.

## Shared Brand Foundation

The three surfaces now share one foundation layer for brand color and typography.

Primary sources:

- `src/styles/design-tokens.css`
- `src/app/globals.css`
- `src/app/admin/globals.css`
- `src/components/digital/digital-vars.css`

## Design Intent

### 1. Public artist site

The public site is a dark, futuristic, music-first interface.

Core attributes:

- cinematic
- neon but restrained
- glassy, layered, and atmospheric
- premium indie artist, not gamer UI
- interactive, but not chaotic

The dominant mood comes from:

- near-black backgrounds
- purple-indigo-pink gradients
- soft glows and blurred light fields
- large hero typography
- glass cards with subtle borders
- 3D character and shader-driven motion

### 2. Digital persona site

The Digital persona is also dark, but more editorial and strategic than the main artist homepage.

Core attributes:

- professional
- futuristic
- presentation-like
- narrative sections with strong visual transitions

This surface is more modular and section-driven than the main site. It leans on themed background effects, Spline scenes, and showcase layouts.

### 3. Admin CMS

The admin is intentionally a separate, light, productivity-first system.

Core attributes:

- clean
- neutral
- fast to scan
- operational rather than expressive

## Shared Visual Foundation

Primary sources:

- `src/styles/design-tokens.css`
- `src/app/globals.css`

### Color palette

Shared brand tokens:

- `--brand-primary: #a855f7`
- `--brand-primary-strong: #7c3aed`
- `--brand-secondary: #6366f1`
- `--brand-secondary-strong: #4f46e5`
- `--brand-tertiary: #ec4899`
- `--brand-tertiary-strong: #db2777`

Public surface tokens:

- `--bg-primary: #060608`
- `--bg-secondary: #0c0c12`
- `--bg-tertiary: #12121c`
- `--bg-card: rgba(16, 16, 28, 0.6)`
- `--bg-glass: rgba(18, 18, 30, 0.4)`

- `--accent-primary: #a855f7`
- `--accent-secondary: #6366f1`
- `--accent-tertiary: #ec4899`
- `--accent-warm: #f59e0b`
- `--accent-cool: #06b6d4`

- `--text-primary: #f0f0f5`
- `--text-secondary: #a0a0b8`
- `--text-muted: #5a5a72`

Design implication:

- Purple is the main identity color.
- Indigo supports structure and depth.
- Pink is used as emotional heat, not as a default fill color.
- Warm amber and cool cyan are supporting accents, used sparingly.

### Gradients

Current standard gradients:

- `--gradient-primary`: purple to indigo
- `--gradient-warm`: pink to amber
- `--gradient-cool`: indigo to cyan
- `--gradient-text`: light to purple to pink

Rules:

- Use gradients on headings, CTAs, glows, and micro-accents.
- Do not flood large content areas with saturated gradients.
- The base surface should remain dark and readable.

### Typography

Primary sources:

- `src/app/layout.js`
- `src/styles/design-tokens.css`

Fonts loaded today:

- Geist Sans via `--font-geist-sans`
- Geist Mono via `--font-geist-mono`
- Caveat via `--font-caveat`

Shared typography aliases:

- `--font-sans-ui`
- `--font-mono-ui`
- `--font-script-ui`

Standard roles across all three surfaces:

- Heading: `var(--font-heading)` -> Geist Sans
- Body: `var(--font-body)` -> Geist Sans
- Mono labels: `var(--font-mono)` -> Geist Mono
- Handwritten accent: `var(--font-accent)` / Caveat, used sparingly

Type behavior:

- headings are heavy, tight, and slightly condensed by tracking
- labels and overlines use mono uppercase
- body copy is softer and more muted than headings
- gradient text is a signature pattern for major titles
- admin also uses the same core type family, but without expressive gradient treatment

### Spacing

Key tokens:

- `--space-xs` to `--space-4xl`
- `--space-section: 8rem`

Rules:

- Public sections should feel open and cinematic.
- Use generous vertical breathing room before adding more ornament.
- Section spacing is part of the brand feel; avoid cramped stacks.

### Shape system

Tokens:

- `--radius-sm: 4px`
- `--radius-md: 8px`
- `--radius-lg: 12px`
- `--radius-xl: 16px`
- `--radius-2xl: 24px`
- `--radius-full: 9999px`

Rules:

- Pills are used for nav links, tags, chips, and CTA variants.
- Cards are rounded but not soft-bubbly.
- The site should feel precise, not playful.

### Shadows and glows

Tokens:

- `--shadow-sm` through `--shadow-xl`
- `--glow-purple`
- `--glow-pink`
- `--glow-cyan`

Rules:

- Glow should emphasize interaction or importance.
- Glow is usually purple-first.
- Avoid stacking too many competing glow colors in one component.

## Global Public Layout Rules

### Background model

The public site always starts from darkness.

`body::before` in `src/app/globals.css` adds atmospheric radial lighting. Most sections layer additional effects on top of that base.

Rules:

- Keep the base page visually dark enough that glows remain legible.
- Background effects should frame content, not overpower it.

### Navigation

Primary source: `src/components/layout/Navbar.jsx` and `Navbar.module.css`

Behavior:

- fixed transparent header at page top
- blurred glass header on scroll
- centered pill nav on desktop
- slide-in drawer on mobile
- gradient CTA on the right

Visual pattern:

- small logo block with gradient/glow
- brand name in gradient text
- nav links in a frosted pill container
- active route/section shown with a purple-tinted fill

Rules:

- Desktop nav should feel floating and precise.
- Mobile nav should feel like a high-end overlay, not a default panel.
- Header blur is part of the identity; preserve it when adjusting scroll states.

### Footer

Primary source: `src/components/layout/Footer.jsx` and `Footer.module.css`

Behavior:

- dramatic dark gradient footer
- animated shooting stars
- lazy-loaded 3D footer effects
- structured content split between brand story, nav, and socials

Rules:

- Footer is atmospheric, not minimal.
- It should feel like a closing scene, not a utility strip.
- Preserve the contrast between expressive background and readable text columns.

## Shared Public Component Patterns

### Glass panels

Primary source: `src/components/ui/GlassPanel.jsx`

This is one of the core public patterns.

Variants:

- `default`
- `elevated`
- `dark`

Options:

- glow
- cyber border
- rotating border
- hover glow

Rules:

- Use glass panels for information blocks, embedded media, and featured content.
- Use rotating or cyber borders only when the component deserves high attention.
- Do not apply every effect at once.

### Section titles

Primary source: `src/components/ui/SectionTitle.jsx`

Pattern:

- mono capsule subtitle
- large gradient heading
- strong vertical spacing beneath

Rules:

- Section titles should anchor page rhythm.
- Use them for major content blocks, not for every small panel.

### Cards

Across public pages, cards usually share these traits:

- dark translucent surface
- subtle border
- purple hover emphasis
- soft vertical lift on hover
- mono labels + larger content title

Common examples:

- blog cards
- shop product cards
- release cards
- glass content panels

### Chips, pills, and tags

Common roles:

- navigation chips
- category filters
- article tags
- metadata badges

Rules:

- Chips are compact and mono-friendly.
- Active chips should use tinted fill, not only border changes.

### CTA buttons

Public CTA standard:

- rounded full pill
- gradient background
- white text
- hover lift plus glow

Rules:

- Main CTA uses gradient.
- Secondary CTA should still feel premium, often via glass or outlined treatment.

## Motion System

Current stack:

- GSAP + ScrollTrigger
- Framer Motion
- Three.js / React Three Fiber
- Spline
- OGL-based effects

### Motion principles

1. Motion should reveal hierarchy.
2. Motion should support mood, not distract from reading.
3. 3D and shader effects should be gated on device capability.

This gating is already visible in places like:

- `HeroSection.jsx`
- `AboutSection.jsx`
- `MusicSection.jsx`
- `ContactSection.jsx`

Common safeguards already in use:

- reduced motion checks
- mobile fallbacks
- slow network fallbacks
- lazy loading below the fold

Rules:

- New heavy motion should follow the same performance discipline.
- Prefer transform and opacity transitions for standard UI.
- Preserve clear non-animated fallbacks.

## Homepage Design

Primary composition:

- `src/app/page.js`
- `src/components/sections/*`
- `src/components/HomeLazySections.jsx`

### Structure

Current homepage sections:

1. Hero
2. About
3. Music
4. Latest EP
5. Donation
6. Contact
7. Footer

### Hero

Primary source: `HeroSection.jsx`

Signature traits:

- fullscreen presentation
- animated blinds background
- strong title with underlined accent word
- character canvas overlay
- mono kicker with status dot
- single dominant CTA

This section sets the tone for the entire public experience.

### About

Primary source: `AboutSection.jsx`

Traits:

- animated 3D character
- glass data panels
- cyber presentation language
- responsive shift into horizontal scroll cards on small screens

### Music

Primary source: `MusicSection.jsx`

Traits:

- aurora background
- layered stars
- embedded player inside glass frame
- playlist panel with active state
- supporting character scene on larger screens

### Contact

Primary source: `ContactSection.jsx`

Traits:

- layered particles and geometry
- social channel presentation
- form-centric closing section
- dance/celebration energy in the visuals

## Blog Design

Primary source:

- `src/app/blog/page.js`
- `src/components/blog/*`
- `src/app/blog/[...slug]/article-page.module.css`

Blog tone is more readable and editorial than the homepage, but it still sits inside the same dark public system.

Signature traits:

- dark article shell
- glowing radial atmosphere behind content
- large glass body wrapper
- mono tags and utility labels
- futuristic but readable article detail page

Rules:

- Reading comfort takes priority over spectacle.
- Decorative glow should sit outside the text column.
- Article body should remain the calmest public reading surface.

## Bio Music Design

Primary source:

- `src/app/bio-music/page.js`
- `src/app/bio-music/page.module.css`

Traits:

- discography-first presentation
- hero overline + large title
- 3D release shelf
- spotlight cards as grid fallback

Rules:

- Album/release art is the main visual anchor.
- This area should feel collectible and gallery-like.

## Shop Design

Primary source:

- `src/app/shop/page.js`
- `src/app/shop/[slug]/page.js`
- `src/app/shop/shop.module.css`

Shop sits inside the public system but is more utility-driven than the homepage.

Signature traits:

- editorial dark shell
- white product image stage
- category chips and filter controls
- clear pricing and affiliate CTA
- structured related content and product details

Rules:

- Product imagery should stay on white backgrounds.
- Utility surfaces can be cleaner than homepage sections, but should still feel premium.
- Pricing, category, and brand need high scanning clarity.

## Digital Persona Design

Primary source:

- `src/app/(digital)/digital/page.jsx`
- `src/components/digital/*`
- `src/components/digital/digital-vars.css`
- `TACHY_ARTIST_CONTEXT.md`

This is effectively a separate product surface.

It now inherits the same brand family and typography foundation as the public site, then remaps those values into its own `--am-*` variables.

Theme variables:

- `--am-bg: #0a0a0f`
- `--am-cyan: #a855f7`
- `--am-amber: #6366f1`
- `--am-purple: #a855f7`
- `--am-rose: #ec4899`
- `--am-green: #818cf8`
- `--am-text: #f0ede8`
- `--am-muted: #6b7280`

Distinctive traits:

- section storytelling
- visual transitions between blocks
- Spline-driven scenes
- richer editorial composition
- stronger use of showcase patterns and demo layouts

Rules:

- Treat `/digital` as a presentation experience.
- Preserve its section-by-section narrative rhythm.
- Do not simplify it into standard marketing-site blocks unless intentionally redesigning the whole surface.

## Admin Design

Primary source:

- `src/app/admin/globals.css`
- `src/app/admin/layout.js`

Admin is a separate light theme.

Theme characteristics:

- soft lavender-gray page background
- white cards
- violet primary action color
- indigo secondary accent
- pink destructive/alert accent inside the same brand family
- Geist Sans readability with the same mono support as the public site

Rules:

- Admin should optimize for scanning, form filling, and list management.
- Avoid public-site glow language here.
- Stick to clean borders, white cards, and understated shadows.
- Brand consistency in admin should come from typography and accent family, not from importing the public site's atmospheric effects.

## Responsive Strategy

The codebase already follows a practical responsive model:

- desktop gets the richest 3D and motion treatment
- tablet retains hierarchy but trims complexity
- mobile gets simpler layouts, stacked grids, drawers, and scrollable rails

Examples:

- navbar becomes a drawer
- heavy character canvases are disabled on small screens
- about/contact use horizontal scroll fallbacks on mobile
- shop grid collapses progressively

Rules:

- On mobile, remove complexity before removing identity.
- Keep the typography scale strong even when layouts simplify.
- Preserve key brand cues: dark atmosphere, purple accent, glass or premium surfaces.

## Accessibility Baseline

Current strengths in the codebase:

- descriptive metadata on route surfaces
- dark color scheme declared on `html`
- visible focus treatments in newer surfaces like shop
- mobile drawer with dialog semantics
- reduced-motion-aware heavy effects in several sections

Rules going forward:

- all interactive elements need visible focus
- icon-only actions need labels
- do not ship dark surfaces with weak contrast
- new public pages should include skip-link thinking, especially long layouts

## Content Tone By Surface

### Public artist site

- emotional
- intimate
- atmospheric
- expressive, but not vague

### Blog and shop

- clearer
- more direct
- more practical
- still aligned with Tachy voice

### Digital persona

- strategic
- polished
- portfolio-like
- more presentation and authority oriented

### Admin

- neutral
- task-first
- concise

## Current Design Debt

The current system works, but these are real inconsistencies to keep in mind:

1. The codebase has multiple visual systems rather than one unified design system.
2. Metadata on `/digital` pages still references `Another Me` as a brand name.
3. Some shared UI pieces such as `GlassPanel` and `SectionTitle` still rely on inline styles.
4. Some legacy variable names remain historical, such as `--am-cyan` and the backward-compatible `--font-inter` alias.
5. Some older pages may not yet match the stronger accessibility patterns used in newer shop work.

These are not blockers, but they matter for future cleanup.

## Design Rules To Preserve

When editing or adding UI, preserve these rules unless a full redesign is intentional:

1. Public site stays dark, cinematic, and purple-led.
2. Strong gradients belong on moments of emphasis, not everywhere.
3. Glass surfaces should feel premium, not noisy.
4. Motion must respect device capability and reading comfort.
5. `/digital` remains its own storytelling surface.
6. Admin remains light, clean, and operational.
7. White product-image stages in shop are intentional.
8. Mono overlines, pills, and metadata labels are a recurring signature.
9. Typography hierarchy should stay bold and high contrast.
10. 3D is a differentiator, but content readability wins when there is tension.

## File Map

Use these files as the main source of truth when working on design:

- Global public tokens: `src/app/globals.css`
- Shared brand tokens: `src/styles/design-tokens.css`
- Root metadata and font loading: `src/app/layout.js`
- Public navbar: `src/components/layout/Navbar.jsx`, `Navbar.module.css`
- Public footer: `src/components/layout/Footer.jsx`, `Footer.module.css`
- Homepage sections: `src/components/sections/*`
- Blog UI: `src/components/blog/*`
- Shop UI: `src/app/shop/*`
- Bio Music UI: `src/app/bio-music/*`
- Digital persona: `src/components/digital/*`, `src/app/(digital)/digital/*`
- Admin UI: `src/app/admin/*`
- Digital context details: `TACHY_ARTIST_CONTEXT.md`

## Practical Use

Before changing UI, ask:

1. Which surface am I in: public, digital, or admin?
2. Which token set should this use?
3. Is this surface expressive, editorial, or operational?
4. Does this change preserve the existing hierarchy of atmosphere vs readability?
5. On mobile, what is the simplified but still on-brand version?

If those answers are unclear, inspect the nearest existing surface before inventing a new pattern.
