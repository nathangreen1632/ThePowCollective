import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

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

export default function UsaMap(): React.ReactElement {
  const navigate = useNavigate();

  function handleStateClick(slug: string) {
    navigate(`/states/${slug}`);
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
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

                return (
                  <Geography
                    key={geo.rsmKey}
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
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
