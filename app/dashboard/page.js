'use client';
import { useCallback, useEffect, useState } from 'react';
import RequireAuth from '../../components/RequireAuth';
import ReadingForm from '../../components/ReadingForm';
import api, { errMsg, slotLabel, todayIST, prettyDate } from '../../lib/api';

export default function Dashboard() {
  const [date, setDate] = useState(todayIST());
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

  return (
    <RequireAuth>
      <ReadingForm
        date={date}
        editing={editing}
        onCancel={() => setEditing(null)}
        onSaved={(savedDate) => { setEditing(null); setDate(savedDate); load(savedDate); }}
      />

      <section className="card">
        <div className="row between">
          <h2>Readings for {prettyDate(date)}</h2>
          <input type="date" value={date} max={todayIST()} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {loading ? <p className="muted">Loading…</p> : readings.length === 0 ? (
          <p className="empty">No readings for this date yet. Add your first one above. 🌱</p>
        ) : (
          <ul className="list">
            {readings.map((r) => (
              <li key={r.id}>
                <span>{slotLabel(r.slot)}</span>
                <b>{r.value} mg/dl</b>
                <span className="actions">
                  <button className="link" onClick={() => setEditing(r)}>Edit</button>
                  <button className="link danger" onClick={() => remove(r)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </RequireAuth>
  );
}
