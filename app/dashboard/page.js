'use client';
import { useCallback, useEffect, useState } from 'react';
import RequireAuth from '../../components/RequireAuth';
import ReadingForm from '../../components/ReadingForm';
import SlotProgress from '../../components/SlotProgress';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api, { addDays, errMsg, greeting, prettyDate, slotLabel, SLOTS, todayIST } from '../../lib/api';

function Content() {
  const { user } = useAuth();
  const today = todayIST();
  const [date, setDate] = useState(today);
  const [readings, setReadings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (d) => {
    setLoading(true);
    try {
      const { data } = await api.get('/readings', { params: { date: d } });
      setReadings(data.data);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(date); }, [date, load]);

  async function remove(r) {
    if (!window.confirm(`Delete the ${slotLabel(r.slot)} reading?`)) return;
    try {
      await api.delete(`/readings/${r.id}`);
      if (editing?.id === r.id) setEditing(null);
      load(date);
    } catch (err) {
      setError(errMsg(err));
    }
  }

  async function exportCsv() {
    try {
      const { data } = await api.get('/readings/export.csv', { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sweety-readings.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errMsg(err));
    }
  }

  const sorted = [...readings].sort(
    (a, b) => SLOTS.findIndex((s) => s.value === a.slot) - SLOTS.findIndex((s) => s.value === b.slot)
  );

  return (
    <>
      <div className="hero">
        <div>
          <h1>{greeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p className="muted">Log up to four readings a day and keep an eye on your trends.</p>
        </div>
        <div className="datenav">
          <button className="ghost" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}>‹</button>
          <input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} />
          <button className="ghost" aria-label="Next day" disabled={date >= today} onClick={() => setDate(addDays(date, 1))}>›</button>
        </div>
      </div>

      <SlotProgress readings={readings} />

      <ReadingForm
        date={date}
        editing={editing}
        takenSlots={readings.map((r) => r.slot)}
        onCancel={() => setEditing(null)}
        onSaved={(savedDate) => { setEditing(null); setDate(savedDate); load(savedDate); }}
      />

      <section className="card">
        <div className="row between">
          <h2>Readings for {prettyDate(date)}</h2>
          <button className="secondary" onClick={exportCsv}>⬇ Export CSV</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {loading ? <p className="muted">Loading…</p> : sorted.length === 0 ? (
          <p className="empty">No readings for this date yet. Add your first one above. 🌱</p>
        ) : (
          <ul className="list">
            {sorted.map((r) => (
              <li key={r.id}>
                <span>{slotLabel(r.slot)}</span>
                <b>{r.value} mg/dl</b>
                <StatusBadge value={r.value} />
                <span className="actions">
                  <button className="link" onClick={() => setEditing(r)}>Edit</button>
                  <button className="link danger" onClick={() => remove(r)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function Dashboard() {
  return <RequireAuth><Content /></RequireAuth>;
}