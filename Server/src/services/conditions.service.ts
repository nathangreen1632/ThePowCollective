import {fetchOpenMeteoConditions} from './openMeteo.service.js';
import {getResortBySlug} from './resorts.service.js';
import type {ClusterBucket, ClusterSeverity, ConditionsSnapshot} from '../types/conditions.types.js';

type ResortForConditions = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
};

function toMilesFromMeters(value: number | undefined | null): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  const miles = value / 1609.344;
  return Number(miles.toFixed(1));
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

  if (!resort) {
    throw new Error('Resort not found');
  }

  const meteo = await fetchOpenMeteoConditions({
    latitude: resort.lat,
    longitude: resort.lon
  });

  if (!meteo) {
    return buildStubSnapshot(slug);
  }

  const current = meteo.current;

  let tempF = 20;
  if (current && typeof current.temperature_2m === 'number') {
    tempF = current.temperature_2m;
  }

  let feelsLikeF = tempF;
  if (current && typeof current.apparent_temperature === 'number') {
    feelsLikeF = current.apparent_temperature;
  }

  let windMph = 10;
  if (current && typeof current.wind_speed_10m === 'number') {
    windMph = current.wind_speed_10m;
  }

  let gustMph = windMph;
  if (current && typeof current.wind_gusts_10m === 'number') {
    gustMph = current.wind_gusts_10m;
  }

  let visibilityMiles = 0;
  if (current && typeof current.visibility === 'number') {
    visibilityMiles = toMilesFromMeters(current.visibility);
  }

  const hourly = meteo.hourly;

  const snowfallHourly =
    hourly && Array.isArray(hourly.snowfall) ? hourly.snowfall : [];

  const snowfall24hIn = sumLast(snowfallHourly, 24);
  const snowfall48hIn = sumLast(snowfallHourly, 48);
  const snowfall72hIn = sumLast(snowfallHourly, 72);

  const snowDepthValues =
    hourly && Array.isArray(hourly.snow_depth) ? hourly.snow_depth : [];
  const lastDepth =
    snowDepthValues.length > 0
      ? snowDepthValues[snowDepthValues.length - 1]
      : 0;

  const snowDepthBaseIn = Number(lastDepth.toFixed(1));
  const snowDepthSummitIn = Number(lastDepth.toFixed(1));

  const minutely = meteo.minutely_15;

  let clusterBuckets: ClusterBucket[];

  if (
    minutely &&
    Array.isArray(minutely.time) &&
    minutely.time.length > 0
  ) {
    const temps = minutely.temperature_2m || [];
    const snow = minutely.snowfall || [];
    const wind = minutely.wind_speed_10m || [];

    const total = minutely.time.length;
    const lastIndex = total - 1;

    const indices: number[] = [];

    if (total >= 3) {
      indices.push(lastIndex - 2, lastIndex - 1, lastIndex);
    } else if (total === 2) {
      indices.push(0, 1, 1);
    } else {
      indices.push(0, 0, 0);
    }

    const labels = ['Past 15 min', 'Now', 'Next 15 min'];
    const tempsPicked: number[] = [];
    const snowPicked: number[] = [];
    const windPicked: number[] = [];

    for (const element of indices) {
      const index = element;

      let t = tempF;
      if (typeof temps[index] === 'number') {
        t = temps[index];
      }

      let s = 0;
      if (typeof snow[index] === 'number') {
        s = snow[index];
      }

      let w = windMph;
      if (typeof wind[index] === 'number') {
        w = wind[index];
      }

      tempsPicked.push(t);
      snowPicked.push(s);
      windPicked.push(w);
    }

    clusterBuckets = buildClusterBuckets(
      labels,
      tempsPicked,
      snowPicked,
      windPicked
    );
  } else {
    const labels = ['Past 15 min', 'Now', 'Next 15 min'];
    const temps = [tempF, tempF, tempF];
    const snowValues = [0, 0, 0];
    const windValues = [windMph, windMph, windMph];

    clusterBuckets = buildClusterBuckets(
      labels,
      temps,
      snowValues,
      windValues
    );
  }

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
    clusterBuckets
  };
}
