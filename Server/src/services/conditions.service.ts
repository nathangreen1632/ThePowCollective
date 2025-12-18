import {fetchOpenMeteoConditions} from './openMeteo.service.js';
import {getResortBySlug} from './resorts.service.js';
import type {ClusterBucket, ClusterSeverity, ConditionsSnapshot} from '../types/conditions.types.js';

type ResortForConditions = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  elevationTopFt: number;
  elevationBaseFt: number;
};

function toInchesFromMeters(value: number | undefined | null): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Number((value * 39.3700787).toFixed(1));
}

function toMilesFromMeters(value: number | undefined | null): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  const miles = value / 1609.344;
  return Number(miles.toFixed(1));
}

const CLUSTER_LABELS = ['Past 15 min', 'Now', 'Next 15 min'];

function pickNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function arrayOrEmpty<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function computeElevationM(resort: ResortForConditions): number {
  const elevationFt = (resort.elevationTopFt + resort.elevationBaseFt) / 2;
  return Math.round(elevationFt * 0.3048);
}

function pickClusterIndices(total: number): [number, number, number] {
  if (total >= 3) {
    const last = total - 1;
    return [last - 2, last - 1, last];
  }

  if (total === 2) {
    return [0, 1, 1];
  }

  return [0, 0, 0];
}

function buildBucketsFromMinutely(
  minutely: any,
  defaults: { tempF: number; windMph: number }
): ClusterBucket[] {
  const times = arrayOrEmpty<string>(minutely?.time);
  if (times.length === 0) {
    return buildClusterBuckets(
      CLUSTER_LABELS,
      [defaults.tempF, defaults.tempF, defaults.tempF],
      [0, 0, 0],
      [defaults.windMph, defaults.windMph, defaults.windMph]
    );
  }

  const temps = arrayOrEmpty<number>(minutely?.temperature_2m);
  const snow = arrayOrEmpty<number>(minutely?.snowfall);
  const wind = arrayOrEmpty<number>(minutely?.wind_speed_10m);

  const [a, b, c] = pickClusterIndices(times.length);

  const tempsPicked = [
    pickNumber(temps[a], defaults.tempF),
    pickNumber(temps[b], defaults.tempF),
    pickNumber(temps[c], defaults.tempF),
  ];

  const snowPicked = [
    pickNumber(snow[a], 0),
    pickNumber(snow[b], 0),
    pickNumber(snow[c], 0),
  ];

  const windPicked = [
    pickNumber(wind[a], defaults.windMph),
    pickNumber(wind[b], defaults.windMph),
    pickNumber(wind[c], defaults.windMph),
  ];

  return buildClusterBuckets(CLUSTER_LABELS, tempsPicked, snowPicked, windPicked);
}

function sumLast(values: number[] | undefined, count: number): number {
  if (!values || values.length === 0) {
    return 0;
  }

  const length = values.length;
  const startIndex = Math.max(0, length - count);
  let total = 0;

  for (let i = startIndex; i < length; i += 1) {
    const raw = values[i];

    if (!Number.isNaN(raw)) {
      total += raw;
    }
  }

  return Number(total.toFixed(2));
}

function classifySeverity(
  tempF: number,
  snowfallIn: number,
  windMph: number
): ClusterSeverity {
  if (windMph >= 40 || snowfallIn >= 0.25) {
    return 'stormy';
  }

  if (snowfallIn >= 0.05 && snowfallIn < 0.25 && windMph <= 30 && tempF <= 30) {
    return 'good';
  }

  return 'calm';
}

function buildClusterBuckets(
  labels: string[],
  tempsF: number[],
  snowfallIn: number[],
  windMph: number[]
): ClusterBucket[] {
  const buckets: ClusterBucket[] = [];

  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i] || '';
    const temp = tempsF[i] ?? tempsF.at(-1) ?? 0;
    const snow = snowfallIn[i] ?? snowfallIn.at(-1) ?? 0;
    const wind = windMph[i] ?? windMph.at(-1) ?? 0;

    const severity = classifySeverity(temp, snow, wind);

    const bucket: ClusterBucket = {
      label,
      tempF: temp,
      snowfallIn: Number(snow.toFixed(2)),
      windMph: wind,
      severity
    };

    buckets.push(bucket);
  }

  return buckets;
}

function buildShortText(
  snowfall24hIn: number,
  snowfall72hIn: number,
  windMph: number,
  tempF: number
): string {
  if (snowfall24hIn >= 12) {
    return 'Storm-level powder with a foot or more in the last 24 hours. Expect deep turns and variable visibility.';
  }

  if (snowfall24hIn >= 6) {
    return 'Strong overnight refresh with 6–12 inches in the last 24 hours. Classic powder day conditions.';
  }

  if (snowfall72hIn >= 8) {
    return 'Several days of on-and-off snow. Chalky boot-top turns with pockets of deeper stashes in sheltered terrain.';
  }

  if (snowfall24hIn > 0) {
    return 'A few fresh inches to soften things up. Great for cruising groomers and hunting pockets in the trees.';
  }

  if (tempF <= 10 && windMph >= 20) {
    return 'Very cold and breezy. Bundle up, cover exposed skin, and expect wind-affected snow up high.';
  }

  if (tempF >= 32) {
    return 'Warmer temps and little to no new snow. Expect firm morning conditions softening through the day on sunny aspects.';
  }

  return 'No meaningful new snow recently. Expect packed-powder or firm conditions with weather-driven variability by aspect and elevation.';
}

function buildStubSnapshot(slug: string): ConditionsSnapshot {
  const tempF = 20;
  const feelsLikeF = 12;
  const windMph = 18;
  const gustMph = 28;
  const snowfall24hIn = 6;
  const snowfall48hIn = 10;
  const snowfall72hIn = 14;
  const snowDepthBaseIn = 48;
  const snowDepthSummitIn = 72;
  const visibilityMiles = 2.5;

  const labels = ['Past 15 min', 'Now', 'Next 15 min'];
  const temps = [18, 20, 21];
  const snow = [0.05, 0.08, 0.12];
  const wind = [12, 18, 24];

  const clusterBuckets = buildClusterBuckets(labels, temps, snow, wind);
  const shortText = 'Live conditions are temporarily unavailable. Showing sample conditions for layout and testing.';

  return {
    resortSlug: slug,
    generatedAtIso: new Date().toISOString(),
    tempF,
    feelsLikeF,
    windMph,
    gustMph,
    visibilityMiles,
    snowfall24hIn,
    snowfall48hIn,
    snowfall72hIn,
    snowDepthBaseIn,
    snowDepthSummitIn,
    shortText,
    clusterBuckets
  };
}

export async function getConditionsForResort(
  slug: string
): Promise<ConditionsSnapshot> {
  const resort = getResortBySlug(slug) as ResortForConditions | undefined;
  if (!resort) throw new Error('Resort not found');

  const elevationM = computeElevationM(resort);

  const meteo = await fetchOpenMeteoConditions({
    latitude: resort.lat,
    longitude: resort.lon,
    elevation: elevationM,
  });

  if (!meteo) {
    return buildStubSnapshot(slug);
  }

  const current = meteo.current;

  const tempF = pickNumber(current?.temperature_2m, 20);
  const feelsLikeF = pickNumber(current?.apparent_temperature, tempF);
  const windMph = pickNumber(current?.wind_speed_10m, 10);
  const gustMph = pickNumber(current?.wind_gusts_10m, windMph);

  const visibilityRaw = current?.visibility;
  const visibilityMiles =
    typeof visibilityRaw === 'number' ? toMilesFromMeters(visibilityRaw) : 0;

  const hourly = meteo.hourly;

  const snowfallHourly = arrayOrEmpty<number>(hourly?.snowfall);
  const snowfall24hIn = sumLast(snowfallHourly, 24);
  const snowfall48hIn = sumLast(snowfallHourly, 48);
  const snowfall72hIn = sumLast(snowfallHourly, 72);

  const snowDepthValues = arrayOrEmpty<number>(hourly?.snow_depth);
  const lastDepth = snowDepthValues.length > 0 ? snowDepthValues.at(-1) : 0;

  const depthIn = toInchesFromMeters(lastDepth);
  const snowDepthBaseIn = depthIn;
  const snowDepthSummitIn = depthIn;

  const clusterBuckets = buildBucketsFromMinutely(meteo.minutely_15, {
    tempF,
    windMph,
  });

  const shortText = buildShortText(
    snowfall24hIn,
    snowfall72hIn,
    windMph,
    tempF
  );

  return {
    resortSlug: slug,
    generatedAtIso: new Date().toISOString(),
    tempF,
    feelsLikeF,
    windMph,
    gustMph,
    visibilityMiles,
    snowfall24hIn,
    snowfall48hIn,
    snowfall72hIn,
    snowDepthBaseIn,
    snowDepthSummitIn,
    shortText,
    clusterBuckets,
  };
}
