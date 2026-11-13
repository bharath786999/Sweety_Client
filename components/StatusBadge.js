import { classify, STATUS_TEXT } from '../lib/api';

export default function StatusBadge({ value }) {
  const s = classify(value);
  return <span className={`badge ${s}`}>{STATUS_TEXT[s]}</span>;
}