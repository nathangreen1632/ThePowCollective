import type { ConditionsSnapshot } from '../types/conditions.types';

type GetConditionsRes = {
  conditions: ConditionsSnapshot;
};

export async function fetchConditionsForResort(slug: string): Promise<ConditionsSnapshot> {
  const param = encodeURIComponent(slug);
  const res = await fetch(`/api/conditions/${param}`);

  if (!res.ok) {
    throw new Error('Conditions not found');
  }

  const data: GetConditionsRes = await res.json();
  return data.conditions;
}
