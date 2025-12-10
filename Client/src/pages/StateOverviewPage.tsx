// Client/src/pages/StateOverviewPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

type Resort = {
  id: string;
  name: string;
  baseDepthIn: number;
  last24In: number;
  next24In: number;
};

const MOCK_CO_RESORTS: Resort[] = [
  { id: 'abasin', name: 'Arapahoe Basin', baseDepthIn: 42, last24In: 4, next24In: 6 },
  { id: 'breck', name: 'Breckenridge', baseDepthIn: 58, last24In: 8, next24In: 10 },
  { id: 'steamboat', name: 'Steamboat', baseDepthIn: 64, last24In: 3, next24In: 5 },
];

export default function StateOverviewPage(): React.ReactElement {
  const { stateCode } = useParams<{ stateCode: string }>();
  const code = (stateCode || '').toUpperCase();

  const resorts = code === 'CO' ? MOCK_CO_RESORTS : [];

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {code === 'CO' ? 'Colorado Snow Overview' : `Snow Overview: ${code}`}
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Live snapshot of base depth, last 24 hours, and expected next 24 hours for major resorts.
        </p>
      </header>

      {resorts.length === 0 ? (
        <p className="text-sm text-[var(--pow-muted)]">
          No resort data yet for this state.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface)]">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--pow-elevated)]">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Resort</th>
              <th className="px-3 py-2 text-right font-semibold">Base Depth</th>
              <th className="px-3 py-2 text-right font-semibold">Last 24h</th>
              <th className="px-3 py-2 text-right font-semibold">Next 24h</th>
            </tr>
            </thead>
            <tbody>
            {resorts.map((r) => (
              <tr key={r.id} className="border-t border-[var(--pow-border)]">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2 text-right">{r.baseDepthIn}"</td>
                <td className="px-3 py-2 text-right">{r.last24In}"</td>
                <td className="px-3 py-2 text-right">{r.next24In}"</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
