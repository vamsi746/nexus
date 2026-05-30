export default function Avatar({ initials, color, size = 40, radius = 10 }) {
  const c = color || 'var(--accent)';
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: radius,
      background: `${c}18`, border: `1.5px solid ${c}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: c,
      fontFamily: 'Arial, sans-serif'
    }}>
      {initials}
    </div>
  );
}
