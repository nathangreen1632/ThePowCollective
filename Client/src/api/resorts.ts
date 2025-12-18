import type { ResortSummary } from '../types/resort.types';

type ListResortsRes = {
  resorts: ResortSummary[];
};

type GetResortRes = {
  resort: ResortSummary;
};

export async function fetchResorts(stateSlug?: string): Promise<ResortSummary[]> {
  let url = '/api/resorts';

  if (stateSlug) {
    const param = encodeURIComponent(stateSlug);
    url = `/api/resorts?state=${param}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to load resorts');
  }

  const data: ListResortsRes = await res.json();
  return data.resorts;
}

export async function fetchResort(slug: string): Promise<ResortSummary> {
  const param = encodeURIComponent(slug);
  const res = await fetch(`/api/resorts/${param}`);

  if (!res.ok) {
    throw new Error('Resort not found');
  }

  const data: GetResortRes = await res.json();
  return data.resort;
}
