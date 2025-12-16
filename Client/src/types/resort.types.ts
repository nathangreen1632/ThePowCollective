export type ResortSize = 'local' | 'regional' | 'mega';

export type ResortBrand = 'epic' | 'ikon' | 'independent';

export type ResortSummary = {
  slug: string;
  name: string;
  stateCode: string;
  stateSlug: string;
  size: ResortSize;
  brand: ResortBrand;
  elevationTopFt: number;
  elevationBaseFt: number;
  verticalDropFt: number;
  lat: number;
  lon: number;
  defaultCity?: string;
  defaultDriveFromCityMinutes?: number;
};
