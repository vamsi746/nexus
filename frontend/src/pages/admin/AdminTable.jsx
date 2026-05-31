export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', flex: '2 1 260px', minWidth: 0 }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', paddingLeft: 40 }}
      />
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx2)', fontSize: 14 }}>🔍</span>
    </div>
  );
}

export default function AdminTable({ headers, rows, emptyMsg }) {
  if (!rows.length) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--tx2)' }}>{emptyMsg}</div>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {headers.map(h => (
              <th key={h.key} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--tx2)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {headers.map(h => (
                <td key={h.key} style={{ padding: '10px 12px', color: 'var(--tx1)', verticalAlign: 'middle', whiteSpace: h.wrap ? 'normal' : 'nowrap' }}>{row[h.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
