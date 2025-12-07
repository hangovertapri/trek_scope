'use server';

import { z } from 'zod';
import { getAllTreks } from '@/lib/data';
import type { Trek } from '@/lib/types';

const RecommendTrekInputSchema = z.object({
  preferredRegion: z.string(),
  desiredDifficultyLevel: z.string(),
  idealTravelDates: z.string(),
  otherPreferences: z.string().optional(),
});
export type RecommendTrekInput = z.infer<typeof RecommendTrekInputSchema>;

const RecommendTrekOutputSchema = z.object({
  trekRecommendations: z.array(
    z.object({
      id: z.string().optional(),
      trekName: z.string(),
      region: z.string(),
      difficulty: z.string(),
      duration: z.string().or(z.number()),
      description: z.string(),
      matchReason: z.string().optional(),
      priceRange: z.array(z.number()).optional(),
    })
  ),
});
export type RecommendTrekOutput = z.infer<typeof RecommendTrekOutputSchema>;

export async function recommendTrek(input: RecommendTrekInput): Promise<RecommendTrekOutput> {
  try {
    const filteredTreks = filterTreksByPreferences(input);
    if (filteredTreks.length === 0) {
      const allTreks = getAllTreks();
      return {
        trekRecommendations: allTreks.slice(0, 3).map((trek: Trek) => ({
          id: trek.id,
          trekName: trek.name,
          region: trek.region,
          difficulty: trek.difficulty,
          duration: `${trek.duration} days`,
          description: trek.overview || 'Explore this trek in Nepal.',
          matchReason: 'Popular trek',
          priceRange: trek.price_range,
        })),
      };
    }
    const scoredTreks = scoreTreks(filteredTreks, input);
    return {
      trekRecommendations: scoredTreks.slice(0, 3).map(({ trek, reason }) => ({
        id: trek.id,
        trekName: trek.name,
        region: trek.region,
        difficulty: trek.difficulty,
        duration: `${trek.duration} days`,
        description: trek.overview || 'Trek experience',
        matchReason: reason,
        priceRange: trek.price_range,
      })),
    };
  } catch (error) {
    console.error('Error:', error);
    const allTreks = getAllTreks();
    return {
      trekRecommendations: allTreks.slice(0, 3).map((trek: Trek) => ({
        id: trek.id,
        trekName: trek.name,
        region: trek.region,
        difficulty: trek.difficulty,
        duration: `${trek.duration} days`,
        description: trek.overview || 'Trek',
      })),
    };
  }
}

function filterTreksByPreferences(input: RecommendTrekInput): Trek[] {
  let filtered = [...getAllTreks()];
  const regionKeywords = input.preferredRegion.toLowerCase().split(' ');
  filtered = filtered.filter((trek: Trek) =>
    regionKeywords.some((kw: string) =>
      trek.region.toLowerCase().includes(kw) || trek.name.toLowerCase().includes(kw)
    )
  );
  const diffMatch = input.desiredDifficultyLevel.toLowerCase();
  filtered = filtered.filter((trek: Trek) =>
    trek.difficulty.toLowerCase().includes(diffMatch)
  );
  const month = extractMonth(input.idealTravelDates);
  if (month) {
    filtered = filtered.filter((trek: Trek) =>
      trek.best_season?.some((s: string) => {
        const seasonLower = s.toLowerCase();
        // Check if month is in season string (e.g., "autumn (sep-nov)" contains "october")
        return isMonthInSeason(month, seasonLower);
      })
    );
  }
  return filtered;
}

function scoreTreks(treks: Trek[], input: RecommendTrekInput): Array<{ trek: Trek; score: number; reason: string }> {
  return treks.map((trek: Trek) => {
    let score = 0;
    const reasons: string[] = [];
    if (trek.region.toLowerCase().includes(input.preferredRegion.toLowerCase())) {
      score += 25;
      reasons.push(`Located in ${trek.region}`);
    }
    if (trek.difficulty.toLowerCase().includes(input.desiredDifficultyLevel.toLowerCase())) {
      score += 25;
      reasons.push(`${trek.difficulty} level`);
    }
    const month = extractMonth(input.idealTravelDates);
    if (month && trek.best_season?.some((s: string) => isMonthInSeason(month, s.toLowerCase()))) {
      score += 20;
      reasons.push(`Best in ${month}`);
    }
    if (trek.duration >= 5 && trek.duration <= 10) score += 10;
    return { trek, score, reason: reasons.join(', ') || 'Great match' };
  }).sort((a, b) => b.score - a.score);
}

function extractMonth(dateString: string): string | null {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'];
  const lower = dateString.toLowerCase();
  for (const month of months) {
    if (lower.includes(month)) return month;
  }
  return null;
}

function isMonthInSeason(month: string, seasonStr: string): boolean {
  // Normalize month
  const monthMap: Record<string, number> = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12,
  };

  const monthNum = monthMap[month.toLowerCase()];
  if (!monthNum) return false;

  // Season patterns: "Spring (Mar-May)", "Autumn (Sep-Nov)", etc.
  const patterns = [
    { season: 'spring', months: [3, 4, 5] },
    { season: 'summer', months: [6, 7, 8] },
    { season: 'autumn', months: [9, 10, 11] },
    { season: 'fall', months: [9, 10, 11] },
    { season: 'winter', months: [12, 1, 2] },
  ];

  for (const pattern of patterns) {
    if (seasonStr.includes(pattern.season) && pattern.months.includes(monthNum)) {
      return true;
    }
  }

  // Direct month abbreviation match in season string
  for (const [name, num] of Object.entries(monthMap)) {
    if (num === monthNum && (seasonStr.includes(name) || seasonStr.includes(name.slice(0, 3)))) {
      return true;
    }
  }

  return false;
}
