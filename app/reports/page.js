'use client';
import { useEffect, useState } from 'react';
import RequireAuth from '../../components/RequireAuth';
import ReportCard from '../../components/ReportCard';
import TrendChart from '../../components/TrendChart';
import api, { errMsg, todayIST } from '../../lib/api';

const TYPES = [
  { type: 'daily', title: 'Daily report' },
  { type: 'mtd', title: 'Month-to-date' },
  { type: 'monthly', title: 'Previous month' },
];

function Content() {
  const [date, setDate] = useState(todayIST());
  const [reports, setReports] = useState({});
  const [trend, setTrend] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setReports({});
    setTrend(null);
    setError('');
    Promise.all([
      ...TYPES.map((t) => api.get('/reports', { params: { type: t.type, date } })),
      api.get('/reports/trend', { params: { date, days: 30 } }),
    ])
      .then((res) => {
        if (cancelled) return;
        setReports(Object.fromEntries(TYPES.map((t, i) => [t.type, res[i].data])));
        setTrend(res[TYPES.length].data);
      })
      .catch((err) => !cancelled && setError(errMsg(err)));
    return () => { cancelled = true; };
  }, [date]);

  return (
    <>
      <div className="hero">
        <div>
          <h1>Reports</h1>
          <p className="muted">Pick a date to see how that day and month looked.</p>
        </div>
        <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label="Selected date" />
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <section className="card">
        <h2>30-day trend</h2>
        <TrendChart trend={trend} />
      </section>
      {TYPES.map((t) => <ReportCard key={t.type} title={t.title} report={reports[t.type]} />)}
      <p className="muted small center-text">
        The 70–180 mg/dl range is a general guide. Targets differ per person, so follow your doctor’s advice. Sweety is not a medical device.
      </p>
    </>
  );
}

export default function Reports() {
  return <RequireAuth><Content /></RequireAuth>;
}