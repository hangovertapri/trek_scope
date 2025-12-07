Low-fidelity Wireframes

Overview
- Purpose: quick clickable low-fi prototype for MVP pages so stakeholders can validate flows and content hierarchy before visual design.
- Pages included: Home, Trek List, Trek Detail, Compare, Inquiry form.
- Tooling: local HTML prototype included under `docs/wireframes/prototype/` for quick sharing via the file system. Export to Figma recommended for collaborative design.

Prototype Notes
- The prototype is intentionally minimal: grayscale blocks, headings, and primary CTAs.
- Click through from Home -> Trek List -> Trek Detail -> Add to Compare -> Compare -> Inquiry.
- Inquiry opens as a separate page in the prototype to simulate a modal flow.

Files
- `docs/wireframes/prototype/index.html` — Home (hero + quick search)
- `docs/wireframes/prototype/treks.html` — Trek List (grid + filters)
- `docs/wireframes/prototype/detail.html` — Trek Detail (overview, itinerary, map placeholder)
- `docs/wireframes/prototype/compare.html` — Compare view (2-3 treks side-by-side)
- `docs/wireframes/prototype/inquiry.html` — Inquiry form (fields + validation notes)

How to use
1. Open `docs/wireframes/prototype/index.html` in the browser (double-click or open in your dev server).
2. Click the visible buttons/links to navigate between screens.
3. For collaborative editing, import the structure to Figma or use the provided brief to recreate components.

Figma brief
- Create one Figma file named "TrekMapper — Low-Fi"
- Pages: Home, Treks, Detail, Compare, Inquiry
- Use grayscale, 8pt spacing grid, simple rectangles for images.
- Export an interactive prototype linking the main CTAs.

Acceptance
- Clickable prototype opens locally and demonstrates core flows: discover -> view -> compare -> inquire.

