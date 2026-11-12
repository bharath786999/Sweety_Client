import { prettyDate, slotLabel } from '../lib/api';

export default function ReportCard({ title, report }) {
  if (!report) return <section className="card"><h2>{title}</h2><p className="muted">Loading…</p></section>;
  const range = report.from === report.to
    ? prettyDate(report.from)
    : `${prettyDate(report.from)} – ${prettyDate(report.to)}`;

  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="muted">{range}</p>
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
          <p className="muted small">Values in mg/dl</p>
        </>
      )}
      {report.readings && report.readings.length > 0 && (
        <ul className="list">
          {report.readings.map((r) => (
            <li key={r.id}><span>{slotLabel(r.slot)}</span><b>{r.value} mg/dl</b></li>
          ))}
        </ul>
      )}
    </section>
  );
}
