'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Trek } from '@/lib/types';

interface AdvancedFiltersProps {
  treks: Trek[];
  onFilterChange: (filteredTreks: Trek[]) => void;
}

export default function AdvancedFilters({ treks, onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [duration, setDuration] = useState<[number, number]>([1, 30]);
  const [altitude, setAltitude] = useState<[number, number]>([0, 9000]);
  const [season, setSeason] = useState<string[]>([]);
  const [permits, setPermits] = useState<'all' | 'required' | 'not-required'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Get unique values for dropdowns
  const uniqueSeasons = useMemo(() => {
    const seasons = new Set<string>();
    treks.forEach((trek) => trek.best_season.forEach((s) => seasons.add(s)));
    return Array.from(seasons).sort();
  }, [treks]);

  const maxPrice = useMemo(() => {
    if (treks.length === 0) return 10000;
    const prices = treks.map((t) => t.price_range[1]);
    return Math.max(...prices) || 10000;
  }, [treks]);

  // Apply filters
  const filtered = useMemo(() => {
    return treks.filter((trek) => {
      // Difficulty filter
      if (difficulty.length > 0 && !difficulty.includes(trek.difficulty)) {
        return false;
      }

      // Duration filter
      if (trek.duration < duration[0] || trek.duration > duration[1]) {
        return false;
      }

      // Altitude filter
      if (trek.altitude < altitude[0] || trek.altitude > altitude[1]) {
        return false;
      }

      // Season filter
      if (season.length > 0 && !trek.best_season.some((s) => season.includes(s))) {
        return false;
      }

      // Permit filter
      if (permits === 'required' && !trek.permit_required) {
        return false;
      }
      if (permits === 'not-required' && trek.permit_required) {
        return false;
      }

      // Price filter
      if (trek.price_range[0] > priceRange[1] || trek.price_range[1] < priceRange[0]) {
        return false;
      }

      return true;
    });
  }, [treks, difficulty, duration, altitude, season, permits, priceRange]);

  // Call callback when filters change
  useEffect(() => {
    onFilterChange(filtered);
  }, [filtered, onFilterChange]);

  const toggleDifficulty = (value: string) => {
    setDifficulty((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSeason = (value: string) => {
    setSeason((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const resetFilters = () => {
    setDifficulty([]);
    setDuration([1, 30]);
    setAltitude([0, 9000]);
    setSeason([]);
    setPermits('all');
    setPriceRange([0, maxPrice]);
  };

  const hasActiveFilters =
    difficulty.length > 0 ||
    duration[0] > 1 ||
    duration[1] < 30 ||
    altitude[0] > 0 ||
    altitude[1] < 9000 ||
    season.length > 0 ||
    permits !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-amber-500 transition mb-6"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-amber-400" />
          <span className="font-semibold text-slate-100">
            Advanced Filters {hasActiveFilters && `(${filtered.length})`}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6 space-y-6">
          {/* Difficulty */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {['Easy', 'Moderate', 'Challenging', 'Expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => toggleDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    difficulty.includes(level)
                      ? 'bg-accent text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              Trek Duration: {duration[0]} - {duration[1]} days
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="30"
                value={duration[0]}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), duration[1]);
                  setDuration([newMin, duration[1]]);
                }}
                className="w-full"
              />
              <input
                type="range"
                min="1"
                max="30"
                value={duration[1]}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), duration[0]);
                  setDuration([duration[0], newMax]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>1 day</span>
                <span>30 days</span>
              </div>
            </div>
          </div>

          {/* Altitude */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              Max Altitude: {altitude[0].toLocaleString()} - {altitude[1].toLocaleString()}m
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="9000"
                step="500"
                value={altitude[0]}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), altitude[1]);
                  setAltitude([newMin, altitude[1]]);
                }}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="9000"
                step="500"
                value={altitude[1]}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), altitude[0]);
                  setAltitude([altitude[0], newMax]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0m</span>
                <span>9000m</span>
              </div>
            </div>
          </div>

          {/* Best Season */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">Best Season</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueSeasons.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSeason(s)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    season.includes(s)
                      ? 'bg-accent text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Permit Required */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">Permit Status</h3>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'required', label: 'Permit Required' },
                { value: 'not-required', label: 'No Permit' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPermits(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    permits === option.value
                      ? 'bg-accent text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="100"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), priceRange[1]);
                  setPriceRange([newMin, priceRange[1]]);
                }}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="100"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], newMax]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>$0</span>
                <span>${maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-slate-700">
            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            )}
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-accent hover:bg-accent/90"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg mb-6">
          <p className="text-sm text-slate-300">
            Showing <span className="font-bold text-amber-400">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-100">{treks.length}</span> treks
          </p>
        </div>
      )}
    </div>
  );
}
