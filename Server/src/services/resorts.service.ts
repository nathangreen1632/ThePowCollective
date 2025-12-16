import { RESORTS } from '../data/resorts.js';
import type { ResortSummary } from '../types/resort.types.js';

export function getAllResorts(stateSlug?: string): ResortSummary[] {
  if (!stateSlug) return RESORTS;
  const normalized = stateSlug.toLowerCase();
  return RESORTS.filter(r => r.stateSlug.toLowerCase() === normalized);
}

export function getResortBySlug(slug: string): ResortSummary | undefined {
  const normalized = slug.toLowerCase();
  return RESORTS.find(r => r.slug.toLowerCase() === normalized);
}
