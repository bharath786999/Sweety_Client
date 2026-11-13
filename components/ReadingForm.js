'use client';
import { useEffect, useState } from 'react';
import api, { errMsg, SLOTS, slotLabel, todayIST } from '../lib/api';

// Add a reading, or edit one when `editing` is set.
// `takenSlots` are slots already logged for the date; the first free one is pre-selected.
export default function ReadingForm({ date, editing, takenSlots = [], onSaved, onCancel }) {
  const firstFree = SLOTS.find((s) => !takenSlots.includes(s.value))?.value || 'morning';
  const [form, setForm] = useState({ date, slot: firstFree, value: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const takenKey = takenSlots.join(',');
  useEffect(() => {
    setError('');
    setForm(editing
      ? { date: editing.date, slot: editing.slot, value: String(editing.value) }
      : { date, slot: firstFree, value: '' });
  }, [editing, date, takenKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Quick client-side checks; the server enforces every rule again.
  function check() {
    if (form.value.trim() === '') return 'Please enter a glucose value.';
    const n = Number(form.value);
    if (!Number.isInteger(n) || n < 40 || n > 600) return 'Value must be between 40 and 600 mg/dl.';
    if (form.date > todayIST()) return 'Date cannot be in the future.';
    return '';
  }

  async function submit(e) {
    e.preventDefault();
    const problem = check();
    if (problem) return setError(problem);
    setError('');
    setBusy(true);
    try {
      const body = { date: form.date, slot: form.slot, value: Number(form.value) };
      if (editing) await api.put(`/readings/${editing.id}`, body);
      else await api.post('/readings', body);
      setForm((f) => ({ ...f, value: '' }));
      onSaved(form.date);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={submit} noValidate>
      <h2>{editing ? `Edit ${slotLabel(editing.slot)} reading` : 'Add a reading'}</h2>
      <div className="row">
        <label>Date
          <input type="date" value={form.date} max={todayIST()}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
        <label>Time slot
          <select value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
            {SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.icon} {s.label}{!editing && takenSlots.includes(s.value) ? ' ✓ logged' : ''}
              </option>
            ))}
          </select>
        </label>
        <label>Value (mg/dl)
          <input inputMode="numeric" value={form.value} placeholder="e.g. 110"
            onChange={(e) => setForm({ ...form, value: e.target.value })} />
        </label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="row">
        <button disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add reading'}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}