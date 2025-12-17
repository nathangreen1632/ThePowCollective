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

export async function fetchOpenMeteoConditions(
  args: FetchArgs
): Promise<OpenMeteoResponse | null> {
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

    return (await res.json()) as OpenMeteoResponse;
  } catch (err) {
    console.error('Open-Meteo network error:', err);
    return null;
  }
}
