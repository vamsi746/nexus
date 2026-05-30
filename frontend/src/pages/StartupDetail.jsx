import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Avatar from '../components/shared/Avatar.jsx';
import Badge from '../components/shared/Badge.jsx';
import StageTag from '../components/shared/StageTag.jsx';
import Card from '../components/shared/Card.jsx';

export default function StartupDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);

  useEffect(() => {
    fetchStartupData();
  }, [slug]);

  const fetchStartupData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/startups/${slug}`);
      setStartup(res.data);

      // Fetch comments
      const commentsRes = await api.get(`/startups/${res.data._id}/comments`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!token) {
      alert('Please log in to upvote startups!');
      navigate('/login');
      return;
    }
    if (hasUpvoted) {
      alert('You have already upvoted this startup in this session.');
      return;
    }
    try {
      const res = await api.post(`/startups/${startup._id}/upvote`);
      setStartup(prev => ({ ...prev, upvoteCount: res.data.upvoteCount }));
      setHasUpvoted(true);
    } catch (err) {
      alert('Upvote failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to leave feedback or validate ideas!');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/startups/${startup._id}/comments`, { content: newComment });
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to message founders.');
      navigate('/login');
      return;
    }
    if (!messageText.trim()) return;

    setMessageSuccess(true);
    setTimeout(() => {
      setMessageSuccess(false);
      setShowMessageModal(false);
      setMessageText('');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div style={{ fontSize: 32, animation: 'spin 1s infinite linear', display: 'inline-block', marginBottom: 16 }}>⚡</div>
        <h3 style={{ color: 'var(--tx1)' }}>Loading startup detail profile...</h3>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ color: 'var(--tx2)', marginBottom: 20 }}>Startup profile not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/startups')}>Back to Startups</button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
      
      {/* LEFT COLUMN: BRAND OVERVIEW & DISCUSSION PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Startup Masthead */}
        <div style={{
          background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20,
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,110,250,0.12) 0%, rgba(34,211,238,0.08) 100%)',
            padding: '36px 32px 28px', borderBottom: '1px solid var(--border)', borderRadius: '20px 20px 0 0'
          }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Avatar initials={startup.initials || startup.name?.slice(0, 2).toUpperCase()} color={startup.color || '#7C6EFA'} size={72} radius={16} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <h1 style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--tx0)' }}>
                    {startup.name}
                  </h1>
                  {startup.verified && <span className="chip" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', fontSize: 10 }}>✓ Verified Profile</span>}
                  {(startup.isTrending || startup.trending) && (
                    <span className="chip" style={{ background: 'rgba(252,211,77,0.1)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.25)', fontSize: 10 }}>
                      🔥 Trending
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
                  {startup.flag} {startup.location} &middot; Founded {startup.foundedYear || startup.founded} &middot; {startup.category}
                </div>
                <div style={{ marginTop: 10 }}><StageTag stage={startup.stage} /></div>
              </div>
            </div>
          </div>
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 12, color: 'var(--tx0)' }}>
                {startup.tagline}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--tx1)', lineHeight: 1.7 }}>
                {startup.description || 'NeuralPath builds the orchestration layer for enterprise AI — enabling autonomous, multi-step workflow execution across any business system without custom code. Backed by Y Combinator.'}
              </p>
            </div>
            
            {/* TAGS ROW */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--tx2)', marginBottom: 8, fontWeight: 600 }}>TECHNOLOGY STACK TAGS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(startup.tags || ['SaaS', 'AI Agents', 'Automation']).map(t => <Badge key={t}>{t}</Badge>)}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleUpvote}>
                ▲ Upvote ({hasUpvoted ? startup.upvoteCount : (startup.upvoteCount || 0).toLocaleString()})
              </button>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowMessageModal(true)}>
                💬 Message Founder
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.open(startup.websiteUrl || '#', '_blank')}>
                🔗 Visit Website &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* DISCUSSION & PUBLIC FEEDBACK PANEL (Product Hunt & Nugget validation style) */}
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
          <h2 className="section-title" style={{ fontSize: 20, marginBottom: 6 }}>Founder Discussion & Idea Validation</h2>
          <p style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 24 }}>Ask makers questions, give early-adopter feedback, and validate startup ideas.</p>
          
          {/* Post Comment form */}
          <form onSubmit={handleAddComment} style={{ marginBottom: 28 }}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <textarea
                placeholder={token ? "Type your feedback, question, or early validation ideas..." : "Sign in to post public discussion feedback..."}
                style={{ height: 90, resize: 'vertical' }}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={!token}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!token}>
              Post Validation Feedback
            </button>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)', fontSize: 13 }}>
                💬 Zero questions or comments yet. Be the first to join the conversation!
              </div>
            ) : (
              comments.map(c => (
                <div key={c._id} style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)', display: 'flex', gap: 14 }}>
                  <Avatar initials={c.userEmail?.slice(0, 2).toUpperCase() || 'ST'} color="#7C6EFA" size={32} />
                  <div style={{ flex: 1 }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx0)' }}>
                        {c.userEmail}
                        <span className="chip" style={{
                          background: c.userRole === 'Founder' ? 'rgba(52,211,153,0.1)' : c.userRole === 'Admin' ? 'rgba(251,113,133,0.1)' : 'rgba(124,110,250,0.1)',
                          color: c.userRole === 'Founder' ? '#34D399' : c.userRole === 'Admin' ? '#FB7185' : 'var(--accent-light)',
                          fontSize: 9, marginLeft: 8
                        }}>{c.userRole}</span>
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--tx1)', lineHeight: 1.6 }}>{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: ANALYTICS & EARLY ADOPTER REWARDS PANEL (GetWorm Style) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Startup Statistics metrics (StartupTracker style) */}
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Startup Performance Data</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              ['FUNDING STAGE', startup.stage || 'Seed', 'var(--accent-light)'],
              ['TEAM SIZE', `${startup.teamSize || startup.team || 12} people`, 'var(--tx0)'],
              ['RAISED BUDGET', startup.raised || '$2.4M', '#34D399'],
              ['UPVOTE COUNT', hasUpvoted ? startup.upvoteCount : (startup.upvoteCount || 0), '#FCD34D'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: 'var(--bg2)', borderRadius: 10, padding: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, color: 'var(--tx2)', marginBottom: 4 }}>{l}</div>
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 11, color: 'var(--tx2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>TOTAL PAGEVIEWS: <b>{(startup.viewCount || 12400).toLocaleString()}</b></span>
            <span>VERIFIED: <b>{startup.verified ? 'YES' : 'NO'}</b></span>
          </div>
        </Card>

        {/* Early Adopter Rewards Panel (GetWorm Style) */}
        <Card style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(124,110,250,0.06) 100%)',
          border: '1px solid var(--border-accent)', padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎁</div>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 700, color: '#22D3EE' }}>GetWorm Early Adopter Reward</h3>
          <p style={{ fontSize: 12, color: 'var(--tx1)', margin: '8px 0 16px', lineHeight: 1.5 }}>
            Are you an early tester? Startup offers <b>30% discount</b> or <b>exclusive beta access</b> for the first 100 Nexus adopters.
          </p>
          
          {!showReward ? (
            <button className="btn btn-success btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowReward(true)}>
              Claim Early Adopter Reward &rarr;
            </button>
          ) : (
            <div style={{
              background: 'var(--bg2)', border: '2px dashed var(--border-accent)',
              borderRadius: 10, padding: '12px 10px', marginTop: 12, animation: 'pulse 1.5s infinite ease-in-out'
            }}>
              <span style={{ fontSize: 10, color: 'var(--tx2)', display: 'block', marginBottom: 2 }}>PROMO COUPON CODE:</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 18, fontWeight: 800, color: '#34D399', letterSpacing: '0.08em' }}>
                NEXUS-EARLY-30
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* FOUNDER MESSAGE MODAL (Simulated micro-messaging dialogue) */}
      {showMessageModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 24
        }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-accent)', borderRadius: 16, padding: 28, maxWidth: 500, width: '100%' }}>
            <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Message Founder of {startup.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 16 }}>Ask questions, pitch collaborations, or discuss investments directly.</p>
            
            {messageSuccess ? (
              <div className="notice notice-success" style={{ padding: '20px 10px', textAlign: 'center', display: 'block' }}>
                🎉 Message dispatched successfully! The founder will receive your contact details instantly.
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Message Content</label>
                  <textarea
                    placeholder="Hello! I loved NeuralPath's automation pitch on LaunchNexus. I'd love to chat about..."
                    style={{ height: 120, resize: 'vertical' }}
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary">Dispatch Message</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowMessageModal(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
