import { RESORTS } from '../data/resorts';
import type { ResortSummary } from '../types/resort.types';

export function getResortsForStateSlug(stateSlug: string): ResortSummary[] {
  const normalized = stateSlug.toLowerCase();
  return RESORTS.filter(r => r.stateSlug.toLowerCase() === normalized);
}

export function getResortBySlug(slug: string): ResortSummary | undefined {
  const normalized = slug.toLowerCase();
  return RESORTS.find(r => r.slug.toLowerCase() === normalized);
}
