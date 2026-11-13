import { prettyDate, slotLabel } from '../lib/api';
import StatusBadge from './StatusBadge';

export default function ReportCard({ title, report }) {
  if (!report) return <section className="card"><h2>{title}</h2><p className="muted">Loading…</p></section>;
  const range = report.from === report.to
    ? prettyDate(report.from)
    : `${prettyDate(report.from)} – ${prettyDate(report.to)}`;
  const share = (n) => `${(n / report.count) * 100}%`;

  return (
    <section className="card">
      <div className="row between">
        <h2>{title}</h2>
        <span className="muted">{range}</span>
      </div>
      {report.count === 0 ? (
        <p className="empty">No readings for this period yet. 🌱</p>
      ) : (
        <>
          <div className="stats">
            <div><span>Highest</span><b>{report.highest}</b></div>
            <div><span>Lowest</span><b>{report.lowest}</b></div>
            <div><span>Average</span><b>{report.average.toFixed(1)}</b></div>
            <div><span>Readings</span><b>{report.count}</b></div>
          </div>
          <div className="tir">
            <div className="row between">
              <span><b>{report.inRangePct}%</b> in range ({report.target.low}–{report.target.high})</span>
              <span className="muted small">{report.lowCount} low · {report.highCount} high</span>
            </div>
            <div className="stack" role="img" aria-label={`${report.inRangePct}% of readings in range`}>
              <i className="low" style={{ width: share(report.lowCount) }} />
              <i className="in_range" style={{ width: share(report.inRangeCount) }} />
              <i className="high" style={{ width: share(report.highCount) }} />
            </div>
          </div>
        </>
      )}
      {report.readings?.length > 0 && (
        <ul className="list">
          {report.readings.map((r) => (
            <li key={r.id}>
              <span>{slotLabel(r.slot)}</span>
              <b>{r.value} mg/dl</b>
              <StatusBadge value={r.value} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}