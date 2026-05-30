import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Enterprise'];

const Field = ({ label, placeholder, type: t = 'text', value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
    {options ? (
      <select value={value} onChange={onChange}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={t} placeholder={placeholder} value={value} onChange={onChange} />
    )}
  </div>
);

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') || 'startup';
  const [type, setType] = useState(defaultType);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isCompanyReg, setIsCompanyReg] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const totalSteps = type === 'startup' ? 5 : 3;
  const stepLabels = type === 'startup'
    ? ['Account', 'Company', 'Details', 'Products', 'Review']
    : ['Account', 'University', 'Profile'];

  const [form, setForm] = useState({
    email: '', password: '', name: '', role: 'Founder / CEO',
    startupName: '', tagline: '', description: '', foundedYear: '', teamSize: '', stage: 'Pre-Seed', totalRaised: '', category: '', country: '',
    productName: '', productDesc: '', productUrl: '', websiteUrl: '', pitchDeckUrl: '', linkedin: '', twitter: '',
    university: '', degree: '', major: '', graduationYear: '', bio: '', skills: '', githubUrl: '', linkedinUrl: '', portfolioUrl: '', isOpenToWork: false,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    try {
      const role = type === 'startup' ? 'startup_admin' : 'student';
      const res = await api.post('/auth/register', {
        email: form.email, password: form.password, role,
        name: form.name || form.startupName,
        university: form.university, degree: form.degree, major: form.major,
        graduationYear: Number(form.graduationYear), country: form.country,
        bio: form.bio, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        githubUrl: form.githubUrl, linkedinUrl: form.linkedinUrl, portfolioUrl: form.portfolioUrl,
        isOpenToWork: form.isOpenToWork,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const renderStartupStep = () => {
    if (step === 1) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Create Your Account</h3>
        <Field label="Full Name" placeholder="John Smith" value={form.name} onChange={e => update('name', e.target.value)} />
        <Field label="Work Email" placeholder="john@startup.com" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        <Field label="Password" placeholder="Min. 8 characters" type="password" value={form.password} onChange={e => update('password', e.target.value)} />
        <Field label="Your Role" options={['Founder / CEO', 'Co-Founder', 'CTO', 'CMO', 'Business Development', 'Team Member']} value={form.role} onChange={e => update('role', e.target.value)} />
      </div>
    );
    if (step === 2) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Company Registration Status</h3>
        <p style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 20 }}>Tell us about your company's legal status so we can verify your listing.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['yes', '&#9989; Yes — Company is legally registered'],
            ['no', '&#9203; Not yet — We plan to register within 12 months'],
          ].map(([v, l]) => (
            <div key={v} onClick={() => setIsCompanyReg(v)}
              style={{
                padding: '14px 16px', border: `1px solid ${isCompanyReg === v ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 10, cursor: 'pointer',
                background: isCompanyReg === v ? 'var(--accent-dim)' : 'var(--bg2)',
                fontSize: 14, color: isCompanyReg === v ? 'var(--accent-light)' : 'var(--tx1)', transition: 'all 0.15s'
              }} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </div>
        {isCompanyReg === 'yes' && (
          <div style={{ padding: 16, background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <Field label="Country of Incorporation" options={['United States', 'United Kingdom', 'India', 'Singapore', 'UAE', 'Germany', 'Canada', 'Australia', 'Other']} value={form.country} onChange={e => update('country', e.target.value)} />
            <Field label="Company Registration Number" placeholder="e.g. 12345678" value={form.regNumber} onChange={e => update('regNumber', e.target.value)} />
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Upload Incorporation Certificate</label>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '24px 16px', textAlign: 'center', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', background: 'var(--bg3)', transition: 'border-color 0.15s' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>&#128206;</div>
                Drop PDF / JPG here or <span style={{ color: 'var(--accent-light)' }}>browse</span>
                <div style={{ marginTop: 4, fontSize: 10 }}>Max 10MB &middot; PDF, JPG, PNG</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
    if (step === 3) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Startup Details</h3>
        <Field label="Startup Name" placeholder="Your startup's name" value={form.startupName} onChange={e => update('startupName', e.target.value)} />
        <Field label="Tagline (max 120 chars)" placeholder="One sentence that explains what you do" value={form.tagline} onChange={e => update('tagline', e.target.value)} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Description</label>
          <textarea placeholder="Tell us about your startup..." style={{ height: 90, resize: 'vertical' }} value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Founded Year" placeholder="2023" value={form.foundedYear} onChange={e => update('foundedYear', e.target.value)} />
          <Field label="Team Size" placeholder="12" value={form.teamSize} onChange={e => update('teamSize', e.target.value)} />
          <Field label="Stage" options={STAGES} value={form.stage} onChange={e => update('stage', e.target.value)} />
          <Field label="Total Raised" placeholder="$500K" value={form.totalRaised} onChange={e => update('totalRaised', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Category" placeholder="AI & ML" value={form.category} onChange={e => update('category', e.target.value)} />
          <Field label="Country" placeholder="USA" value={form.country} onChange={e => update('country', e.target.value)} />
        </div>
      </div>
    );
    if (step === 4) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Products & Links</h3>
        <Field label="Product Name" placeholder="Your main product's name" value={form.productName} onChange={e => update('productName', e.target.value)} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Product Description</label>
          <textarea placeholder="Describe what your product does..." style={{ height: 70, resize: 'vertical' }} value={form.productDesc} onChange={e => update('productDesc', e.target.value)} />
        </div>
        <Field label="Product URL" placeholder="https://app.yourstartup.com" type="url" value={form.productUrl} onChange={e => update('productUrl', e.target.value)} />
        <Field label="Company Website" placeholder="https://yourstartup.com" type="url" value={form.websiteUrl} onChange={e => update('websiteUrl', e.target.value)} />
        <Field label="Pitch Deck URL" placeholder="https://drive.google.com/..." type="url" value={form.pitchDeckUrl} onChange={e => update('pitchDeckUrl', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="LinkedIn" placeholder="linkedin.com/company/..." value={form.linkedin} onChange={e => update('linkedin', e.target.value)} />
          <Field label="Twitter / X" placeholder="@yourstartup" value={form.twitter} onChange={e => update('twitter', e.target.value)} />
        </div>
      </div>
    );
    if (step === 5) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Review & Submit</h3>
        <p style={{ fontSize: 13, color: 'var(--tx1)', marginBottom: 20, lineHeight: 1.6 }}>
          Your startup listing will go live after our team reviews and verifies your submission (typically within 24–48 hours).
        </p>
        <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: 20, border: '1px solid var(--border)', marginBottom: 20 }}>
          {[
            ['Status', 'Under Review after submission'],
            ['Verification', '24–48 hours'],
            ['Notification', 'Email at every stage'],
            ['Listing', 'Public on approval'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--tx2)' }}>{k}</span>
              <span style={{ color: 'var(--tx0)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, background: 'rgba(52,211,153,0.06)', borderRadius: 10, border: '1px solid rgba(52,211,153,0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>&#9989;</span>
          <div style={{ fontSize: 12, color: '#34D399', lineHeight: 1.6 }}>
            By submitting, you agree to LaunchNexus Terms of Service and confirm all information provided is accurate.
          </div>
        </div>
      </div>
    );
  };

  const renderStudentStep = () => {
    if (step === 1) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Create Student Account</h3>
        <Field label="Full Name" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} />
        <Field label="University Email" placeholder="name@university.edu" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        <Field label="Password" placeholder="Min. 8 characters" type="password" value={form.password} onChange={e => update('password', e.target.value)} />
        <Field label="Country" placeholder="India" value={form.country} onChange={e => update('country', e.target.value)} />
      </div>
    );
    if (step === 2) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>University Details</h3>
        <Field label="University / College Name" placeholder="Search your university..." value={form.university} onChange={e => update('university', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Degree" options={["Bachelor's", "Master's", 'PhD', 'Diploma', 'Associate']} value={form.degree} onChange={e => update('degree', e.target.value)} />
          <Field label="Graduation Year" placeholder="2026" value={form.graduationYear} onChange={e => update('graduationYear', e.target.value)} />
        </div>
        <Field label="Major / Field of Study" placeholder="Computer Science" value={form.major} onChange={e => update('major', e.target.value)} />
      </div>
    );
    if (step === 3) return (
      <div>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Your Profile</h3>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', marginBottom: 6, fontWeight: 500 }}>Bio</label>
          <textarea placeholder="Tell startups about yourself..." style={{ height: 80, resize: 'vertical' }} value={form.bio} onChange={e => update('bio', e.target.value)} />
        </div>
        <Field label="Skills (comma separated)" placeholder="Python, React, Machine Learning..." value={form.skills} onChange={e => update('skills', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="GitHub URL" placeholder="github.com/username" value={form.githubUrl} onChange={e => update('githubUrl', e.target.value)} />
          <Field label="LinkedIn URL" placeholder="linkedin.com/in/username" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)} />
        </div>
        <Field label="Portfolio / Website" placeholder="yourportfolio.com" value={form.portfolioUrl} onChange={e => update('portfolioUrl', e.target.value)} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <input type="checkbox" id="openwork" style={{ width: 'auto', accentColor: 'var(--accent)' }} checked={form.isOpenToWork} onChange={e => update('isOpenToWork', e.target.checked)} />
          <label htmlFor="openwork" style={{ fontSize: 13, color: 'var(--tx1)', cursor: 'pointer' }}>
            I'm open to internship and job opportunities
          </label>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: 24 }}>
      <div style={{
        background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20,
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto'
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 18, fontWeight: 700 }}>
              {type === 'startup' ? '🚀 List Your Startup' : '🎓 Join as Student'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 2 }}>
              Step {step} of {totalSteps} — {stepLabels[step - 1]}
            </div>
          </div>
          <Link to="/" style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', color: 'var(--tx1)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
          }}>&#215;</Link>
        </div>
        <div style={{ padding: '4px 28px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 4, padding: '12px 0' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? 'var(--accent)' : 'var(--bg3)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{ flex: 1, fontSize: 9, color: i < step ? 'var(--accent-light)' : 'var(--tx2)', textAlign: 'center', fontWeight: i === step - 1 ? 600 : 400 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '24px 28px' }}>
          {error && (
            <div style={{
              background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)',
              borderRadius: 10, padding: '10px 14px', color: '#FB7185', fontSize: 13, marginBottom: 16
            }}>{error}</div>
          )}
          {type === 'startup' ? renderStartupStep() : renderStudentStep()}
        </div>
        <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}>
            {step > 1 ? '\u2190 Back' : 'Cancel'}
          </button>
          {step === 1 && (
            <button className="btn btn-ghost" onClick={() => setType(type === 'startup' ? 'student' : 'startup')}>
              Switch to {type === 'startup' ? 'Student' : 'Startup'}
            </button>
          )}
          <button className="btn btn-primary" onClick={() => {
            if (step < totalSteps) setStep(s => s + 1);
            else handleSubmit();
          }}>
            {step === totalSteps ? (type === 'startup' ? 'Submit for Review \u2713' : 'Complete Registration \u2713') : 'Continue \u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}
