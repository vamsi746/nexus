export default function Badge({ children, color = 'var(--accent)', bg }) {
  return (
    <span className="chip" style={{
      background: bg || `${color}18`,
      color, border: `1px solid ${color}30`
    }}>{children}</span>
  );
}
