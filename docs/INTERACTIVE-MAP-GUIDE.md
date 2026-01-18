# Nepal Trek Map - Feature Guide

## Overview
The Nepal Trek Map is an interactive map that allows users to explore trekking routes across Nepal with visual markers and filtering capabilities.

## Features Implemented

### 🗺️ Interactive 2D Map
- **2D Map Rendering**: Uses MapLibre GL with CartoDB light basemap
- **Nepal-focused View**: Centered on Nepal with proper geographic boundaries
- **Smooth Navigation Controls**: Pan and zoom the map with built-in controls
- **Restricted Bounds**: Map is locked to Nepal region (cannot pan outside)

### 🎯 Trek Markers
- **Color-Coded Flag Markers**: Visual flag markers for each trek location
  - 🟢 **Green**: Low difficulty (Easy treks)
  - 🟡 **Yellow**: Medium difficulty (Moderate treks)  
  - 🔴 **Red**: High difficulty (Challenging/Expert treks)
- **Interactive Popups**: Click markers to see detailed trek information in popups
- **Hover Effects**: Markers scale up when you hover over them
- **Click to Navigate**: "View Details" button in popup takes you to trek detail page

### 🔍 Smart Filters
1. **Region Filter**
   - Filter by trekking regions (Khumbu, Annapurna, Langtang, Manaslu, etc.)
   - Auto-zoom to selected region
   - Shows "All" option to view entire Nepal
   
2. **Difficulty Filter**
   - Filter by simplified difficulty levels (Low, Medium, High)
   - Only shows markers that match selected difficulty
   - "All" option shows all difficulty levels

### 🎬 Map Animation
- **Fly-to Region**: When you select a region, the map smoothly flies and zooms to that area
- **Smooth Transitions**: 1.5 second animation duration for region changes
- **Reset View**: Selecting "All" returns to full Nepal view

## How to Use

### Accessing the Map
1. Navigate to `/explore` page
2. Or click "Explore Map" in the navigation menu

### Exploring Treks
1. **Browse All Treks**: Default view shows all available treks
2. **Filter by Region**: Select a region from the dropdown to zoom to that area
3. **Filter by Difficulty**: Choose Low/Medium/High to show only matching treks
4. **Click Markers**: Click any flag marker to open a popup with trek details
5. **View Details**: Click "View Details →" button in popup to go to trek page
6. **Hover Effects**: Hover over markers to see them scale up

### Filter Panel Controls
- **Region Dropdown**: Select specific region or "All" to see entire Nepal
- **Difficulty Dropdown**: Filter by Low/Medium/High or "All" difficulties
- **Results Counter**: Shows filtered count / total treks (e.g., "15 / 45")

## Technical Details

### Components Created
1. **SimpleNepalMap** (`src/components/trek/simple-nepal-map.tsx`)
   - Main 2D map component with filtering
   - Region-based fly-to animations
   - Dynamic marker rendering with popups
   - Filter state management
   - CartoDB Light basemap for clean visualization

2. **Explore Page** (`src/app/explore/page.tsx`)
   - Full-page map experience
   - Dynamic import with SSR disabled (client-side only)
   - Loading state with spinner
   - SEO optimized metadata

### Color Scheme
```typescript
Low (Easy):        #10b981  // Green
Medium (Moderate): #eab308  // Yellow
High (Challenging/Expert): #ef4444  // Red
```

### Region Coordinates
Each region has predefined center coordinates and zoom levels for fly-to animations:
- All Regions: 84.124°E, 28.3949°N (zoom: 6.5)
- Khumbu: 86.7°E, 27.8°N (zoom: 8.5)
- Annapurna: 83.9°E, 28.6°N (zoom: 8.5)
- Langtang: 85.5°E, 28.2°N (zoom: 9)
- Manaslu: 84.6°E, 28.5°N (zoom: 9)
- And more...

## User Experat /explore → Map loads with all treks → Selects region → 
Map flies to region → Selects difficulty → Shows only matching treks → 
Clicks marker → Popup opens with details → Clicks "View Details" → 
Navigates to trek detail page
```

### Visual Feedback
- ✅ Markers scale up on hover (1.2x zoom)
- ✅ Selected filters update the map instantly
- ✅ Results counter shows filtered count
- ✅ Smooth fly-to animations (1.5s duration)
- ✅ Loading state with spinner and text
- ✅ Popups show detailed trek information
- ✅ Flag markers with colored styling

## Marker Details

### Flag Marker Design
Each trek is marked with a simple flag icon consisting of:
- **Pole**: Vertical line with base circle
- **Flag**: Horizontal rectangle filled with difficulty color
- **Colors**: Match the difficulty level (Green/Yellow/Red)
- **Size**: 32x32px for optimal visibility

### Popup Information
When you click a marker, the popup displays:
- Trek name (bold heading)
- Region
- Difficulty (color-coded)
- Duration in days
- Maximum altitude in meters
- "View Details →" button linking to trek page

## Future Enhancements (Optional)

### Potential Improvements
1. **Season Filter**: Add filtering by best trekking season
2. **Route Lines**: Draw trek routes between waypoints
3. **Clustering**: Group nearby treks at lower zoom levels
4. **3D Terrain**: Upgrade to 3D map with elevation
5. **Search Bar**: Quick search for specific treks
6. **Photo Previews**: Show trek photos in popups
7. **Booking Integration**: Quick booking from map markers
8. **More Difficulty Levels**: Expand from 3 to 4-5 levelap
- Custom route planning
- Live trek tracking
- User-generated markers
- Social sharing of map views

## Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 15+)
- ⚠️ Requires WebGL support for map rendering

## Performance
- Client-side rendering only (no SSR)
- Efficient marker rendering with DOM elements
- Dynamic loading of map tiles
- Optimized filter operations
- Smooth animations at 60fps
- Minimal bundle size with code splitting

## Accessibility
- Keyboard navigation supported via map controls
- Click handlers for marker interactions
- Color contrast meets WCAG standards
- Focus indicators visible on filter dropdowns
- ARIA labels on filter controls

## Map Bounds
The map is restricted to Nepal's geographic boundaries:
- **Southwest Corner**: 79.5°E, 26.0°N
- **Northeast Corner**: 88.5°E, 30.5°N
- **Min Zoom**: 6.0 (cannot zoom out further)
- **Max Zoom**: 12.0 (detailed regional view)

---

**Enjoy exploring Nepal's incredible trekking routes! 🏔️**
