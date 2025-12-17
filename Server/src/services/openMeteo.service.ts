const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/gfs';

type OpenMeteoMinutely15 = {
  time: string[];
  temperature_2m?: number[];
  snowfall?: number[];
  wind_speed_10m?: number[];
  visibility?: number[];
};

type OpenMeteoHourly = {
  time: string[];
  snowfall?: number[];
  snow_depth?: number[];
  wind_speed_10m?: number[];
  wind_gusts_10m?: number[];
  visibility?: number[];
};

type OpenMeteoCurrent = {
  time: string;
  temperature_2m?: number;
  apparent_temperature?: number;
  snowfall?: number;
  wind_speed_10m?: number;
  wind_gusts_10m?: number;
  visibility?: number;
};

export type OpenMeteoResponse = {
  current?: OpenMeteoCurrent;
  minutely_15?: OpenMeteoMinutely15;
  hourly?: OpenMeteoHourly;
};

type FetchArgs = {
  latitude: number;
  longitude: number;
  elevation?: number;
};

type CacheEntry = {
  value: OpenMeteoResponse;
  expiresAt: number;
};

const DEFAULT_TTL_MS = 3 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<OpenMeteoResponse | null>>();

function ttlMs(): number {
  const raw = process.env.OPEN_METEO_CACHE_TTL_MS;
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return DEFAULT_TTL_MS;
}

function normalizeCoord(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(4);
}

function normalizeElevation(value: number | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return String(Math.round(value));
}

function buildCacheKey(args: FetchArgs): string {
  const parts = [
    normalizeCoord(args.latitude),
    normalizeCoord(args.longitude),
    normalizeElevation(args.elevation),
  ];

  return parts.join('|');
}

function sweepCache(now: number): void {
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
  }

  if (cache.size <= MAX_CACHE_ENTRIES) return;

  const overBy = cache.size - MAX_CACHE_ENTRIES;
  let removed = 0;

  for (const key of cache.keys()) {
    cache.delete(key);
    removed += 1;
    if (removed >= overBy) break;
  }
}

export async function fetchOpenMeteoConditions(
  args: FetchArgs
): Promise<OpenMeteoResponse | null> {
  const now = Date.now();
  sweepCache(now);

  const cacheKey = buildCacheKey(args);
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  if (cached) {
    cache.delete(cacheKey);
  }

  const pending = inflight.get(cacheKey);
  if (pending) {
    return pending;
  }

  const run = (async (): Promise<OpenMeteoResponse | null> => {
    const searchParams = new URLSearchParams();

    searchParams.set('latitude', String(args.latitude));
    searchParams.set('longitude', String(args.longitude));

    if (typeof args.elevation === 'number' && !Number.isNaN(args.elevation)) {
      searchParams.set('elevation', String(args.elevation));
    }

    searchParams.set(
      'minutely_15',
      ['temperature_2m', 'snowfall', 'wind_speed_10m', 'visibility'].join(',')
    );
    searchParams.set('past_minutely_15', '1');
    searchParams.set('forecast_minutely_15', '2');

    searchParams.set(
      'hourly',
      ['snowfall', 'snow_depth', 'wind_speed_10m', 'wind_gusts_10m', 'visibility'].join(',')
    );
    searchParams.set('past_hours', '72');
    searchParams.set('forecast_hours', '0');

    searchParams.set(
      'current',
      [
        'temperature_2m',
        'apparent_temperature',
        'snowfall',
        'wind_speed_10m',
        'wind_gusts_10m',
        'visibility',
      ].join(',')
    );

    searchParams.set('temperature_unit', 'fahrenheit');
    searchParams.set('wind_speed_unit', 'mph');
    searchParams.set('precipitation_unit', 'inch');
    searchParams.set('timezone', 'auto');

    const url = `${OPEN_METEO_BASE_URL}?${searchParams.toString()}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        const status = res.status;
        let body;

        try {
          body = await res.text();
        } catch {
          body = '';
        }

        console.error('Open-Meteo HTTP status:', status);
        if (body) {
          console.error('Open-Meteo body snippet:', body.slice(0, 400));
        }

        return null;
      }

      const value = (await res.json()) as OpenMeteoResponse;
      cache.set(cacheKey, { value, expiresAt: Date.now() + ttlMs() });
      return value;
    } catch (err) {
      console.error('Open-Meteo network error:', err);
      return null;
    }
  })();

  inflight.set(cacheKey, run);

  try {
    return await run;
  } finally {
    inflight.delete(cacheKey);
  }
}
