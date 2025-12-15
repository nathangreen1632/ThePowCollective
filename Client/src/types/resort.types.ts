export type ResortSize = 'local' | 'regional' | 'mega';

export type ResortBrand = 'epic' | 'ikon' | 'independent';

export type ResortSummary = {
  slug: string;
  name: string;
  stateCode: string;
  stateSlug: string;
  size: ResortSize;
  brand: ResortBrand;
  elevationTopM: number;
  elevationBaseM: number;
  verticalDropM: number;
  lat: number;
  lon: number;
  driveFromDenverMinutes?: number;
};
