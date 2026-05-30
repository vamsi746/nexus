const sections = [
  {
    title: 'System Architecture', icon: '🏗️', content: [
      { head: 'Overview', text: 'LaunchNexus is a dual-sided marketplace built as a distributed microservices system, designed to scale from 0 to millions of users. The platform uses event-driven architecture with an API Gateway routing to independent services, each with dedicated data stores.' },
      { head: 'Core Services', items: ['Auth Service — JWT + OAuth (Google, LinkedIn, GitHub)', 'Startup Service — Profile CRUD, verification workflow, document management', 'Student Service — University linking, profile, skills', 'Hackathon Service — Event management, registration, submission scoring', 'Messaging Service — Real-time chat via Socket.io + message persistence', 'Search Service — MongoDB full-text search with instant autocomplete', 'Notification Service — Email, Push, In-app notifications', 'Media Service — File uploads, CDN integration'] },
    ]
  },
  {
    title: 'Tech Stack', icon: '⚙️', content: [
      { head: 'Frontend', items: ['React 18 + Vite — Fast build, HMR, modern ES modules', 'React Router v6 — Declarative routing with nested routes', 'CSS Custom Properties — Consistent design tokens across components', 'Context API — Lightweight auth state management'] },
      { head: 'Backend', items: ['Node.js 20 + Express — Mature, battle-tested API framework', 'Mongoose ORM — Type-safe MongoDB access with schema validation', 'JWT + bcryptjs — Secure authentication with hashed passwords', 'CORS + Helmet-ready — Security headers and origin whitelisting'] },
      { head: 'Data Layer', items: ['MongoDB Atlas (primary) — Flexible document store for startup profiles', 'MongoDB Aggregation — Complex queries, full-text search, analytics', 'File uploads via Multer — Local disk + S3-ready architecture'] },
    ]
  },
  {
    title: 'Database Schema', icon: '🗄️', content: [
      { head: 'Core Collections', items: ['users — Base account (email, role, auth_provider, verification status)', 'startup_profiles — Full startup entity with stage, metrics, category, location', 'startup_documents — Verification docs with admin review workflow', 'student_profiles — Student entity with university, skills, preferences', 'categories / subcategories — 2-level taxonomy with tags', 'hackathons — Events with prize structure, dates, registration limits', 'opportunities — Job/internship listings with application tracking', 'startup_upvotes — Upvote system (composite unique index)', 'service_orders — COE service engagement tracking', 'notifications — Per-user notification queue'] },
    ]
  },
  {
    title: 'API Design', icon: '🔌', content: [
      { head: 'RESTful Endpoints', items: ['POST /api/auth/register · POST /auth/login', 'GET/POST /api/startups · GET /startups/:slug · POST /startups/:id/upvote', 'GET/POST /api/hackathons · POST /hackathons/:id/register', 'GET/POST /api/opportunities · POST /opportunities/:id/apply', 'GET /api/categories — All categories with subcategories', 'GET /api/services — Static COE services catalog', 'Admin: PUT /api/admin/startups/:id/verify (approve/reject workflow)'] },
      { head: 'Versioning', text: 'All APIs versioned at /api/v1 in production. Current development uses /api as base path. Breaking changes will introduce /api/v2 with a deprecation window.' },
    ]
  },
  {
    title: 'UI Architecture', icon: '🖥️', content: [
      { head: 'Page Structure', items: ['Public (unauth): Landing, Discover, Startup Profile, Hackathons, Opportunities, Services', 'Auth flows: Login, Register (multi-step Startup wizard, Student wizard)', 'Startup Dashboard: Overview, Profile Editor, Products, Hackathons, Opportunities, Messages, Analytics, Service Orders', 'Student Dashboard: Feed, Saved, My Hackathons, Applications, Messages, Profile', 'Admin Panel: Verification queue, Analytics, User management, Content moderation'] },
      { head: 'State Management', items: ['Server state: Direct fetch via axios with error boundaries', 'Client state: React Context API for auth session', 'Form state: Controlled components with local state', 'Real-time state: Planned Socket.io integration for messaging'] },
    ]
  },
  {
    title: 'Startup Registration Flow', icon: '📋', content: [
      { head: '5-Step Wizard', items: ['Step 1 — Account Setup: Email, password, role (Founder / Team Member)', 'Step 2 — Company Status: Registered? (Yes → upload incorporation cert) or Not yet registered', 'Step 3 — Startup Details: Name, tagline, description, founded year, team size, stage, raise, category selection', 'Step 4 — Products & Links: Product name/desc/URL, website, pitch deck, social links', 'Step 5 — Review & Submit: Preview profile → Accept T&C → Submit for admin verification → Status: Under Review (24-48h)'] },
    ]
  },
  {
    title: 'Scalability & Infra', icon: '📈', content: [
      { head: 'Scaling Strategy', items: ['Horizontal scaling: Stateless Express services behind load balancer', 'DB scaling: MongoDB replica sets, sharding at 10M+ documents', 'Cache: In-memory LRU for hot data, Redis for sessions', 'Queue: Planned BullMQ for async jobs (email, media resize, indexing)', 'Deploy: AWS / Vercel (frontend) + GitHub Actions CI/CD'] },
      { head: 'Security', items: ['JWT 15-min access tokens + 7d refresh tokens in httpOnly cookies (production)', 'Rate limiting: Express-rate-limit middleware', 'File uploads: MIME validation, size limits', 'Secrets: dotenv in development, AWS Secrets Manager in production', 'CORS whitelist, input validation on all API routes'] },
    ]
  },
];

export default function Architecture() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="chip" style={{
          background: 'var(--accent-dim)', color: 'var(--accent-light)',
          border: '1px solid var(--border-accent)', marginBottom: 16, display: 'inline-flex'
        }}>
          &#128208; System Architecture Document v1.0
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>LaunchNexus Architecture</h1>
        <p style={{ fontSize: 15, color: 'var(--tx1)', lineHeight: 1.7 }}>
          A production-ready, horizontally scalable platform built for global startup discovery, student engagement, hackathon management, and enterprise service delivery.
        </p>
      </div>
      {sections.map(section => (
        <div key={section.title} style={{
          marginBottom: 36, background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden'
        }}>
          <div style={{
            padding: '18px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <span style={{ fontSize: 20 }}>{section.icon}</span>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{section.title}</h2>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {section.content.map(block => (
              <div key={block.head}>
                <div style={{
                  fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: 14,
                  color: 'var(--accent-light)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>{block.head}</div>
                {block.text && <p style={{ fontSize: 13, color: 'var(--tx1)', lineHeight: 1.7 }}>{block.text}</p>}
                {block.items && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {block.items.map(item => (
                      <div key={item} style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        fontSize: 13, color: 'var(--tx1)', lineHeight: 1.6
                      }}>
                        <span style={{ color: 'var(--accent)', marginTop: 2, fontSize: 10, minWidth: 14 }}>&#9656;</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
