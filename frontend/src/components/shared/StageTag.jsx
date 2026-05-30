export default function StageTag({ stage }) {
  const map = {
    'Pre-Seed': ['#FCD34D', '#2D2400'],
    'Seed': ['#4ADE80', '#002D1F'],
    'Series A': ['var(--accent)', '#1A0A0A'],
    'Series B': ['#22D3EE', '#001E2A'],
    'Growth': ['#F97316', '#2D1500'],
    'Enterprise': ['var(--accent-light)', '#1E0A0A'],
  };
  const [c, bg] = map[stage] || ['var(--gray)', '#1A1A1D'];
  return (
    <span className="chip" style={{ background: bg, color: c, border: `1px solid ${c}30` }}>{stage}</span>
  );
}
