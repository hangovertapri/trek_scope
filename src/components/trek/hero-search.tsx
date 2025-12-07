'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeroSearchProps = {
  onSearch?: (filters: SearchFilters) => void;
};

export type SearchFilters = {
  search: string;
  region: string;
  difficulty: string;
  duration: string;
};

const regions = ['All Regions', 'Himalayas', 'Langtang', 'Everest Region', 'Annapurna', 'Pokhara'];
const difficulties = ['All Difficulties', 'Easy', 'Moderate', 'Challenging', 'Expert'];
const durations = ['All Durations', '3-5 days', '5-7 days', '7-10 days', '10+ days'];

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    region: 'All Regions',
    difficulty: 'All Difficulties',
    duration: 'All Durations',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  const handleQuickFilter = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
  };

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.region !== 'All Regions') params.append('region', filters.region);
    if (filters.difficulty !== 'All Difficulties') params.append('difficulty', filters.difficulty);
    if (filters.duration !== 'All Durations') params.append('duration', filters.duration);
    
    const queryString = params.toString();
    return `/treks${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="w-full bg-gradient-to-b from-black/40 to-transparent py-8 px-4 sm:px-6 md:px-8">
      <form onSubmit={handleSearch} className="max-w-6xl mx-auto w-full">
        {/* Main Search Input */}
        <div className="mb-6 md:mb-8 w-full">
          <div className="relative w-full">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search treks by name, region, or features..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-12 pr-4 py-3 w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 transition-all duration-200 text-base hover:border-white/30"
              aria-label="Search treks"
            />
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8 w-full">
          {/* Region Filter */}
          <div className="w-full">
            <label htmlFor="region-filter" className="sr-only">
              Filter by region
            </label>
            <Select value={filters.region} onValueChange={(value) => handleQuickFilter('region', value)}>
              <SelectTrigger 
                id="region-filter"
                className="w-full bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/20 transition-colors"
                aria-label="Select region"
              >
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="w-full">
            <label htmlFor="difficulty-filter" className="sr-only">
              Filter by difficulty
            </label>
            <Select value={filters.difficulty} onValueChange={(value) => handleQuickFilter('difficulty', value)}>
              <SelectTrigger 
                id="difficulty-filter"
                className="w-full bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/20 transition-colors"
                aria-label="Select difficulty"
              >
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Filter */}
          <div className="w-full">
            <label htmlFor="duration-filter" className="sr-only">
              Filter by duration
            </label>
            <Select value={filters.duration} onValueChange={(value) => handleQuickFilter('duration', value)}>
              <SelectTrigger 
                id="duration-filter"
                className="w-full bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/20 transition-colors"
                aria-label="Select duration"
              >
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button & Quick Browse */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-6 md:mb-8 w-full">
          <Button 
            asChild
            size="lg"
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 focus-visible:ring-2 focus-visible:ring-offset-0 transition-all duration-200"
          >
            <Link href={buildSearchUrl()}>
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Treks
            </Link>
          </Button>
          <span className="text-gray-300 hidden sm:inline text-sm">or</span>
          <Button 
            asChild 
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 py-3 focus-visible:ring-2 focus-visible:ring-accent transition-all duration-200"
          >
            <Link href="/treks">Browse All</Link>
          </Button>
        </div>

        {/* Popular Searches */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-3 md:mb-4 font-medium">Popular searches:</p>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center px-2 sm:px-0">
            {['Everest Base Camp', 'Annapurna', 'Langtang', 'Moderate Treks'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilters({ ...filters, search: tag })}
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none whitespace-nowrap"
                aria-label={`Search for ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
