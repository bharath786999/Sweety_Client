'use client';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { prettyDate } from '../lib/api';

export default function TrendChart({ trend }) {
  if (!trend) return <p className="muted">Loading…</p>;
  if (trend.points.length === 0) return <p className="empty">No readings in the last 30 days yet. 🌱</p>;

  const data = trend.points.map((p) => ({ ...p, range: [p.min, p.max] }));
  const { low, high } = trend.target;
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b844" />
          <ReferenceArea y1={low} y2={high} fill="#22c55e" fillOpacity={0.12} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => prettyDate(d, { day: 'numeric', month: 'short' })} />
          <YAxis domain={[40, 'dataMax + 20']} tick={{ fontSize: 11 }} />
          <Tooltip
            labelFormatter={(d) => prettyDate(d)}
            formatter={(v, name) => (name === 'range' ? [`${v[0]}–${v[1]}`, 'Min–max'] : [v, 'Average'])}
          />
          <Area dataKey="range" stroke="none" fill="#14b8a6" fillOpacity={0.2} isAnimationActive={false} />
          <Line dataKey="avg" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="muted small">Line = daily average · shaded band = daily min–max · green zone = {low}–{high} mg/dl</p>
    </div>
  );
}
