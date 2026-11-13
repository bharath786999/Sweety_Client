import { SLOTS, classify } from '../lib/api';

// Four tiles showing which of today's readings are logged.
export default function SlotProgress({ readings }) {
  const bySlot = Object.fromEntries(readings.map((r) => [r.slot, r]));
  const done = readings.length;
  return (
    <section className="card">
      <div className="row between">
        <h2>Daily progress</h2>
        <span className="muted">{done}/4 logged</span>
      </div>
      <div className="bar"><div style={{ width: `${(done / 4) * 100}%` }} /></div>
      <div className="tiles">
        {SLOTS.map((s) => {
          const r = bySlot[s.value];
          return (
            <div key={s.value} className={`tile ${r ? classify(r.value) : 'empty-tile'}`}>
              <span className="icon">{s.icon}</span>
              <small>{s.label}</small>
              <b>{r ? r.value : '–'}</b>
            </div>
          );
        })}
      </div>
      {done === 4 && <p className="muted center-text">All four readings logged. Nicely done! 🎉</p>}
    </section>
  );
}
