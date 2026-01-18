'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Trek {
  id: string;
  slug: string;
  name: string;
  region: string;
  difficulty: string;
  coordinates: [number, number];
  duration: number;
  altitude: number;
}

interface SimpleNepalMapProps {
  treks: Trek[];
}

// Map difficulty to simplified levels
const normalizeDifficulty = (difficulty: string): 'Low' | 'Medium' | 'High' => {
  const lower = difficulty.toLowerCase();
  if (lower === 'easy') return 'Low';
  if (lower === 'moderate') return 'Medium';
  return 'High'; // Challenging, Expert, etc.
};

// Difficulty colors
const difficultyColors = {
  'Low': '#10b981',      // Green
  'Medium': '#eab308',   // Yellow
  'High': '#ef4444'      // Red
};

// Region coordinates for zooming
const regionCoordinates: Record<string, { center: [number, number], zoom: number }> = {
  'All': { center: [84.124, 28.3949], zoom: 6.5 },
  'Khumbu': { center: [86.7, 27.8], zoom: 8.5 },
  'Annapurna': { center: [83.9, 28.6], zoom: 8.5 },
  'Langtang': { center: [85.5, 28.2], zoom: 9 },
  'Manaslu': { center: [84.6, 28.5], zoom: 9 },
  'Makalu': { center: [87.1, 27.8], zoom: 9 },
  'Dolpo': { center: [83.0, 29.0], zoom: 8.5 },
  'Kanchenjunga': { center: [87.9, 27.7], zoom: 8.5 },
  'Mustang': { center: [83.8, 29.2], zoom: 8.5 },
  'Dhaulagiri': { center: [83.5, 28.7], zoom: 9 },
};

export function SimpleNepalMap({ treks }: SimpleNepalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Get unique regions
  const regions = ['All', ...Array.from(new Set(treks.map(t => t.region)))];

  // Filter treks
  const filteredTreks = treks.filter(trek => {
    const regionMatch = selectedRegion === 'All' || trek.region === selectedRegion;
    const difficultyMatch = selectedDifficulty === 'All' || normalizeDifficulty(trek.difficulty) === selectedDifficulty;
    return regionMatch && difficultyMatch;
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-light': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [84.124, 28.3949], // Nepal center
      zoom: 6.5,
      pitch: 0,
      bearing: 0,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: [
        [79.5, 26.0], // Southwest coordinates of Nepal
        [88.5, 30.5]  // Northeast coordinates of Nepal
      ],
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Zoom to region when filter changes
  useEffect(() => {
    if (!map.current) return;

    const regionConfig = regionCoordinates[selectedRegion] || regionCoordinates['All'];
    map.current.flyTo({
      center: regionConfig.center,
      zoom: regionConfig.zoom,
      duration: 1500,
    });
  }, [selectedRegion]);

  // Update markers when filters change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.querySelectorAll('.trek-marker');
    markers.forEach(marker => marker.remove());

    console.log('Adding markers for', treks.length, 'treks');

    // Add ALL treks to the map (not filtered)
    treks.forEach(trek => {
      const difficulty = normalizeDifficulty(trek.difficulty);
      const color = difficultyColors[difficulty];

      // Check if this trek matches current filters
      const regionMatch = selectedRegion === 'All' || trek.region === selectedRegion;
      const difficultyMatch = selectedDifficulty === 'All' || difficulty === selectedDifficulty;
      const isFiltered = regionMatch && difficultyMatch;

      // Skip treks that don't match filters
      if (!isFiltered) return;

      console.log('Adding marker for:', trek.name, 'at', trek.coordinates);

      // Create flag marker
      const el = document.createElement('div');
      el.className = 'trek-marker';
      el.style.cssText = `
        cursor: pointer;
        width: 32px;
        height: 32px;
        position: relative;
        transition: transform 0.2s ease;
      `;
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d="M8 4 L8 28 M8 6 L22 6 L22 14 L8 14" 
                stroke="${color}" 
                stroke-width="2" 
                fill="${color}" 
                fill-opacity="0.7"/>
          <circle cx="8" cy="28" r="2" fill="${color}"/>
        </svg>
      `;

      // Add click handler to navigate to trek page
      el.addEventListener('click', () => {
        window.location.href = `/treks/${trek.slug}`;
      });

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: #1e293b;">
            ${trek.name}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #475569;">
            <div><strong>Region:</strong> ${trek.region}</div>
            <div><strong>Difficulty:</strong> 
              <span style="color: ${color}; font-weight: 600;">${difficulty}</span>
            </div>
            <div><strong>Duration:</strong> ${trek.duration} days</div>
            <div><strong>Max Altitude:</strong> ${trek.altitude}m</div>
          </div>
          <a href="/treks/${trek.slug}" 
             style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: ${color}; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 600; text-align: center;">
            View Details →
          </a>
        </div>
      `);

      const marker = new maplibregl.Marker(el)
        .setLngLat(trek.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
      
      console.log('Marker added successfully for:', trek.name);
    });
  }, [treks, selectedRegion, selectedDifficulty]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Controls Bar */}
      <div className="absolute top-6 left-6 z-10">
        {/* Filters */}
        <div className="bg-gradient-to-br from-amber-50/95 to-yellow-100/95 backdrop-blur-sm border-2 border-amber-900 rounded-lg shadow-xl p-4 flex gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1 uppercase tracking-wide">
              Region
            </label>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border-2 border-amber-900 bg-white rounded-md font-medium text-amber-950 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1 uppercase tracking-wide">
              Difficulty
            </label>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border-2 border-amber-900 bg-white rounded-md font-medium text-amber-950 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="text-xs text-amber-950 font-semibold px-3 py-2 border-l-2 border-amber-900">
            <span className="text-yellow-700 text-lg">{filteredTreks.length}</span>
            <span className="text-amber-900/70"> / {treks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
