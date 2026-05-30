import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: 24 }}>
      <div style={{
        background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20,
        width: '100%', maxWidth: 420, padding: '40px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 16px'
          }}>&#11042;</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: 'var(--tx2)' }}>Sign in to your LaunchNexus account</p>
        </div>
        {error && (
          <div style={{
            background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)',
            borderRadius: 10, padding: '10px 14px', color: '#FB7185', fontSize: 13, marginBottom: 16
          }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            Sign In
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--tx2)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-light)' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
