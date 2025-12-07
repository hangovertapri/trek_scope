import type { Trek, TrekDifficulty } from './types';

// Load initial dataset from JSON (Nepal-only dataset)
import treksJson from './treks.json';

let treks: Trek[] = (treksJson as unknown) as Trek[];

export function getAllTreks(): Trek[] {
  return treks;
}

export function getTrekBySlug(slug: string): Trek | undefined {
  return treks.find((trek) => trek.slug === slug);
}

export function getTreksByAgency(agencyId: string): Trek[] {
  return treks.filter((trek) => trek.agencyId === agencyId);
}

export function getFeaturedTreks(count: number): Trek[] {
  return treks.slice(0, count);
}

// Mutation helpers for simple in-memory CRUD (dev only)
export async function addTrek(trek: Omit<Trek, 'id'>): Promise<Trek> {
  const id = String(Date.now());
  const newTrek: Trek = { id, ...trek } as Trek;
  treks.push(newTrek);
  return newTrek;
}

export async function updateTrek(id: string, patch: Partial<Trek>, userRole?: string, agencyId?: string): Promise<Trek | undefined> {
  const idx = treks.findIndex(t => t.id === id);
  if (idx === -1) return undefined;
  
  const trek = treks[idx];
  
  // Permission check: admins can edit any trek, agencies can only edit their own
  if (userRole === 'agency' && trek.agencyId !== agencyId) {
    return undefined; // Unauthorized
  }
  
  treks[idx] = { ...treks[idx], ...patch };
  return treks[idx];
}

export async function deleteTrek(id: string, userRole?: string, agencyId?: string): Promise<boolean> {
  const idx = treks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  
  const trek = treks[idx];
  
  // Permission check: admins can delete any trek, agencies can only delete their own
  if (userRole === 'agency' && trek.agencyId !== agencyId) {
    return false; // Unauthorized
  }
  
  treks.splice(idx, 1);
  return true;
}

export const difficulties: TrekDifficulty[] = ['Easy', 'Moderate', 'Challenging', 'Expert'];
export const regions = [...new Set(treks.map(t => t.region))];
