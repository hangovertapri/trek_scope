# TrekMapper: Adventure Trekking Comparison Platform

A modern, interactive trekking comparison website for discovering, comparing, and booking treks in Nepal and around the globe. Built with Next.js, TypeScript, and Tailwind CSS.

**Status:** MVP (v0.2.0) - 7 Priority Features Implemented
**Last Updated:** December 12, 2025

## ⭐ Features (MVP)

### Core Discovery & Comparison
- ✅ **Trek Discovery:** Browse 25+ curated Nepal treks with advanced filters
- ✅ **Smart Filters:** Region, difficulty, duration slider, best season selector
- ✅ **Trek Comparison:** Select 2–3 treks for side-by-side comparison with sticky bar
- ✅ **Trek Details:** Full itinerary, altitude profile chart, map, gallery, FAQ, pricing
- ✅ **Map Integration:** Location markers with coordinates (OpenStreetMap links)

### User Interactions
- ✅ **Inquiry Form:** Pre-filled with trek info; capture contact details and preferences
- ✅ **Sticky Compare Bar:** Fixed bottom UI showing selected treks with "Compare" CTA
- ✅ **Responsive Design:** Mobile-optimized; works on 375px+ screens

### Priority Features (Dec 2025)
- ✅ **Animated Altitude Charts:** Real-time elevation visualization with difficulty curves
- ✅ **Weather Integration:** Live weather data with Open-Meteo API for each trek location
- ✅ **Trek Difficulty Quiz:** 4-question assessment with personalized trek recommendations
- ✅ **Review System:** Full CRUD reviews with 5-star ratings, sorting, and filtering
- ✅ **Cost Calculator:** Interactive budget planner with 5 expense categories
- ✅ **Advanced Filters:** 6-category filtering (difficulty, duration, altitude, season, permit, price)
- ✅ **Testimonials Carousel:** Social proof section with 6+ verified trekker testimonials

### Admin & Agency (Dev Mode)
- ✅ **Admin Dashboard:** Add, edit, delete treks with form validation
- ✅ **Admin Login:** Dev credentials (admin/password) with localStorage auth
- ✅ **Agency Login:** Role-based placeholder (agency/password)
- ✅ **CRUD API:** `/api/treks` (GET/POST/PUT/DELETE) + `/api/inquiries` (POST/GET)

### SEO & Content
- ✅ **Meta Tags:** Dynamic title, description, OG images per page
- ✅ **JSON-LD:** BreadcrumbList, FAQPage, TouristTrip structured data
- ✅ **Sitemap:** Dynamic `/sitemap.xml` with all trek pages
- ✅ **robots.txt:** Search engine directives & sitemap link
- ✅ **Content Guides:** Permit reference, safety tips, competitor analysis docs

### Design & Engineering
- ✅ **Design Tokens:** Color, typography, spacing in `src/styles/tokens.json`
- ✅ **Tailwind CSS:** Extended theme with custom animations & tokens
- ✅ **TypeScript:** Strict type safety across codebase
- ✅ **Responsive Layout:** Mobile, tablet, desktop optimized
- ✅ **Accessibility:** Keyboard navigation, semantic HTML, focus indicators
- ✅ **JSON Schemas:** Trek, inquiry, agency data models in `schemas/`

### Documentation
- 📄 **Sitemap & Flows:** `docs/sitemap.md` with core pages and user journeys
- 📄 **Permits & Safety:** `docs/permit-reference.md` (Nepal permits, altitude, weather)
- 📄 **Usability Tests:** `docs/usability-tests.md` (5 test scenarios, success criteria)
- 📄 **Competitor Analysis:** `docs/competitor-analysis.md` (AllTrails, KimKim, Klook, etc.)
- 📄 **SEO Resources:** Keyword seed CSV, content briefs (docs/ folder)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 15.3](https://nextjs.org/) (App Router, SSG) |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + animations |
| **UI** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Data** | In-memory (dev) → `src/lib/data.ts` |
| **Forms** | HTML form + fetch API (future: react-hook-form + Zod) |
| **Auth** | localStorage (dev-only) → NextAuth (production) |
| **Deployment** | [Vercel](https://vercel.com/) (recommended) |

---

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (routes)/
│   │   ├── page.tsx              # Home
│   │   ├── treks/page.tsx        # Trek list + filters
│   │   ├── treks/[slug]/page.tsx # Trek detail (SSG)
│   │   ├── compare/page.tsx      # Comparison table
│   │   ├── inquiry/page.tsx      # Inquiry form page
│   │   ├── admin/login/page.tsx  # Admin login
│   │   ├── admin/dashboard/page.tsx # Admin CRUD
│   │   ├── agency/login/page.tsx # Agency login
│   │   └── recommend/page.tsx    # AI recommendations (future)
│   ├── api/
│   │   ├── treks/route.ts        # Trek CRUD endpoints
│   │   ├── inquiries/route.ts    # Inquiry endpoints
│   │   └── sitemap.xml/route.ts  # Dynamic sitemap
│   ├── layout.tsx                # Root layout + CompareProvider
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Home page
├── components/
│   ├── forms/
│   │   ├── inquiry-form.tsx      # Inquiry form (client)
│   │   └── recommendation-form.tsx # AI recommendation form
│   ├── trek/
│   │   ├── trek-card.tsx         # Trek card with compare button
│   │   ├── compare-bar.tsx       # Sticky bottom compare bar
│   │   ├── altitude-chart.tsx    # Altitude profile chart
│   │   └── map.tsx               # Map placeholder with coordinates
│   ├── layout/
│   │   ├── header.tsx            # Navbar
│   │   ├── footer.tsx            # Footer
│   │   └── mobile-nav.tsx        # Mobile menu
│   ├── ui/                       # shadcn/ui components
│   ├── shared/
│   │   ├── animate-on-scroll.tsx # Intersection observer animation
│   │   └── logo.tsx              # Logo component
│   └── meta.tsx                  # Meta tags component
├── context/
│   └── compare-context.tsx       # Trek comparison state (React Context)
├── lib/
│   ├── data.ts                   # In-memory CRUD helpers
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Utility functions
│   ├── treks.json                # 25 Nepal treks dataset
│   ├── placeholder-images.ts     # Image placeholder service
│   └── placeholder-images.json   # Placeholder image metadata
└── styles/
    ├── tokens.json               # Design tokens
    └── tokens.ts                 # Token TypeScript export

docs/
├── sitemap.md                    # MVP sitemap & user flows
├── permit-reference.md           # Nepal permits & safety guide
├── usability-tests.md            # Test scenarios (5 tasks)
├── competitor-analysis.md        # OTA benchmark
├── seo-keywords-seed.csv         # SEO keyword research
└── seo-content-briefs.md         # Content brief templates

schemas/
├── trek.schema.json              # Trek data model
├── inquiry.schema.json           # Inquiry data model
└── agency.schema.json            # Agency data model

public/
└── robots.txt                    # Search engine rules

.
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm 10+

### Installation

```bash
# Clone & install
git clone https://github.com/yourusername/trekmapper.git
cd trekmapper
npm ci

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Type Checking & Build

```bash
# Type check
npm run typecheck

# Build for production
npm run build
npm start
```

---

## 🎯 Admin Quick Start (Dev Mode)

### Admin Dashboard
```
URL: http://localhost:3000/admin/login
Username: admin
Password: password
→ Redirects to /admin/dashboard
```

**Actions:**
- View all treks in list table
- Add new trek (form modal)
- Edit trek (inline/modal)
- Delete trek (with confirmation)

**Note:** All changes are in-memory and reset on server restart.

### API Examples

```bash
# List all treks
curl http://localhost:3000/api/treks

# Add trek (POST)
curl -X POST http://localhost:3000/api/treks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Trek",
    "region": "Annapurna",
    ...
  }'

# Submit inquiry (POST)
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "trek": "everest-base-camp",
    "groupSize": 4,
    "message": "..."
  }'
```

---

## 📋 Key Features Explained

### Trek Comparison Flow

1. Browse `/treks` → See trek cards with "Compare" buttons
2. Click "Compare" on 2–3 treks → Sticky bar appears at bottom
3. Bar shows selected trek thumbnails & "Compare (N)" button
4. Click "Compare" → Navigate to `/compare?treks=slug1,slug2,slug3`
5. View side-by-side table comparing: region, difficulty, duration, altitude, price, permit, season

### Trek Detail Page (`/treks/[slug]`)

- **Hero:** Parallax image with trek name & region
- **Stats:** Badges for difficulty, duration, altitude, price
- **Sections:** Overview, altitude chart, map, itinerary (accordion), gallery, FAQ
- **Sidebar:** Pre-filled inquiry form
- **SEO:** Meta tags, JSON-LD (BreadcrumbList, FAQPage, TouristTrip)

### Inquiry Form

- **Fields:** Name, email, phone (optional), message
- **Pre-fill:** Trek name & slug when on detail page
- **Validation:** Required fields marked; basic email check
- **Submit:** POST to `/api/inquiries` → Success message
- **Dev:** Logged to console & stored in-memory

### Filters on Trek List (`/treks`)

- **Search:** By trek name or region (real-time)
- **Difficulty:** Dropdown (Easy, Moderate, Challenging, Expert)
- **Region:** Dropdown (all Nepal regions)
- **Duration:** Range slider 1–30 days
- **Season:** Multi-select buttons (Spring, Summer, Fall, Winter)
- **Reset:** One-click "Reset Filters" button

---

## 🎨 Customization

### Adding Treks

Use Admin Dashboard (`/admin/dashboard`) or edit `src/lib/treks.json`:

```json
{
  "id": "unique-id",
  "slug": "friendly-url",
  "name": "Trek Name",
  "region": "Region",
  "difficulty": "Moderate",
  "duration": 10,
  "altitude": 4000,
  "price_range": [600, 1200],
  "best_season": ["Spring (Mar-May)"],
  "permit_required": true,
  "highlights": ["View 1", "View 2"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1",
      "description": "Trek from X to Y",
      "altitude": 2000
    }
  ],
  "images": ["image-id-1"],
  "coordinates": [28.0, 84.0],
  "description": "Short description",
  "overview": "Longer overview",
  "faq": [{ "question": "Q?", "answer": "A." }],
  "safety_tips": ["Tip 1"]
}
```

### Updating Design Tokens

1. Edit `src/styles/tokens.json` (colors, fonts, spacing)
2. Types auto-update via `src/styles/tokens.ts`
3. Use in `tailwind.config.ts` theme

### Changing Colors

- **Primary:** `tailwind.config.ts` → `theme.colors.primary`
- **Fonts:** Update Google Fonts link in `src/app/layout.tsx`
- **Dark Mode:** Add `dark:` classes; implement toggle (future)

---

## ⚙️ API Routes (Dev Mode)

### Treks
```
GET    /api/treks          → List all treks
POST   /api/treks          → Add trek
PUT    /api/treks?id=123   → Update trek
DELETE /api/treks?id=123   → Delete trek
```

### Inquiries
```
GET  /api/inquiries        → List all inquiries
POST /api/inquiries        → Submit inquiry
```

### SEO
```
GET /sitemap.xml           → Dynamic sitemap
GET /robots.txt            → Search engine rules
```

---

## 📊 Routing Map

| Route | Type | Purpose |
|-------|------|---------|
| `/` | SSG | Home page, hero, featured treks |
| `/treks` | CSR* | Trek list with filters & compare |
| `/treks/[slug]` | SSG | Trek detail (generated for each trek) |
| `/compare` | CSR* | Comparison table |
| `/inquiry` | CSR* | Standalone inquiry form page |
| `/admin/login` | CSR* | Admin login (dev) |
| `/admin/dashboard` | CSR* | Admin CRUD dashboard |
| `/agency/login` | CSR* | Agency login (dev) |
| `/recommend` | CSR* | Recommendation engine (future) |
| `/api/treks` | Dynamic | Trek CRUD API |
| `/api/inquiries` | Dynamic | Inquiry API |
| `/sitemap.xml` | Dynamic | SEO sitemap |
| `/robots.txt` | Static | Search engines |

*CSR = Client-Side Rendering (uses useSearchParams). SSG = Static Site Generation (pre-built at build time).

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Or connect GitHub repo at vercel.com
```

### Environment Variables (Optional)

`.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 📈 SEO Checklist

- ✅ Meta tags (title, description, OG images)
- ✅ JSON-LD structured data on trek pages
- ✅ Dynamic sitemap.xml with all pages
- ✅ robots.txt with sitemap link
- ✅ Mobile-responsive (mobile-first design)
- ✅ Fast load times (Lighthouse target: ≥85)
- ⏳ Internal linking (cross-links between treks)
- ⏳ Blog/guides for backlinks (future)
- ⏳ Image optimization (WebP, lazy loading)
- ⏳ Canonical URLs (add if multi-domain)

---

## 🧪 Testing

### Manual Test Scenarios

1. **Discovery:** Filter treks by region/difficulty/duration/season
2. **Comparison:** Add 2–3 treks, view comparison table
3. **Trek Detail:** View itinerary, gallery, map, FAQ
4. **Inquiry:** Fill form, submit, verify success message
5. **Admin:** Log in, add/edit/delete trek, verify in list
6. **Mobile:** Test on iPhone 12 (375px) and iPad (768px)

### Automated Testing (Future)

```bash
npm run test
```

Jest + Playwright tests to be added.

---

## ♿ Accessibility

### Current Status
- ✅ Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- ✅ Color contrast (WCAG AA: 4.5:1)
- ✅ Keyboard navigation (Tab, Enter, Arrows)
- ✅ Form labels linked to inputs
- ✅ Focus indicators visible

### To Improve (Future)
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] aria-live regions for notifications
- [ ] Keyboard shortcut guide
- [ ] Alt text for all images
- [ ] WCAG AAA contrast for secondary text

---

## 🛣️ Roadmap

### Phase 1: MVP ✅ (Current)
- Trek discovery & comparison
- Inquiry form & API
- Admin dashboard (dev)
- Basic SEO & documentation

### Phase 2: Reviews & Agencies (Weeks 2–4)
- [ ] 5-star reviews & ratings
- [ ] Agency profiles & credentials
- [ ] Traveler testimonials
- [ ] Advanced search filters

### Phase 3: Booking & Payments (Month 2)
- [ ] Instant booking with dates
- [ ] Stripe/Razorpay integration
- [ ] Email confirmations
- [ ] Calendar availability

### Phase 4: Growth (Month 3+)
- [ ] Marketplace (multi-agency)
- [ ] Blog & trek guides
- [ ] Mobile app (PWA/native)
- [ ] Multi-language support
- [ ] Expand to Bhutan, India

---

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

**One-Click Deploy:**

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project" → Select GitHub repo → "Deploy"

4. Your site is live in 2–3 minutes! 🎉

**Using Vercel CLI:**
```bash
npm i -g vercel
vercel
```

For detailed deployment instructions, see [**DEPLOYMENT.md**](./DEPLOYMENT.md).

### Verify Deployment

After deploying:
- [ ] Visit your live URL
- [ ] Check `/sitemap.xml` loads
- [ ] Test all 25 trek pages load
- [ ] Run Lighthouse audit (F12 → Lighthouse)
- [ ] Test on mobile (375px width)

### Production Enhancements (Phase 2+)

- Add database (PostgreSQL + Prisma)
- Implement secure auth (NextAuth.js)
- Email notifications on inquiries
- Image optimization & CDN
- Error tracking (Sentry)
- Analytics (Google Analytics, Vercel Analytics)

See [**DEPLOYMENT.md**](./DEPLOYMENT.md) for full production checklist.

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Type errors
```bash
npm run typecheck
# Fix errors or add // @ts-ignore if intentional
```

### Admin login not working
- Clear browser localStorage: `localStorage.clear()`
- Check DevTools → Application → Local Storage
- Ensure browser allows localStorage

### Treks not showing
- Verify `src/lib/treks.json` is valid JSON
- Check browser console for errors
- Restart dev server

---

## 📝 Contributing

1. Fork & clone
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/my-feature`
5. Open PR

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🤝 Acknowledgments

- Inspired by [AllTrails](https://alltrails.com), [KimKim](https://kimkim.com), [Bookmundi](https://bookmundi.com), [Klook](https://klook.com)
- UI: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- Icons: [Lucide React](https://lucide.dev/)
- Data: Nepal trekking databases & community inputs

---

## 📞 Support

- **GitHub Issues:** [Issues](https://github.com/yourusername/trekmapper/issues)
- **Email:** support@trekmapper.local (TBD)
- **Social:** Twitter, Instagram (TBD)

---

**Version:** 0.1.0 (MVP)  
**Last Updated:** November 20, 2025  
**Status:** 🟢 Ready for Development Testing
