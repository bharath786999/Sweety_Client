'use client';
import { useEffect, useState } from 'react';
import RequireAuth from '../../components/RequireAuth';
import ReportCard from '../../components/ReportCard';
import api, { errMsg, todayIST } from '../../lib/api';

const TYPES = [
  { type: 'daily', title: 'Daily report' },
  { type: 'mtd', title: 'Month-to-date' },
  { type: 'monthly', title: 'Previous month' },
];

export default function Reports() {
  const [date, setDate] = useState(todayIST());
  const [reports, setReports] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setReports({});
    setError('');
    Promise.all(TYPES.map((t) => api.get('/reports', { params: { type: t.type, date } })))
      .then((res) => {
        if (cancelled) return;
        setReports(Object.fromEntries(res.map((r, i) => [TYPES[i].type, r.data])));
      })
      .catch((err) => !cancelled && setError(errMsg(err)));
    return () => { cancelled = true; };
  }, [date]);

  return (
    <RequireAuth>
      <div className="row between">
        <h1>Reports</h1>
        <label className="inline">Selected date
          <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {TYPES.map((t) => <ReportCard key={t.type} title={t.title} report={reports[t.type]} />)}
    </RequireAuth>
  );
}
