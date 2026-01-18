'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/navigation';
import { Trek, TrekDifficulty } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mountain, Filter, X } from 'lucide-react';

interface InteractiveNepalMapProps {
  treks: Trek[];
  initialRegion?: string;
  initialDifficulty?: TrekDifficulty;
  initialSeason?: string;
}

// Region coordinates for camera positioning (center of each region)
const REGION_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  'Khumbu': { center: [86.7, 27.9], zoom: 10.5 },
  'Annapurna': { center: [83.9, 28.6], zoom: 10.5 },
  'Langtang': { center: [85.5, 28.2], zoom: 11 },
  'Manaslu': { center: [84.6, 28.5], zoom: 10.5 },
  'Makalu': { center: [87.1, 27.8], zoom: 10.5 },
  'Taplejung': { center: [87.7, 27.4], zoom: 10 },
  'Dolpo': { center: [82.9, 29.0], zoom: 9.5 },
  'Mustang': { center: [83.9, 29.2], zoom: 10 },
  'Rolwaling': { center: [86.0, 27.9], zoom: 10.5 },
  'Dhaulagiri': { center: [83.5, 28.7], zoom: 10 },
  'Ganesh Himal': { center: [85.2, 28.4], zoom: 10.5 },
};

// Difficulty color scheme
const DIFFICULTY_COLORS: Record<TrekDifficulty, string> = {
  'Easy': '#10b981',        // Green
  'Moderate': '#f59e0b',    // Yellow/Amber
  'Challenging': '#f97316', // Orange
  'Expert': '#ef4444',      // Red
};

// Get all unique regions from treks
const getUniqueRegions = (treks: Trek[]): string[] => {
  return Array.from(new Set(treks.map(t => t.region))).sort();
};

// Get all unique seasons
const getUniqueSeasons = (treks: Trek[]): string[] => {
  const seasons = new Set<string>();
  treks.forEach(trek => {
    trek.best_season.forEach(season => seasons.add(season));
  });
  return Array.from(seasons).sort();
};

export function InteractiveNepalMap({ 
  treks, 
  initialRegion, 
  initialDifficulty,
  initialSeason 
}: InteractiveNepalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const router = useRouter();

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<TrekDifficulty | 'all'>(initialDifficulty || 'all');
  const [selectedSeason, setSelectedSeason] = useState<string>(initialSeason || 'all');
  const [loading, setLoading] = useState(true);

  const regions = useMemo(() => getUniqueRegions(treks), [treks]);
  const seasons = useMemo(() => getUniqueSeasons(treks), [treks]);

  // Filter treks based on selected filters
  const filteredTreks = useMemo(() => {
    return treks.filter(trek => {
      const regionMatch = selectedRegion === 'all' || trek.region === selectedRegion;
      const difficultyMatch = selectedDifficulty === 'all' || trek.difficulty === selectedDifficulty;
      const seasonMatch = selectedSeason === 'all' || trek.best_season.some(s => s === selectedSeason);
      
      return regionMatch && difficultyMatch && seasonMatch && trek.coordinates;
    });
  }, [treks, selectedRegion, selectedDifficulty, selectedSeason]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-base': {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap, &copy; CARTO'
          },
          'terrain': {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#f5e6d3'
            }
          },
          {
            id: 'base-map',
            type: 'raster',
            source: 'carto-base',
            paint: {
              'raster-opacity': 0.85,
              'raster-contrast': 0.1,
              'raster-saturation': -0.5,
              'raster-brightness-min': 0.4,
              'raster-brightness-max': 0.95
            }
          }
        ],
        terrain: {
          source: 'terrain',
          exaggeration: 3.0
        }
      },
      center: [84.5, 28.3], // Center of Nepal
      zoom: 7,
      pitch: 60,
      bearing: -15,
      // Restrict map bounds to Nepal only
      maxBounds: [
        [79.5, 26.0], // Southwest coordinates (lower left)
        [88.5, 30.5]  // Northeast coordinates (upper right)
      ],
      minZoom: 6.5,
      maxZoom: 12,
      interactive: true,
      attributionControl: false
    });

    map.current.on('load', () => {
      // Add navigation controls
      map.current?.addControl(new maplibregl.NavigationControl(), 'top-right');

      setLoading(false);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!map.current || loading) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for ALL treks (not just filtered ones)
    // This allows us to show all treks but blur the non-matching ones
    treks.forEach((trek) => {
      if (!trek.coordinates) return;

      const [lat, lng] = trek.coordinates;
      const color = DIFFICULTY_COLORS[trek.difficulty];

      // Create custom marker element (flag) - Hogwarts Legacy style
      const el = document.createElement('div');
      el.className = 'trek-marker';
      
      // Check if trek matches all active filters
      const regionMatch = selectedRegion === 'all' || trek.region === selectedRegion;
      const difficultyMatch = selectedDifficulty === 'all' || trek.difficulty === selectedDifficulty;
      const seasonMatch = selectedSeason === 'all' || trek.best_season.some(s => s === selectedSeason);
      const isHighlighted = regionMatch && difficultyMatch && seasonMatch;
      
      el.style.cssText = `
        width: 36px;
        height: 44px;
        cursor: pointer;
        position: relative;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ${!isHighlighted ? 'opacity: 0.25; filter: grayscale(1) blur(1px) drop-shadow(0 2px 4px rgba(0,0,0,0.3));' : ''}
      `;

      // Create SVG flag (Hogwarts Legacy inspired design)
      el.innerHTML = `
        <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <defs>
            <linearGradient id="grad-${trek.slug}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
            </linearGradient>
            <filter id="glow-${trek.slug}">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Flag pole -->
          <rect x="3" y="2" width="3" height="40" 
                fill="#4a4a4a" 
                stroke="#ffffff" 
                stroke-width="0.5"/>
          <!-- Flag -->
          <path d="M 6 3 L 32 3 L 32 18 L 28 15 L 6 15 Z" 
                fill="url(#grad-${trek.slug})" 
                stroke="#ffffff" 
                stroke-width="1.5"
                stroke-linejoin="round"
                filter="url(#glow-${trek.slug})"/>
          <!-- Flag detail line -->
          <line x1="8" y1="6" x2="28" y2="6" 
                stroke="#ffffff" 
                stroke-width="0.8" 
                opacity="0.5"/>
          <line x1="8" y1="9" x2="24" y2="9" 
                stroke="#ffffff" 
                stroke-width="0.8" 
                opacity="0.5"/>
          <!-- Pole base -->
          <circle cx="4.5" cy="42" r="2" 
                  fill="#4a4a4a" 
                  stroke="#ffffff" 
                  stroke-width="1"/>
        </svg>
      `;

      // Create tooltip label (shown next to flag on hover)
      const tooltipLabel = document.createElement('div');
      tooltipLabel.className = 'trek-tooltip-label';
      tooltipLabel.style.cssText = `
        position: absolute;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        padding: 6px 10px;
        border-radius: 6px;
        border: 2px solid #d97706;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 1000;
      `;
      tooltipLabel.innerHTML = `
        <div style="font-weight: 700; color: #78350f; font-size: 13px; margin-bottom: 2px;">
          ${trek.name}
        </div>
        <div style="font-size: 10px; color: #92400e;">
          ${trek.region} • ${trek.difficulty} • ${trek.duration} days
        </div>
      `;
      el.appendChild(tooltipLabel);

      // Hover effect - show tooltip next to flag
      el.addEventListener('mouseenter', () => {
        if (isHighlighted) {
          el.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(1.1)';
          tooltipLabel.style.opacity = '1';
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.filter = isHighlighted 
          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' 
          : 'grayscale(1) blur(1px) drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
        tooltipLabel.style.opacity = '0';
      });

      // Click to navigate
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        router.push(`/treks/${trek.slug}`);
      });

      // Create and add marker with fixed positioning
      const marker = new maplibregl.Marker({ 
        element: el,
        anchor: 'bottom',
        offset: [0, 0]
      })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [treks, loading, selectedRegion, selectedDifficulty, selectedSeason, router]);

  // Zoom to region when selected
  useEffect(() => {
    if (!map.current || loading) return;

    if (selectedRegion === 'all') {
      // Reset to Nepal view
      map.current.flyTo({
        center: [84.5, 28.3],
        zoom: 7,
        pitch: 45,
        bearing: 0,
        duration: 1500,
      });
      return;
    }

    const regionCoords = REGION_COORDINATES[selectedRegion];
    if (regionCoords) {
      map.current.flyTo({
        center: regionCoords.center,
        zoom: regionCoords.zoom,
        pitch: 50,
        bearing: 0,
        duration: 1500,
      });
    }
  }, [selectedRegion, loading]);

  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedDifficulty('all');
    setSelectedSeason('all');
  };

  const hasActiveFilters = selectedRegion !== 'all' || selectedDifficulty !== 'all' || selectedSeason !== 'all';

  return (
    <div className="relative w-full h-screen">
      {/* Custom CSS for Medieval/Fantasy Parchment Map Style */}
      <style jsx global>{`
        .maplibregl-map {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: #f5e6d3;
        }
        
        .maplibregl-canvas-container {
          background: #f5e6d3;
        }
        
        .maplibregl-canvas {
          filter: sepia(0.35) contrast(1.1) brightness(0.95) saturate(0.7);
        }
        
        .trek-marker {
          pointer-events: auto;
        }
        
        /* Prevent markers from shifting position */
        .maplibregl-marker {
          will-change: auto !important;
        }
        
        /* Medieval/Fantasy UI elements */
        .maplibregl-ctrl-group {
          background: linear-gradient(135deg, #2a231c 0%, #3d3329 100%) !important;
          border: 2px solid #8b7355 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }
        
        .maplibregl-ctrl-group button {
          background-color: transparent !important;
          border-color: #8b7355 !important;
          color: #d4c5a9 !important;
        }
        
        .maplibregl-ctrl-group button:hover {
          background-color: rgba(139, 115, 85, 0.3) !important;
        }
        
        .maplibregl-ctrl-icon {
          filter: sepia(0.6) hue-rotate(15deg) brightness(1.2);
        }
        
        /* Parchment overlay */
        .maplibregl-map::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 40%, rgba(255,248,220,0.1) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
      
      {/* Filter Panel */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-amber-50/95 to-stone-100/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 max-w-md border-2 border-amber-600/30">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-amber-700" />
          <h3 className="font-bold text-lg text-amber-900">Filter Treks</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto hover:bg-amber-100"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {/* Region Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Difficulty Level</label>
            <Select value={selectedDifficulty} onValueChange={(val) => setSelectedDifficulty(val as TrekDifficulty | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS.Easy }}></span>
                    Easy
                  </span>
                </SelectItem>
                <SelectItem value="Moderate">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS.Moderate }}></span>
                    Moderate
                  </span>
                </SelectItem>
                <SelectItem value="Challenging">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS.Challenging }}></span>
                    Challenging
                  </span>
                </SelectItem>
                <SelectItem value="Expert">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS.Expert }}></span>
                    Expert
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">Best Season</label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasons.map(season => (
                  <SelectItem key={season} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-3 border-t border-amber-200">
          <Badge variant="secondary" className="w-full justify-center bg-amber-100 text-amber-900 border border-amber-300">
            <Mountain className="h-3 w-3 mr-1" />
            {filteredTreks.length} Trek{filteredTreks.length !== 1 ? 's' : ''} Highlighted
          </Badge>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-amber-200">
          <p className="text-xs font-medium mb-2 text-amber-900">Difficulty Legend:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(DIFFICULTY_COLORS).map(([difficulty, color]) => (
              <div key={difficulty} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-amber-300" style={{ backgroundColor: color }}></div>
                <span className="text-amber-800">{difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-stone-100 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Mountain className="h-12 w-12 text-amber-700 animate-pulse mx-auto mb-2" />
            <p className="text-sm text-amber-800 font-medium">Loading Nepal Map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
