import type { Trek, TrekDifficulty, Agent, AgentTrekOffer } from './types';

// Load initial dataset from JSON (Nepal-only dataset)
import treksJson from './treks.json';
import agentsJson from './agents.json';
import agentOffersJson from './agent-trek-offers.json';

let treks: Trek[] = (treksJson as unknown) as Trek[];
let agents: Agent[] = (agentsJson as unknown) as Agent[];
let agentOffers: AgentTrekOffer[] = (agentOffersJson as unknown) as AgentTrekOffer[];

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

// ========== AGENT FUNCTIONS ==========

export function getAllAgents(): Agent[] {
  return agents.filter(a => a.active);
}

export function getAgentById(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}

// ========== AGENT TREK OFFER FUNCTIONS ==========

export function getAllAgentOffers(): AgentTrekOffer[] {
  return agentOffers.filter(o => o.active);
}

export function getOffersByTrekId(trekId: string): AgentTrekOffer[] {
  return agentOffers.filter(o => o.trek_id === trekId && o.active);
}

export function getOffersByTrekSlug(slug: string): AgentTrekOffer[] {
  return agentOffers.filter(o => o.trek_slug === slug && o.active);
}

export function getOffersByAgentId(agentId: string): AgentTrekOffer[] {
  return agentOffers.filter(o => o.agent_id === agentId && o.active);
}

export function getOfferById(offerId: string): AgentTrekOffer | undefined {
  return agentOffers.find(o => o.id === offerId);
}

// Create new agent offer
export async function addAgentOffer(offer: Omit<AgentTrekOffer, 'id' | 'created_at' | 'updated_at'>): Promise<AgentTrekOffer> {
  const id = `offer-${Date.now()}`;
  const now = new Date().toISOString();
  const newOffer: AgentTrekOffer = {
    id,
    ...offer,
    created_at: now,
    updated_at: now,
  };
  agentOffers.push(newOffer);
  return newOffer;
}

// Update agent offer (agents can update their own, admin can update any)
export async function updateAgentOffer(
  offerId: string,
  patch: Partial<AgentTrekOffer>,
  userRole?: string,
  agentId?: string
): Promise<AgentTrekOffer | undefined> {
  const idx = agentOffers.findIndex(o => o.id === offerId);
  if (idx === -1) return undefined;

  const offer = agentOffers[idx];

  // Permission check: agents can only edit their own offers, admin can edit any
  if (userRole === 'agency' && offer.agent_id !== agentId) {
    return undefined; // Unauthorized
  }

  agentOffers[idx] = {
    ...agentOffers[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return agentOffers[idx];
}

// Delete agent offer (soft delete by setting active: false)
export async function deleteAgentOffer(
  offerId: string,
  userRole?: string,
  agentId?: string
): Promise<boolean> {
  const idx = agentOffers.findIndex(o => o.id === offerId);
  if (idx === -1) return false;

  const offer = agentOffers[idx];

  // Permission check
  if (userRole === 'agency' && offer.agent_id !== agentId) {
    return false; // Unauthorized
  }

  agentOffers[idx].active = false;
  agentOffers[idx].updated_at = new Date().toISOString();
  return true;
}
