export type ClusterSeverity = 'calm' | 'good' | 'stormy';

export type ClusterBucket = {
  label: string;
  tempF: number;
  snowfallIn: number;
  windMph: number;
  severity: ClusterSeverity;
};

export type ConditionsSnapshot = {
  resortSlug: string;
  generatedAtIso: string;
  tempF: number;
  feelsLikeF: number;
  windMph: number;
  gustMph: number;
  visibilityMiles: number;
  snowfall24hIn: number;
  snowfall48hIn: number;
  snowfall72hIn: number;
  snowDepthBaseIn: number;
  snowDepthSummitIn: number;
  shortText: string;
  clusterBuckets: ClusterBucket[];
};
