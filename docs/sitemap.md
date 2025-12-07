# MVP Sitemap & User Flows

## Site Structure

```
TrekMapper/
├── / (Home)
│   ├── Hero search
│   ├── Featured treks
│   └── CTA to explore
├── /treks (Trek List)
│   ├── Filters (region, difficulty, duration, season)
│   ├── Trek cards
│   └── Compare selection UI
├── /treks/[slug] (Trek Detail)
│   ├── Overview & stats
│   ├── Itinerary
│   ├── Altitude profile
│   ├── Map & coordinates
│   ├── Gallery
│   ├── FAQ
│   └── Inquiry form (sticky sidebar)
├── /compare?treks=slug1,slug2,slug3 (Compare)
│   ├── Side-by-side table
│   └── Feature comparison
├── /inquiry (Inquiry Form)
│   └── Full-page form for planning
├── /admin/login (Admin Login)
│   └── Dev credentials
├── /admin/dashboard (Admin Dashboard)
│   ├── Trek list
│   ├── Add new trek
│   ├── Edit trek
│   └── Delete trek
└── /agency/login (Agency Login)
    └── Dev credentials for agency role

## Core User Flows

### Flow 1: Discover & Explore
1. User lands on Home
2. Sees hero search & featured treks
3. Clicks "Explore All Treks" → /treks
4. Filters by region, difficulty, duration, season
5. Views trek cards
6. Clicks trek → Trek Detail page

### Flow 2: Trek Comparison
1. User on /treks page
2. Selects 2-3 treks using "Compare" button on cards
3. Sticky compare bar appears at bottom
4. Clicks "Compare" button in bar
5. Navigates to /compare?treks=slug1,slug2,slug3
6. Views side-by-side comparison table
7. Can click trek name to go back to detail

### Flow 3: Inquiry & Booking
1. User on Trek Detail page (/treks/[slug])
2. Sees pre-filled Inquiry form in sidebar
3. Fills in name, email, phone, message
4. Submits form
5. Receives success message
6. Backend receives inquiry (dev: logged to console)

### Flow 4: Admin Trek Management
1. Admin navigates to /admin/login
2. Enters dev credentials (admin/password)
3. Redirects to /admin/dashboard
4. Can:
   - View all treks in list
   - Add new trek (opens modal form)
   - Edit trek (inline or modal)
   - Delete trek (with confirmation)
5. Changes persist in-memory during session

## Page Architecture

### Home Page (/)
- Hero section with search input
- Featured treks carousel
- Call-to-action buttons
- SEO metadata

### Trek List Page (/treks)
- Search input + dropdown filters (sticky top)
- Collapsible advanced filters (duration slider, season selector)
- Trek cards grid (responsive 1-3 columns)
- Compare button on each card
- Sticky compare bar at bottom

### Trek Detail Page (/treks/[slug])
- Hero image with parallax
- Stats badges (difficulty, duration, altitude, price)
- Tabbed/accordion sections:
  - Overview
  - Altitude profile chart
  - Map with coordinates
  - Itinerary (day-by-day accordion)
  - Gallery
  - FAQ
- Sticky Inquiry form sidebar

### Compare Page (/compare)
- Comparison table with feature rows
- Images of selected treks in column headers
- Feature rows: region, difficulty, duration, altitude, price, permit, season
- Checkmarks/X for boolean fields

### Inquiry Form (/inquiry)
- Full-page or modal form
- Fields: name, email, phone, trek (pre-filled), dates, group size, message
- Validation with error messages
- Success state with thank-you message

## SEO & Analytics Entry Points

- Home → captures general "trekking" keywords
- /treks → captures "treks in Nepal", "Nepal trekking"
- /treks/[slug] → targets specific trek keywords (e.g., "Everest Base Camp trek")
- /compare → targets comparison keywords
- Sitemap.xml & robots.txt for search engine indexing

