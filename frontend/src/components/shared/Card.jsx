export default function Card({ children, variant = 'glass', style = {}, onClick, className = '' }) {
  const variantClass = variant === 'glass' ? 'glass-card' : variant === 'neo' ? 'neo-card' : 'clean-card';
  return (
    <div className={`${variantClass} ${className}`} onClick={onClick} style={{
      padding: '20px',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}>
      {children}
    </div>
  );
}
