# Usability Test Script

## Overview

This document outlines 5 core user task scenarios for unmoderated or moderated usability testing of TrekMapper MVP.

---

## Test Participants

- **Count:** 5–10 participants
- **Screener criteria:**
  - Have trekked or are interested in trekking
  - Basic web browsing proficiency
  - Located in target markets (US, UK, Nepal/Asia)

---

## Test Scenarios & Tasks

### Scenario 1: Discovery & Filter

**Goal:** Test search & filter functionality; verify users can discover treks matching their preferences.

**Setup:**
- Participant starts on Home page
- Pre-written scenario: "You have 1 week in spring and want an easy trek in the Annapurna region. Find a suitable trek."

**Tasks:**
1. Navigate to the Treks page
2. Use filters to narrow down to:
   - Region: Annapurna
   - Difficulty: Easy
   - Duration: ≤ 8 days
   - Season: Spring
3. Select a trek from results
4. Confirm the trek matches criteria

**Metrics:**
- Time to complete
- Number of clicks
- Filter interactions (did they use all filters?)
- Confusion points

**Expected behavior:**
- Filter controls are intuitive
- Results update in real-time
- Selected trek matches criteria

---

### Scenario 2: Trek Comparison

**Goal:** Test multi-trek comparison; verify sticky compare bar and comparison table UI.

**Setup:**
- Participant is on Trek list page
- Scenario: "Compare 3 Everest region treks to decide which fits your fitness level."

**Tasks:**
1. Find and add Everest Base Camp to comparison
2. Find and add Gokyo Lakes to comparison
3. Find and add Manaslu Circuit to comparison
4. Click "Compare" in the sticky bar
5. Review comparison table
6. Identify which trek is easiest (based on difficulty column)

**Metrics:**
- Time to add 3 treks to compare
- Sticky bar visibility & usability
- Table readability (can they find difficulty column?)
- Confusion points

**Expected behavior:**
- "Compare" buttons on cards work
- Sticky bar reflects selections
- Comparison table is easy to scan
- Columns are clearly labeled

---

### Scenario 3: Trek Details & Inquiry

**Goal:** Test trek detail page layout; verify key info is findable; test inquiry form submission.

**Setup:**
- Participant is on trek detail page (e.g., Everest Base Camp)
- Scenario: "You're interested in this trek. Review the itinerary and submit an inquiry for next spring."

**Tasks:**
1. Scroll through page sections to find:
   - Itinerary
   - Best season
   - Price range
   - Altitude profile
   - FAQ
2. Locate the Inquiry form
3. Fill in form with provided info (name, email, dates, group size)
4. Submit form
5. Confirm success message appears

**Metrics:**
- Time to locate each section
- Scroll depth (did they explore the whole page?)
- Form completion time
- Error recovery (if any field validation fails)
- Success message comprehension

**Expected behavior:**
- All sections are visible and well-organized
- Inquiry form is easy to find
- Form validation provides clear errors
- Success message confirms submission

---

### Scenario 4: Admin Trek Management

**Goal:** Test admin dashboard CRUD; verify non-technical user can manage treks.

**Setup:**
- Participant is given admin login credentials
- Scenario: "Log in and add a new trek to the system, then edit an existing trek's duration."

**Tasks:**
1. Navigate to /admin/login
2. Log in with provided credentials
3. Add a new trek with fields:
   - Name: "Test Trek XYZ"
   - Region: "Manaslu"
   - Difficulty: "Challenging"
   - Duration: 10 days
   - Altitude: 5000m
   - Price: $1500–2500
4. Verify trek appears in list
5. Edit an existing trek (e.g., change duration)
6. Verify edit is reflected in list

**Metrics:**
- Time to log in
- Time to add a trek
- Form field clarity (are labels clear?)
- Confirmation messaging
- Edit workflow
- Error handling

**Expected behavior:**
- Login is straightforward
- Add form has all necessary fields
- Success confirmation appears after add
- Edits reflect in list immediately
- Delete action prompts confirmation

---

### Scenario 5: Mobile Responsive Design

**Goal:** Test mobile usability; verify filters & compare work on small screens.

**Setup:**
- Test on mobile phone or responsive browser mode (375px width)
- Scenario: "You're on your phone. Browse the trek list and select a trek to view details."

**Tasks:**
1. Navigate to /treks on mobile
2. Apply a filter (region or difficulty)
3. View filtered trek cards
4. Click "Compare" on a card
5. Verify sticky compare bar displays
6. Tap a trek card to view detail page
7. Scroll through detail page sections on mobile

**Metrics:**
- Tap target sizes (buttons, links)
- Sticky compare bar position & functionality on mobile
- Readability of text at mobile size
- Scroll behavior & layout reflow
- Touch interactions

**Expected behavior:**
- All buttons & links are easily tappable (≥44px)
- Sticky bar doesn't obscure content
- Text is readable without horizontal scroll
- Images load and scale properly
- Layout reflows gracefully

---

## Observation Guide for Facilitator

During testing, observe for:

- **Hesitation:** Does participant pause before clicking? Are instructions unclear?
- **Backtracking:** Do users navigate backward or take detours? May indicate poor information architecture.
- **Emotional reactions:** Smiles/frowns indicate satisfaction or frustration.
- **Think-aloud comments:** "I expected this to..."; "I'm confused about..."
- **Errors:** Form validation failures, navigation issues.

---

## Post-Test Questions

1. On a scale of 1–10, how easy was it to find a trek? Why?
2. Was the comparison feature useful? Would you use it?
3. Did the trek details page give you enough info to decide? What was missing?
4. Would you use the inquiry form to contact an agency?
5. Any sections confusing or hard to find?
6. What would improve your experience?

---

## Success Criteria (MVP)

- [ ] 80% of participants complete Scenario 1 without major errors
- [ ] 75% of participants complete Scenario 2 in <2 min
- [ ] 100% of participants understand the inquiry form flow
- [ ] 70% of participants successfully log in & add a trek (admin)
- [ ] No participant reports text unreadable on mobile
- [ ] Average System Usability Scale (SUS) score ≥70

---

## Accessibility Checks (WCAG 2.1 AA)

- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] Screen reader announces all major sections
- [ ] Color contrast meets 4.5:1 for text
- [ ] Focus indicators are visible on all interactive elements
- [ ] No content is hidden from keyboard users
- [ ] Form labels are associated with inputs

