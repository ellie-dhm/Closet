type Props = { label: string; value: string | number };

export default function StatCard({ label, value }: Props) {
  return (
    <div className="card stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
