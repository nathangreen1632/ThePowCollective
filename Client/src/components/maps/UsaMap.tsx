import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const STATE_SLUGS: Record<string, string> = {
  Alaska: 'ak',
  California: 'ca',
  Colorado: 'co',
  Connecticut: 'ct',
  Delaware: 'de',
  Idaho: 'id',
  Maine: 'me',
  Maryland: 'md',
  Massachusetts: 'ma',
  Michigan: 'mi',
  Minnesota: 'mn',
  Montana: 'mt',
  Nevada: 'nv',
  'New Hampshire': 'nh',
  'New Mexico': 'nm',
  'New York': 'ny',
  'North Carolina': 'nc',
  'North Dakota': 'nd',
  Ohio: 'oh',
  Oregon: 'or',
  Pennsylvania: 'pa',
  Utah: 'ut',
  Vermont: 'vt',
  Virginia: 'va',
  Washington: 'wa',
  Wisconsin: 'wi',
  Wyoming: 'wy',
};

const STATE_RESORT_COUNTS: Record<string, number> = {
  ak: 5,
  ca: 30,
  co: 28,
  ct: 3,
  de: 1,
  id: 18,
  me: 10,
  md: 2,
  ma: 7,
  mi: 15,
  mn: 12,
  mt: 16,
  nv: 8,
  nh: 9,
  nm: 7,
  ny: 25,
  nc: 6,
  nd: 3,
  oh: 4,
  or: 11,
  pa: 14,
  ut: 20,
  vt: 12,
  va: 3,
  wa: 13,
  wi: 9,
  wy: 10,
};

export default function UsaMap(): React.ReactElement {
  const navigate = useNavigate();

  function handleStateClick(slug: string) {
    navigate(`/states/${slug}`);
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl">
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const props = geo.properties as { name?: string };
                const name = props.name ?? '';
                const slug = STATE_SLUGS[name];
                const isActive = Boolean(slug);
                const count = slug ? STATE_RESORT_COUNTS[slug] ?? 0 : 0;
                const centroid = geoCentroid(geo);
                const [lon, lat] = centroid;

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onClick={isActive ? () => handleStateClick(slug) : undefined}
                      style={{
                        default: {
                          fill: isActive
                            ? 'var(--pow-accent-soft)'
                            : 'var(--pow-surface-alt)',
                          outline: 'none',
                          stroke: 'var(--pow-border)',
                          strokeWidth: 0.75,
                        },
                        hover: {
                          fill: isActive
                            ? 'var(--pow-accent)'
                            : 'var(--pow-surface)',
                          outline: 'none',
                        },
                        pressed: {
                          fill: 'var(--pow-accent-strong)',
                          outline: 'none',
                        },
                      }}
                      className={isActive ? 'cursor-pointer' : 'cursor-default'}
                    />

                    {isActive &&
                      Number.isFinite(lon) &&
                      Number.isFinite(lat) && (
                        <Marker coordinates={[lon, lat] as [number, number]}>
                          <text
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            style={{
                              pointerEvents: 'none',
                              fontSize: 9,
                              fontWeight: 600,
                              fill: 'var(--pow-text)',
                            }}
                          >
                            {`${name} (${count})`}
                          </text>
                        </Marker>
                      )}
                  </g>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
