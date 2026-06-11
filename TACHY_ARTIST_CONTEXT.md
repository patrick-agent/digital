# TACHY ARTIST — Project Context

> Last updated: May 21, 2026

---

## PROJECT OVERVIEW

**Name:** Tachy Artist — Digital (formerly "Another Me")
**Type:** Portfolio website với 2 persona: Tachy (artist) + Digital (professional)
**Framework:** Next.js 16.2.4 (App Router), React 19.2.4
**Language:** JavaScript (no TypeScript)
**Styling:** CSS Modules + Tailwind (main site)
**3D Engine:** Three.js + Spline + OGL
**Animation:** GSAP + ScrollTrigger, Framer Motion

---

## PROJECT STRUCTURE

```
studio-3d/
├── src/
│   ├── app/
│   │   ├── (digital)/
│   │   │   └── digital/
│   │   │       └── page.jsx          # Digital page (7 sections + transition)
│   │   ├── layout.js                 # Root layout (Inter font added)
│   │   └── globals.css               # Global styles
│   └── components/
│       ├── digital/
│       │   ├── digital-vars.css      # Theme variables (purple theme)
│       │   ├── DigitalHero.jsx       # Section 1: Hero + Spline
│       │   ├── DigitalSocialProof.jsx # Section 2: Social Proof (replaced Intro)
│       │   ├── DigitalTransition.jsx  # Scroll transition: SocialProof → Timeline
│       │   ├── DigitalTimeline.jsx   # Section 3: Timeline (fiber + rocket)
│       │   ├── DigitalSkills.jsx     # Section 4: Skills (carousel + canvas)
│       │   ├── DigitalServices.jsx   # Section 5: Services (features grid)
│       │   ├── DigitalContact.jsx    # Section 6: Contact (final CTA)
│       │   ├── DigitalFooter.jsx     # Section 7: Footer
│       │   ├── TextFlip.jsx          # Text flip animation
│       │   ├── CompanyLogos.jsx      # Auto-scroll logos
│       │   └── BubbleTransition.jsx  # (unused)
│       └── ui/
│           ├── canvas-reveal-effect.jsx  # Aceternity Three.js shader
│           ├── RotatingText.jsx          # React Bits rotating text
│           ├── RotatingText.css
│           ├── LiquidEther.jsx           # React Bits fluid simulation
│           ├── LiquidEther.css
│           ├── GridScan.jsx              # React Bits grid scan shader
│           ├── GridScan.css
│           ├── Galaxy.jsx                # React Bits star field (OGL)
│           ├── Galaxy.css
│           ├── RippleGrid.jsx            # React Bits ripple grid (OGL)
│           ├── RippleGrid.css
│           ├── GradientText.jsx          # React Bits animated gradient text
│           └── GradientText.css
├── db/
│   └── services.json                 # Services data (currently empty [])
└── package.json
```

---

## THEME VARIABLES (`digital-vars.css`)

```css
--am-bg: #0a0a0f;          /* Dark background */
--am-cyan: #a855f7;        /* Primary accent (purple) */
--am-amber: #6366f1;       /* Secondary accent (indigo) */
--am-purple: #a855f7;      /* Purple */
--am-rose: #ec4899;        /* Pink */
--am-green: #818cf8;       /* Light purple */
--am-text: #f0ede8;        /* Text color */
--am-muted: #6b7280;       /* Muted text */
--am-border: rgba(168,85,247,0.15);
--am-glass: rgba(255,255,255,0.04);
--am-font-display: var(--font-inter), sans-serif;
--am-font-body: var(--font-inter), sans-serif;
```

**Font:** Inter (loaded via `next/font/google` trong `layout.js`, mapped to `--font-inter`)

---

## SPLINE SCENES

| Section | URL | Status |
|---------|-----|--------|
| Hero | `https://prod.spline.design/FaJ3iYbeeDlZbkJI/scene.splinecode` | Active |
| SocialProof | `https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode` | Active |
| Timeline | `https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode` | Active (shared) |
| Transition | `https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode` | Active (shared) |

**⚠️ CRITICAL:** Không xóa project trên Spline — scene load trực tiếp từ URL. Nếu xóa, section sẽ 404.

---

## SECTION DETAILS

### 1. DigitalHero
- Spline 3D background (bubbles scene)
- Headline: "10 năm. 3650 ngày. Biến dữ liệu thành cảm xúc."
- GSAP character-by-character reveal
- Button "Discover Me" → scroll to `#social-proof`
- Watermark cover (bottom-right, `background: #000000`)
- Mouse trigger hoạt động trên Spline canvas
- Text/content: `pointer-events: none` để cursor pass-through

### 2. DigitalSocialProof (REPLACED Intro)
- 2-column flex layout: text (left) + Spline (right)
- **Glassmorphism card** bao quanh toàn bộ content bên trái:
  - `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(20px)`
  - `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 24px`
  - `::before` gradient ánh sáng trên đỉnh thẻ
- RotatingText component: CREATOR → BUILDER → NAVIGATOR (framer-motion spring)
- Badge, headline, manifesto, buttons (Tạo tài khoản + Giới thiệu Sub Teams)
- CompanyLogos auto-scroll marquee
- **Galaxy background** (OGL star field):
  - `hueShift={270}`, `density={1.2}`, `glowIntensity={0.4}`, `saturation={0.6}`
  - `.galaxyBg` căn giữa tuyệt đối, `opacity: 0.4`
- Spline overlay block interaction (pointer-events: none trên overlay + canvas)

### 3. DigitalTransition
- Fixed overlay (`z-index: 50`) giữa SocialProof và Timeline
- Spline rocket model bay từ dưới lên theo scroll
- Trigger: `30% top` của `#social-proof` section
- Animation: `y: 400px → -400px`, `scale: 1 → 0.6`
- CSS scale: `scale(1.5)`, container `100vw x 100vh`, `overflow: visible`
- Layer fade-in (`opacity: 0 → 1`) khi trigger

### 4. DigitalTimeline
- 2-column layout: left (year/era/headline) + right (company/achievement/stat)
- Center: fiber line + dots + Spline rocket model
- **Fiber line**: SVG line với `stroke-dashoffset` scroll-driven, từ dot đầu → dot cuối
- **Milestone dots**: 6px, màu `var(--am-cyan)`, xuất hiện/biến mất theo scroll
- **Rocket model**: Di chuyển theo dot position (pixel-based), `scale(0.2) rotate(180deg)` trong CSS
- **Dot position tracking**: `getBoundingClientRect` tính pixel offset, `scaleY: dotY / fiberHeight`
- **Scroll ngược**: Fiber line + rocket lùi về dot trước (`prevY`)
- 5 milestones với demo data (owner tự thay `[DEMO]`)
- GSAP ScrollTrigger: `onEnter` (fade-in, count-up), `onLeaveBack` (reset)
- **GradientText** cho `.year` (animated gradient text):
  - Colors: `['#a855f7', '#6366f1', '#ec4899', '#a855f7']`, `animationSpeed={4}`
  - Desktop: căn phải (`margin-left: auto`), Mobile: căn trái (`margin-right: auto`)
- **Glassmorphism card** cho `.colRight` (company/achievement/stat):
  - `::before` conic-gradient xoay 360° liên tục (6s), `filter: blur(20px)`
  - `::after` lớp nền tối `rgba(10,10,15,0.7)` inset
  - `.colLeft` không có card effect
- **Flare line** dưới heading "Hành trình 10 năm":
  - Gradient tím → trắng sáng nhất ở 50% → mờ dần 2 bên
  - `::before` điểm sáng tròn chính giữa với glow mạnh
- **Galaxy background** (OGL star field):
  - `hueShift={280}`, `density={1.0}`, `glowIntensity={0.35}`, `saturation={0.5}`
  - Liên kết với SocialProof (chênh 10° hueShift cho chuyển tiếp mượt)

### 5. DigitalSkills (CLONED: @aceternity/canvas-reveal-effect-demo)
- **Header**: "THE ARSENAL" / "Bộ công cụ của tôi" / "Swipe để khám phá"
- **Carousel**: 3 cards cùng lúc, swipe (pointer events), dots navigation
  - Card structure: border + corner icons (+), title centered (border + radius)
  - Hover: title fade out, canvas reveal + gradient overlay + content
- **CanvasRevealEffect**: Three.js dot matrix shader, fill toàn bộ card
  - `opacities: [0.04...0.35]` (giảm dot density), `dotSize: 2`
  - `gradientOverlay`: `linear-gradient` từ đáy (đen 98%) → trên (transparent 80%)
  - Chỉnh manual: `opacities[]`, `dotSize`, CSS `gradientOverlay` stops
- **Hover content**: Headline (màu cluster) + Description + Skill tags (bottom)
  - `justify-content: space-between`, `text-align: left`
  - Skills list dính đáy card
- **Logo Marquee**: 2 hàng auto-scroll (ngược chiều), pause khi hover
  - Title: "Bộ công cụ của tôi" + subtitle
  - Logo placeholder: 140x60px, xám → tím khi hover
  - `toolLogos[]` data array — thay bằng `<img>` khi có logo thật
- **RippleGrid background** (OGL):
  - `gridColor="#a855f7"`, `opacity={0.6}`, `glowIntensity={0.15}`
  - `mouseInteraction={true}`, `mouseInteractionRadius={1.5}`
  - `.rippleBg` fill `100% width/height` của section

### 6. DigitalServices (CLONED: @aceternity/features-section-demo-2)
- **Header**: "WHAT I OFFER" / "Dịch vụ của tôi" / "Giải pháp toàn diện..."
- **Grid**: 4 cột (desktop) → 2 (tablet) → 1 (mobile)
- **Card layout** (clone Aceternity):
  - Border grid: `border-right` + `border-bottom` + `border-left` (col 1)
  - Hover gradient: `linear-gradient` tím nhạt từ dưới lên (6% opacity)
  - Side bar: `height: 24px → 32px`, `neutral → var(--am-cyan)`
  - Title: `translateX(8px)` khi hover
  - Icon: `@tabler/icons-react` (TrendingUp, CurrencyDollar, Code, Robot)
  - Description: tagline của service
  - Features: 3 bullet points nhỏ, dot marker tím
  - Stat badge: góc dưới, `--am-cyan`, font DM Mono
- **Hover zoom**: `transform: scale(1.2)` trên `.cardLink` khi hover
- **Label pill**: `border: 1px solid var(--am-cyan)`, `border-radius: 999px`
- **GridScan background** (Three.js shader):
  - `linesColor="#2F293A"`, `scanColor="#a855f7"`, `bloomIntensity={0.6}`
  - `scanOpacity={0.4}`, `gridScale={0.1}`
  - `.gridBg` căn giữa tuyệt đối, `min-width: 100vw`, `min-height: 100vh`
  - `.overlay` rgba(10,10,15,0.55) để content dễ đọc
- **Data**: `services[]` với slug → link `/digital/services/[slug]` (next/link)
- **Animation**: GSAP header fade-in on scroll
- **db/services.json**: Hiện tại rỗng `[]`, fallback hardcode

### 7. DigitalContact (REBUILT: Final CTA)
- **Layout**: Dark `#0d0d0d` background, min-height `100vh`, centered content
- **LiquidEther background** (Three.js fluid simulation):
  - Colors: `['#5b4fd6', '#7c6fea', '#4a3fbf']` — tone tím đồng bộ theme
  - `mouseForce={20}`, `cursorSize={100}`, `resolution={0.75}`
  - `autoSpeed={0.5}`, `autoIntensity={2.5}` — idle animation rõ nét
  - `.etherBg` absolute inset, `.overlay` rgba(13,13,13,0.35)
- **Content stack** (flex column, max-width 600px):
  - Badge pill: dot `#7c6fea` + "Ready to get started?"
  - Heading: "Sẵn sàng tăng trưởng cùng nhau?" — 52px, 700 weight, -1.5px letter-spacing
  - Subtext: "Đặt lịch tư vấn miễn phí 30 phút. Không cam kết." — 15px, rgba(255,255,255,0.45)
  - Buttons: Primary "Đặt lịch tư vấn →" (`#5b4fd6`) + Secondary "Xem case studies"
- **GSAP animation**: Stagger animate badge → heading → subtext → buttons từ `top 75%`
- Links: `/digital/contact`, `/digital/case-studies`

### 8. DigitalFooter
- 2-column layout: left (video + branding) + right (glassmorphism card)
- **Left**: Video overlay với purple gradient, logo Tachy, tagline, social icons
- **Right**: Navigation cols, subscribe form, copyright
- **Watermark**: SVG text "Tachy" lớn ở đáy, `getBBox()` + `viewBox` auto-fit
- **footerLuckyGraphic** → thay bằng logo `/logo.png`:
  - `width: 96px` (desktop), `72px` (mobile)
  - `drop-shadow` tím nhẹ, vị trí `absolute top: -36px, right: 40px`

---

## ROUTE SLUG CHANGE

**Old:** `/another-me` → **New:** `/digital`

| File | Thay đổi |
|------|---------|
| Route folder | `src/app/(another-me)/another-me/` → `src/app/(digital)/digital/` |
| SocialProof links | `/another-me/contact` → `/digital/contact`, `/another-me/case-studies` → `/digital/case-studies` |
| Contact link | `/another-me/contact` → `/digital/contact` |
| Services links | `/another-me/services/[slug]` → `/digital/services/[slug]` |
| db.js routes | 6 route entries updated |
| db.js persona | `"another-me"` → `"digital"` |
| Admin pages | Label + route updated |
| ServicesForm | Placeholder updated |

---

## KEY DECISIONS & CONSTRAINTS

1. **JavaScript only** — không TypeScript trong Digital sections
2. **CSS Modules** — không Tailwind trong Digital components
3. **`'use client'`** — cần cho GSAP, event listeners, Spline, OGL
4. **GSAP lazy import** trong `useEffect` để tránh SSR crash
5. **Spline lazy load** via `next/dynamic` với `ssr: false`
6. **Không dùng inline styles** trừ dynamic values
7. **Watermark removal** — dùng CSS overlay cover (`#000000`), không dùng JS observer
8. **Spline rotation** — dùng CSS `transform` trên wrapper (không dùng Runtime API)
9. **Fiber line tracking** — pixel-based (`getBoundingClientRect`), không dùng `%`
10. **Transition layer** — fixed overlay, scroll-driven GSAP timeline
11. **Aceternity clones** — Skills (canvas-reveal-effect), Services (features-section)
12. **next/link** bắt buộc cho internal navigation (Services cards)
13. **Typography** — Inter replaces Cormorant Garamond (display) + DM Mono (body)
14. **Background effects** — Galaxy (SocialProof/Timeline), GridScan (Services), LiquidEther (Contact), RippleGrid (Skills)

---

## KNOWN ISSUES & NOTES

- Spline model scale qua CSS `transform: scale()` bị vỡ ở giá trị cao — nên chỉnh trong Spline Editor nếu cần precision
- CSS `transform: rotateZ()` trên Spline canvas không hoạt động — phải dùng wrapper + `overflow: hidden`
- BubbleTransition component đã tạo nhưng không dùng (user yêu cầu remove)
- Text positioning: content gom vào trong, không sát rìa màn hình
- `fiberHeight <= 0` guard để tránh chia cho 0 + `setTimeout(100ms)` đảm bảo dots đã render
- Theme đổi từ cyan → purple (Tachy Artist palette)
- Tabler icons: `IconBot` → `IconRobot`, `IconCode2` → `IconCode` (không tồn tại trong lib)
- CanvasRevealEffect: `showGradient={false}` để tránh double gradient, dùng custom `gradientOverlay`
- CanvasRevealEffect dots ẩn do `bg-white` class — fix via `.canvasContainer > div { background: transparent !important; }`
- Galaxy background: bỏ `pointer-events: none` để nhận mouse events, `opacity: 0.4` để không lấn content
- GradientText import từ `framer-motion` (không phải `motion/react` — module not found trong Next.js)

---

## DEPENDENCIES

```json
"@splinetool/react-spline": "^4.1.0",
"@splinetool/runtime": "^1.12.94",
"gsap": "^3.15.0",
"@gsap/react": "^2.1.2",
"@react-three/fiber": "^9.6.1",
"three": "^0.184.0",
"framer-motion": "^12.38.0",
"@tabler/icons-react": "^3.44.0",
"ogl": "^1.0.12",
"face-api.js": "^0.22.2",
"postprocessing": "^6.39.1",
"next": "16.2.4",
"react": "19.2.4"
```

---

## DEV COMMANDS

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

---

## NEXT STEPS (TODO)

- [ ] Create /digital/services/[slug] sub-pages
- [ ] Replace demo company logos with real logos
- [ ] Replace tool logo placeholders with real SVG/PNG logos
- [ ] Add real content for manifesto/stats
- [ ] Optimize Spline scenes (transparent background, camera angle)
- [ ] Test responsive on real devices
- [ ] Refine transition animation (rocket rotation, easing, timing)
- [ ] Populate db/services.json with real service data
