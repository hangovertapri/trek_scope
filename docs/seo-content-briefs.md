# SEO Content Briefs — Top Pages

This file contains prioritized content briefs to guide writers and dev for on-page SEO, metadata, headings and internal linking. Focus: global + Nepal audiences, high search intent pages first.

## How to use
- Use the CSV `docs/seo-content-briefs.csv` for bulk import to content tracker.
- Use the markdown briefs below when drafting pages — they include suggested meta, headings and schema notes.

---

### 1) Nepal Trekking Guide (Home / Pillar)
- Slug: `/`
- Title: "Nepal Trekking Guide — Routes, Permits, Packing | [SiteName]"
- Meta description: "Comprehensive guide to trekking in Nepal: best routes, permits, safety, packing lists, and sample itineraries for every level."
- H1: "Nepal Trekking Guide"
- Suggested H2s: "Why trek in Nepal", "Top treks by region", "When to go", "Permits & costs", "Packing checklist (download)", "Safety & acclimatisation"
- Primary keyword: "Nepal trekking"
- CTA: "Explore treks" (link to `/treks`), "Download packing checklist"
- Schema: Organization + WebSite + BreadcrumbList; add internal links to high-priority trek pages.
- Images: hero panorama of Himalaya, trek preview cards.

### 2) Trek List (Index /treks)
- Slug: `/treks`
- Title: "Best Nepal Treks — Filter by Region, Difficulty, Duration | [SiteName]"
- Meta: "Browse top Nepal treks by region, difficulty and duration. Filter to find family-friendly or high-altitude routes."
- H1: "Best Treks in Nepal"
- Suggested H2s: "Filter by: region / difficulty / duration", "Short treks (2-6 days)", "Classic long treks (7+ days)", "Family & beginner-friendly treks"
- Primary keyword: "best Nepal treks"
- CTA: persistent compare bar + add-to-compare
- Schema: ItemList of trek cards (structured data improves list appearance)

### 3) Everest Base Camp (Example trek detail)
- Slug: `/treks/everest-base-camp`
- Title: "Everest Base Camp Trek — Guide, Itinerary & Flights | [SiteName]"
- Meta: "Plan your Everest Base Camp trek: day-by-day itinerary, Lukla flight tips, altitude guidance, costs, and packing list."
- H1: "Everest Base Camp Trek"
- Suggested H2s: "Overview", "Itinerary (day-by-day)", "Costs & what's included", "Altitude & acclimatisation", "Permits & logistics (Lukla flights)", "Book or inquire"
- Primary keyword: "Everest Base Camp trek"
- CTA: "Inquire for dates & pricing" (opens inquiry modal with `defaultTrek` pre-filled)
- Schema: `TouristTrip`/`Product`-like structured data with `offers`, `itinerary` as `ItemList`, `aggregateRating` optional.

### 4) Permits (TIMS, ACAP, Manaslu, Upper Mustang)
- Slug: `/permits`
- Title: "Nepal Trekking Permits — TIMS, ACAP, Manaslu & More"
- Meta: "Everything you need to know about trekking permits in Nepal: fees, how to apply, and region-specific rules."
- H1: "Trekking Permits in Nepal"
- H2s: "TIMS & ACAP", "Restricted Area permits (Manaslu, Mustang)", "How to apply", "Costs & agency support"
- Notes: Link to agency pages and key trek details mentioning permit requirements.

### 5) Packing List (Download)
- Slug: `/packing-list`
- Title: "Nepal Trekking Packing List — Printable PDF"
- Meta: "Download a printable Nepal trekking packing checklist — clothes, gear, first aid, and extras for altitude."
- H1: "Trekking Packing List"
- H2s: "Clothing", "Gear & electronics", "Medical & first aid", "Optional extras", "Download checklist"
- Engagement: offer a PDF download and email capture (optional) for checklist.

### 6) Safety & AMS
- Slug: `/safety`
- Title: "Trekking Safety in Nepal — Altitude & Emergency Guide"
- Meta: "Learn how to prevent and recognise altitude sickness, emergency planning and safe trekking practices in Nepal."
- H1: "Nepal Trekking Safety Guide"
- H2s: "What is AMS?", "Prevention & acclimatisation", "Symptoms and when to descend", "Emergency contacts & evacuation" 
- Schema: FAQ schema for common safety Q&A.

---

Notes & next steps:
- Use these briefs to create page content with clear CTAs and internal linking to the `Contact/Inquiry` and agency pages.
- Add JSON-LD FAQ and BreadcrumbList on trek pages to improve search result appearance.
- Next action I recommend: generate per-page metadata component and wire `json-ld` for one exemplar trek (Everest Base Camp) so templates are ready for all treks.
