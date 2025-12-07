'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Trek } from '@/lib/types';
import TrekCard from '@/components/trek/trek-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

export default function TreksContent() {
  const searchParams = useSearchParams();
  const [allTreks, setAllTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [region, setRegion] = useState('all');
  const [durationRange, setDurationRange] = useState([1, 30]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch treks from API on mount
  useEffect(() => {
    async function fetchTreks() {
      try {
        const res = await fetch('/api/treks', { cache: 'no-store' });
        const data = await res.json();
        setAllTreks(data);
      } catch (error) {
        console.error('Failed to fetch treks:', error);
        setAllTreks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTreks();
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const search = searchParams?.get('search') || '';
    const diffParam = searchParams?.get('difficulty') || 'all';
    const regionParam = searchParams?.get('region') || 'all';
    const durationParam = searchParams?.get('duration') || '';

    if (search) setSearchTerm(search);
    if (diffParam !== 'all') setDifficulty(diffParam);
    if (regionParam !== 'all') setRegion(regionParam);
    
    // Parse duration filter (e.g., "5-7 days" -> [5, 7])
    if (durationParam) {
      if (durationParam === '3-5 days') setDurationRange([3, 5]);
      else if (durationParam === '5-7 days') setDurationRange([5, 7]);
      else if (durationParam === '7-10 days') setDurationRange([7, 10]);
      else if (durationParam === '10+ days') setDurationRange([10, 30]);
    }
  }, [searchParams]);

  const filteredTreks = useMemo(() => {
    return allTreks.filter((trek: Trek) => {
      const searchMatch =
        searchTerm === '' ||
        trek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trek.region.toLowerCase().includes(searchTerm.toLowerCase());
      const difficultyMatch =
        difficulty === 'all' || trek.difficulty === difficulty;
      const regionMatch = region === 'all' || trek.region === region;
      const durationMatch =
        trek.duration >= durationRange[0] && trek.duration <= durationRange[1];
      const seasonMatch =
        selectedSeasons.length === 0 ||
        trek.best_season.some((season: string) =>
          selectedSeasons.includes(season)
        );
      return searchMatch && difficultyMatch && regionMatch && durationMatch && seasonMatch;
    });
  }, [allTreks, searchTerm, difficulty, region, durationRange, selectedSeasons]);

  const toggleSeason = (season: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDifficulty('all');
    setRegion('all');
    setDurationRange([1, 30]);
    setSelectedSeasons([]);
  };

  const hasActiveFilters = 
    searchTerm || 
    difficulty !== 'all' || 
    region !== 'all' || 
    durationRange[0] !== 1 || 
    durationRange[1] !== 30 || 
    selectedSeasons.length > 0;

  return (
    <div>
      {/* Filters Section */}
      <div className="mb-8 bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                Active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <Button 
              onClick={resetFilters}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <Label htmlFor="search-input" className="mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search by name or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search treks"
            />
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Region Filter */}
          <div>
            <Label htmlFor="region-select" className="mb-2 block">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region-select" className="focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(allTreks.map((t: Trek) => t.region))).map((r: string) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <Label htmlFor="difficulty-select" className="mb-2 block">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty-select" className="focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {['Easy', 'Moderate', 'Challenging', 'Expert'].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Filter */}
          <div>
            <Label className="mb-2 block">Duration: {durationRange[0]} - {durationRange[1]} days</Label>
            <Slider
              min={1}
              max={30}
              step={1}
              value={durationRange}
              onValueChange={setDurationRange}
              className="w-full"
              aria-label="Duration range"
            />
          </div>
        </div>

        {/* Season Filter */}
        <div>
          <Label className="mb-3 block">Best Season</Label>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => toggleSeason(season)}
                className={`px-4 py-2 rounded-full border transition-colors font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none ${
                  selectedSeasons.includes(season)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary/50'
                }`}
                aria-pressed={selectedSeasons.includes(season)}
                aria-label={`Filter by ${season}`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Results: <span className="text-primary">{filteredTreks.length}</span> treks found
          </h2>
        </div>

        {filteredTreks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No treks found matching your criteria.
            </p>
            <Button onClick={resetFilters} variant="outline">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreks.map((trek: Trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
