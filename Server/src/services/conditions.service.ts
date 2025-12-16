import type {ClusterBucket, ConditionsSnapshot} from '../types/conditions.types.js';
import {getResortBySlug} from './resorts.service.js';

function severityForBucket(bucket: ClusterBucket): ClusterBucket['severity'] {
  if (bucket.windMph >= 40 || bucket.snowfallIn >= 0.2) return 'stormy';
  if (bucket.snowfallIn >= 0.05) return 'good';
  return 'calm';
}

export async function getConditionsForResortSlug(resortSlug: string): Promise<ConditionsSnapshot | null> {
  const resort = getResortBySlug(resortSlug);
  if (!resort) return null;

  const now = new Date();

  const bucketsBase: Omit<ClusterBucket, 'severity'>[] = [
    {
      label: 'Past 15 min',
      tempF: 18,
      snowfallIn: 0.05,
      windMph: 12
    },
    {
      label: 'Now',
      tempF: 20,
      snowfallIn: 0.08,
      windMph: 18
    },
    {
      label: 'Next 15 min',
      tempF: 21,
      snowfallIn: 0.12,
      windMph: 24
    }
  ];

  const clusterBuckets: ClusterBucket[] = bucketsBase.map(b => {
    const withSeverity: ClusterBucket = {
      ...b,
      severity: 'calm'
    };
    withSeverity.severity = severityForBucket(withSeverity);
    return withSeverity;
  });

  return {
    resortSlug: resort.slug,
    generatedAtIso: now.toISOString(),
    tempF: 20,
    feelsLikeF: 14,
    windMph: 18,
    gustMph: 28,
    visibilityMiles: 2.5,
    snowfall24hIn: 6,
    snowfall48hIn: 10,
    snowfall72hIn: 14,
    snowDepthBaseIn: 48,
    snowDepthSummitIn: 72,
    shortText: 'Light snow with moderate winds and good powder building.',
    clusterBuckets
  };
}
