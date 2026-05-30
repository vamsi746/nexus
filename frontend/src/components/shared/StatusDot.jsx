export default function StatusDot({ status }) {
  const map = { 'Open': '#4ADE80', 'Closing Soon': '#FCD34D', 'Upcoming': 'var(--salmon)', 'Closed': '#FB7185' };
  const color = map[status] || '#aaa';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: color,
        boxShadow: status === 'Open' ? `0 0 6px ${color}` : 'none'
      }} />
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{status}</span>
    </span>
  );
}
