# LaunchNexus — Global Startup Acceleration Platform
## Complete System Architecture Document

---

## 1. Executive Summary

LaunchNexus is a dual-sided marketplace connecting global startups (Early, Mid, Enterprise-stage) with a worldwide student community, while providing access to Centre of Excellence (COE) services — spanning digital marketing, software development, HR, legal, and IT infrastructure.

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                     │
│  Web (Next.js)   Mobile (React Native)   Admin Panel (Next.js)      │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS / WSS
┌────────────────────────────▼────────────────────────────────────────┐
│                       API GATEWAY (Kong)                             │
│         Rate Limiting │ Auth Middleware │ Request Routing            │
└──────┬─────────┬──────┬──────┬──────┬──────┬──────┬────────────────┘
       │         │      │      │      │      │      │
   Auth     Startup  Student Hack   Msg   Media  Search
  Service   Service  Service  Svc   Svc    Svc    Svc
    │         │       │       │     │      │      │
    └────────────────────┬─────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │   Message Broker     │
              │   (RabbitMQ / SQS)  │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    Notification    Email Worker   Analytics
      Service       (Sendgrid)     (Mixpanel)
```

---

## 3. Tech Stack

### Frontend
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14 (App Router) | SSR/SSG, SEO, Edge rendering |
| Language | TypeScript | Type safety, DX |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, consistent tokens |
| State | Zustand + React Query | Lightweight, async-first |
| Forms | React Hook Form + Zod | Performance, validation |
| Real-time | Socket.io client | Chat, notifications |
| Auth | NextAuth.js v5 | OAuth, JWT sessions |

### Backend
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js 20 + Fastify | High throughput, async |
| Language | TypeScript | Shared types with frontend |
| ORM | Prisma | Type-safe DB access |
| Auth | Passport.js + JWT | Flexible auth strategies |
| Validation | Zod | Runtime type checking |
| File Upload | Multer + AWS S3 | Document/media storage |
| Real-time | Socket.io | Bidirectional messaging |
| Queue | BullMQ + Redis | Job processing |
| Search | Typesense | Fast full-text search |

### Data Layer
| Technology | Use Case |
|-----------|---------|
| PostgreSQL 15 | Primary relational data |
| Redis 7 | Sessions, caching, queues |
| Elasticsearch | Advanced search, analytics |
| AWS S3 | File/document storage |
| Cloudflare R2 | Media CDN |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Container | Docker + Kubernetes |
| CI/CD | GitHub Actions |
| CDN | Cloudflare |
| Monitoring | DataDog |
| Logging | Winston + ELK Stack |
| Deploy | AWS EKS / Vercel (frontend) |

---

## 4. File & Directory Structure

```
launxnexus/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── startups/
│   │   │   │   │   ├── page.tsx      # Directory
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Startup profile
│   │   │   │   ├── hackathons/
│   │   │   │   ├── opportunities/
│   │   │   │   └── services/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   │   ├── startup/      # Multi-step startup reg
│   │   │   │   │   └── student/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── startup/          # Startup dashboard
│   │   │   │   ├── student/          # Student dashboard
│   │   │   │   └── admin/            # Platform admin
│   │   │   ├── api/                  # Next.js API routes (BFF)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn components
│   │   │   ├── startup/              # StartupCard, Profile, etc.
│   │   │   ├── student/
│   │   │   ├── hackathon/
│   │   │   ├── messaging/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   └── stores/                   # Zustand stores
│   │
│   └── admin/                        # Admin panel (Next.js)
│
├── services/
│   ├── api-gateway/                  # Kong config
│   ├── auth-service/                 # JWT, OAuth
│   ├── startup-service/              # Startup CRUD
│   ├── student-service/              # Student CRUD
│   ├── hackathon-service/
│   ├── messaging-service/            # Chat, notifications
│   ├── media-service/                # File upload, CDN
│   ├── search-service/               # Typesense integration
│   ├── notification-service/         # Email, push
│   └── analytics-service/
│
├── packages/
│   ├── db/                           # Prisma schema + migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       └── client.ts
│   ├── types/                        # Shared TypeScript types
│   └── config/                       # Shared config/constants
│
├── infrastructure/
│   ├── k8s/                          # Kubernetes manifests
│   ├── terraform/                    # IaC
│   ├── docker/
│   └── scripts/
│
└── docs/                             # Architecture, API docs
```

---

## 5. Database Schema (PostgreSQL / Prisma)

### Core Tables

```sql
-- USERS (base for all user types)
users {
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  email         VARCHAR(255) UNIQUE NOT NULL
  password_hash VARCHAR(255)
  role          ENUM('startup_admin','startup_member','student','admin','service_provider')
  avatar_url    TEXT
  is_verified   BOOLEAN DEFAULT false
  is_active     BOOLEAN DEFAULT true
  auth_provider ENUM('email','google','linkedin','github')
  last_login_at TIMESTAMPTZ
  created_at    TIMESTAMPTZ DEFAULT NOW()
  updated_at    TIMESTAMPTZ DEFAULT NOW()
}

-- STARTUP PROFILES
startup_profiles {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id)
  slug                  VARCHAR(100) UNIQUE NOT NULL
  name                  VARCHAR(255) NOT NULL
  tagline               VARCHAR(500)
  description           TEXT
  logo_url              TEXT
  cover_image_url       TEXT
  stage                 ENUM('pre_seed','seed','series_a','series_b','growth','enterprise')
  status                ENUM('pending','under_review','verified','rejected','suspended')
  is_registered_company BOOLEAN DEFAULT false
  registration_number   VARCHAR(100)
  country_of_reg        VARCHAR(100)
  founded_year          INTEGER
  team_size             INTEGER
  total_raised          BIGINT  -- in USD cents
  mrr                   BIGINT  -- monthly recurring revenue
  website_url           TEXT
  product_url           TEXT
  pitch_deck_url        TEXT
  category_id           UUID REFERENCES categories(id)
  subcategory_id        UUID REFERENCES subcategories(id)
  region                VARCHAR(100)
  country               VARCHAR(100)
  city                  VARCHAR(100)
  social_linkedin       TEXT
  social_twitter        TEXT
  upvote_count          INTEGER DEFAULT 0
  view_count            INTEGER DEFAULT 0
  is_featured           BOOLEAN DEFAULT false
  is_trending           BOOLEAN DEFAULT false
  created_at            TIMESTAMPTZ DEFAULT NOW()
  updated_at            TIMESTAMPTZ DEFAULT NOW()
}

-- STARTUP DOCUMENTS (for verification)
startup_documents {
  id              UUID PRIMARY KEY
  startup_id      UUID REFERENCES startup_profiles(id)
  doc_type        ENUM('incorporation','tax_certificate','bank_statement','pitch_deck','other')
  file_url        TEXT NOT NULL
  file_name       VARCHAR(255)
  verified        BOOLEAN DEFAULT false
  verified_by     UUID REFERENCES users(id)
  verified_at     TIMESTAMPTZ
  created_at      TIMESTAMPTZ DEFAULT NOW()
}

-- STARTUP PRODUCTS
startup_products {
  id              UUID PRIMARY KEY
  startup_id      UUID REFERENCES startup_profiles(id)
  name            VARCHAR(255)
  description     TEXT
  product_url     TEXT
  screenshot_urls TEXT[]  -- array of URLs
  demo_url        TEXT
  is_live         BOOLEAN DEFAULT true
  created_at      TIMESTAMPTZ DEFAULT NOW()
}

-- CATEGORIES
categories {
  id          UUID PRIMARY KEY
  name        VARCHAR(100) NOT NULL
  slug        VARCHAR(100) UNIQUE
  icon        VARCHAR(10)
  description TEXT
  sort_order  INTEGER DEFAULT 0
}

-- SUBCATEGORIES
subcategories {
  id          UUID PRIMARY KEY
  category_id UUID REFERENCES categories(id)
  name        VARCHAR(100)
  slug        VARCHAR(100)
  sort_order  INTEGER DEFAULT 0
}

-- SUB-SUBCATEGORIES
sub_subcategories {
  id               UUID PRIMARY KEY
  subcategory_id   UUID REFERENCES subcategories(id)
  name             VARCHAR(100)
  slug             VARCHAR(100)
}

-- STUDENT PROFILES
student_profiles {
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  full_name       VARCHAR(255)
  avatar_url      TEXT
  bio             TEXT
  university_id   UUID REFERENCES universities(id)
  degree          VARCHAR(255)
  major           VARCHAR(255)
  graduation_year INTEGER
  country         VARCHAR(100)
  skills          TEXT[]
  github_url      TEXT
  linkedin_url    TEXT
  portfolio_url   TEXT
  is_open_to_work BOOLEAN DEFAULT false
  preferred_roles TEXT[]
  created_at      TIMESTAMPTZ DEFAULT NOW()
}

-- UNIVERSITIES
universities {
  id          UUID PRIMARY KEY
  name        VARCHAR(255) NOT NULL
  country     VARCHAR(100)
  domain      VARCHAR(100)  -- for email verification
  logo_url    TEXT
  is_verified BOOLEAN DEFAULT false
}

-- HACKATHONS
hackathons {
  id                UUID PRIMARY KEY
  startup_id        UUID REFERENCES startup_profiles(id)
  title             VARCHAR(255)
  description       TEXT
  banner_url        TEXT
  prize_pool        BIGINT  -- USD cents
  prize_breakdown   JSONB
  max_participants  INTEGER
  team_size_min     INTEGER DEFAULT 1
  team_size_max     INTEGER DEFAULT 5
  start_date        DATE
  end_date          DATE
  registration_deadline DATE
  status            ENUM('draft','upcoming','open','in_progress','judging','completed','cancelled')
  submission_format TEXT
  judging_criteria  JSONB
  tags              TEXT[]
  created_at        TIMESTAMPTZ DEFAULT NOW()
}

-- HACKATHON REGISTRATIONS
hackathon_registrations {
  id            UUID PRIMARY KEY
  hackathon_id  UUID REFERENCES hackathons(id)
  student_id    UUID REFERENCES student_profiles(id)
  team_name     VARCHAR(100)
  team_id       UUID  -- self-reference for team grouping
  status        ENUM('registered','submitted','disqualified','winner')
  submission_url TEXT
  registered_at TIMESTAMPTZ DEFAULT NOW()
}

-- CONVERSATIONS
conversations {
  id            UUID PRIMARY KEY
  type          ENUM('direct','startup_student','group')
  title         VARCHAR(255)  -- for group chats
  created_by    UUID REFERENCES users(id)
  startup_id    UUID REFERENCES startup_profiles(id)  -- nullable
  created_at    TIMESTAMPTZ DEFAULT NOW()
}

-- CONVERSATION PARTICIPANTS
conversation_participants {
  conversation_id UUID REFERENCES conversations(id)
  user_id         UUID REFERENCES users(id)
  role            ENUM('member','admin')
  last_read_at    TIMESTAMPTZ
  joined_at       TIMESTAMPTZ DEFAULT NOW()
  PRIMARY KEY (conversation_id, user_id)
}

-- MESSAGES
messages {
  id              UUID PRIMARY KEY
  conversation_id UUID REFERENCES conversations(id)
  sender_id       UUID REFERENCES users(id)
  content         TEXT
  type            ENUM('text','file','image','system')
  attachment_url  TEXT
  is_deleted      BOOLEAN DEFAULT false
  read_by         UUID[]
  created_at      TIMESTAMPTZ DEFAULT NOW()
}

-- OPPORTUNITIES
opportunities {
  id            UUID PRIMARY KEY
  startup_id    UUID REFERENCES startup_profiles(id)
  type          ENUM('internship','full_time','part_time','contract','volunteer')
  title         VARCHAR(255)
  description   TEXT
  requirements  TEXT[]
  skills        TEXT[]
  location      VARCHAR(255)
  is_remote     BOOLEAN DEFAULT false
  compensation  VARCHAR(100)
  duration      VARCHAR(100)
  openings      INTEGER DEFAULT 1
  deadline      DATE
  status        ENUM('active','paused','closed','filled')
  created_at    TIMESTAMPTZ DEFAULT NOW()
}

-- OPPORTUNITY APPLICATIONS
opportunity_applications {
  id             UUID PRIMARY KEY
  opportunity_id UUID REFERENCES opportunities(id)
  student_id     UUID REFERENCES student_profiles(id)
  cover_letter   TEXT
  resume_url     TEXT
  status         ENUM('applied','reviewing','shortlisted','interviewed','offered','rejected')
  applied_at     TIMESTAMPTZ DEFAULT NOW()
}

-- STARTUP UPVOTES
startup_upvotes {
  startup_id UUID REFERENCES startup_profiles(id)
  user_id    UUID REFERENCES users(id)
  created_at TIMESTAMPTZ DEFAULT NOW()
  PRIMARY KEY (startup_id, user_id)
}

-- FEEDBACK / REVIEWS
startup_feedback {
  id          UUID PRIMARY KEY
  startup_id  UUID REFERENCES startup_profiles(id)
  user_id     UUID REFERENCES users(id)
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5)
  title       VARCHAR(255)
  content     TEXT
  tags        TEXT[]
  is_verified BOOLEAN DEFAULT false  -- verified user/customer
  created_at  TIMESTAMPTZ DEFAULT NOW()
}

-- COE SERVICE ORDERS
service_orders {
  id              UUID PRIMARY KEY
  startup_id      UUID REFERENCES startup_profiles(id)
  service_type    ENUM('branding','digital_marketing','software_dev','hr','legal','it_infra','other')
  title           VARCHAR(255)
  description     TEXT
  budget          BIGINT
  status          ENUM('inquiry','quoted','in_progress','review','completed','cancelled')
  assigned_to     UUID REFERENCES users(id)
  created_at      TIMESTAMPTZ DEFAULT NOW()
}

-- NOTIFICATIONS
notifications {
  id          UUID PRIMARY KEY
  user_id     UUID REFERENCES users(id)
  type        VARCHAR(50)
  title       VARCHAR(255)
  body        TEXT
  data        JSONB
  is_read     BOOLEAN DEFAULT false
  created_at  TIMESTAMPTZ DEFAULT NOW()
}
```

---

## 6. API Endpoints

### Authentication
```
POST   /api/v1/auth/register              Register new user
POST   /api/v1/auth/login                 Email/password login
POST   /api/v1/auth/oauth/:provider       OAuth callback
POST   /api/v1/auth/refresh               Refresh JWT
POST   /api/v1/auth/logout
GET    /api/v1/auth/me                    Current user
POST   /api/v1/auth/verify-email/:token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### Startups
```
GET    /api/v1/startups                   List (filter, sort, paginate)
POST   /api/v1/startups                   Create startup profile
GET    /api/v1/startups/:slug             Get startup by slug
PUT    /api/v1/startups/:id               Update startup
DELETE /api/v1/startups/:id
POST   /api/v1/startups/:id/upvote
DELETE /api/v1/startups/:id/upvote
GET    /api/v1/startups/:id/products
POST   /api/v1/startups/:id/products      Add product
PUT    /api/v1/startups/:id/products/:pid
POST   /api/v1/startups/:id/documents     Upload verification docs
GET    /api/v1/startups/:id/feedback
POST   /api/v1/startups/:id/feedback      Submit feedback
GET    /api/v1/startups/featured
GET    /api/v1/startups/trending
```

### Students
```
GET    /api/v1/students/:id               Get student profile
PUT    /api/v1/students/:id               Update profile
GET    /api/v1/students/:id/hackathons    Registered hackathons
GET    /api/v1/students/:id/applications
POST   /api/v1/students/:id/skills        Update skills
```

### Hackathons
```
GET    /api/v1/hackathons                 List hackathons
POST   /api/v1/hackathons                 Create hackathon (startup)
GET    /api/v1/hackathons/:id
PUT    /api/v1/hackathons/:id
POST   /api/v1/hackathons/:id/register    Student registers
GET    /api/v1/hackathons/:id/participants
POST   /api/v1/hackathons/:id/submit      Submit project
GET    /api/v1/hackathons/:id/submissions
PUT    /api/v1/hackathons/:id/submissions/:sid/judge
```

### Messaging
```
GET    /api/v1/conversations              List user conversations
POST   /api/v1/conversations              Create conversation
GET    /api/v1/conversations/:id          Get conversation + messages
POST   /api/v1/conversations/:id/messages Send message
PUT    /api/v1/conversations/:id/read     Mark as read
WS     /ws/conversations                  Real-time socket
```

### Opportunities
```
GET    /api/v1/opportunities              List (filter by type, skills, etc.)
POST   /api/v1/opportunities              Create (startup only)
GET    /api/v1/opportunities/:id
PUT    /api/v1/opportunities/:id
POST   /api/v1/opportunities/:id/apply    Student applies
GET    /api/v1/opportunities/:id/applications (startup view)
PUT    /api/v1/opportunities/:id/applications/:aid  Update status
```

### Categories
```
GET    /api/v1/categories                 All categories + subcategories
GET    /api/v1/categories/:id/subcategories
GET    /api/v1/categories/:id/sub-subcategories
```

### COE Services
```
GET    /api/v1/services                   List services
POST   /api/v1/services/inquire           Service inquiry
GET    /api/v1/services/orders            My service orders
PUT    /api/v1/services/orders/:id        Update order status
```

### Search
```
GET    /api/v1/search?q=&type=            Global search
GET    /api/v1/search/suggestions         Autocomplete
```

### Admin
```
GET    /api/v1/admin/startups             All startups (pending review)
PUT    /api/v1/admin/startups/:id/verify  Approve/reject
GET    /api/v1/admin/analytics            Platform metrics
GET    /api/v1/admin/users
PUT    /api/v1/admin/users/:id/status
POST   /api/v1/admin/categories
```

---

## 7. UI Architecture

### Component Hierarchy
```
Root (Layout + Providers)
├── AuthProvider (NextAuth session)
├── QueryClientProvider (React Query)
├── ThemeProvider
└── Router
    ├── PublicLayout (Marketing nav + footer)
    │   ├── LandingPage
    │   ├── StartupDirectory
    │   ├── StartupProfile
    │   ├── HackathonsPage
    │   ├── OpportunitiesPage
    │   └── ServicesPage
    ├── AuthLayout
    │   ├── LoginPage
    │   ├── StartupRegistration (5-step wizard)
    │   └── StudentRegistration (3-step wizard)
    ├── StartupDashboard (authenticated)
    │   ├── Overview (metrics, upvotes, views)
    │   ├── ProfileEditor
    │   ├── ProductsManager
    │   ├── HackathonsManager (create/manage)
    │   ├── OpportunitiesManager
    │   ├── MessagingCenter
    │   ├── AnalyticsDashboard
    │   └── ServiceOrders
    ├── StudentDashboard (authenticated)
    │   ├── StartupFeed
    │   ├── SavedStartups
    │   ├── MyHackathons
    │   ├── Applications
    │   ├── Messages
    │   └── Profile
    └── AdminDashboard
        ├── StartupVerification queue
        ├── PlatformAnalytics
        ├── UserManagement
        └── ContentModeration
```

### State Management
- Server State: React Query (TanStack Query v5)
- Client State: Zustand (auth, UI, messaging)
- Forms: React Hook Form + Zod validation
- Real-time: Socket.io context provider

---

## 8. Scalability Strategy

### Horizontal Scaling
- Stateless API services behind load balancer
- Redis for distributed session storage
- Kubernetes HPA (Horizontal Pod Autoscaler) rules

### Database Scaling
- Read replicas for heavy SELECT queries (startup directory, search)
- Connection pooling via PgBouncer
- Database sharding by region when >10M records
- Elasticsearch for complex search queries

### Caching Strategy
```
L1: In-memory (Node.js LRU cache) — hot startup profiles (5 min TTL)
L2: Redis — category listings, trending startups (15 min TTL)
L3: Cloudflare CDN — static assets, OG images (24h TTL)
```

### CDN & Media
- All uploaded files → AWS S3 → CloudFront CDN
- Image optimization via Cloudflare Images (resize on-the-fly)
- Startup logos: WebP format, multiple breakpoints

### Search at Scale
- Typesense for <1M records (fast, self-hosted)
- Migrate to Elasticsearch at scale
- Asynchronous indexing via BullMQ queue

---

## 9. Security Architecture

| Layer | Measure |
|-------|---------|
| Auth | JWT (15min access, 7d refresh), httpOnly cookies |
| Rate Limiting | Kong: 100 req/min public, 1000 req/min authenticated |
| Input Validation | Zod on all API inputs |
| File Upload | S3 presigned URLs, MIME type validation, virus scan |
| Secrets | AWS Secrets Manager / Doppler |
| CORS | Whitelist of allowed origins |
| SQL Injection | Prisma parameterized queries only |
| XSS | CSP headers, input sanitization |
| OWASP | Regular security audits |

---

## 10. Startup Registration Flow (5 Steps)

```
Step 1: Account Setup
  → Email, password, role (founder/admin/member)
  
Step 2: Company Status
  → Registered company? Yes/No
  → If Yes: Country, Registration #, upload docs (incorporation cert)
  → If No: Planned registration timeline
  
Step 3: Startup Details  
  → Name, tagline, description, founding year
  → Team size, stage, total raised
  → Category → Subcategory → Sub-subcategory
  
Step 4: Products & Links
  → Product name, description, URL
  → Screenshots (up to 5)
  → Website URL, pitch deck URL
  → Social links
  
Step 5: Review & Submit
  → Preview profile
  → Accept terms
  → Submit for verification
  → Status: "Under Review" (admin verifies within 24-48h)
```

---

## 11. Deployment Architecture (AWS)

```
Route 53 (DNS)
    │
Cloudflare (CDN + WAF + DDoS protection)
    │
Application Load Balancer
    │
┌───┴──────────────────────────────────┐
│              EKS Cluster              │
│  ┌──────────┐  ┌──────────────────┐  │
│  │  Next.js  │  │  API Services    │  │
│  │  (Vercel) │  │  (3+ replicas)   │  │
│  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────────────┐  │
│  │  Socket  │  │  Worker Services  │  │
│  │  Server  │  │  (BullMQ)        │  │
│  └──────────┘  └──────────────────┘  │
└──────────────────────────────────────┘
         │              │
    RDS Postgres    ElastiCache Redis
    (Multi-AZ)      (Cluster mode)
         │
    S3 + CloudFront
```

---

*LaunchNexus Architecture v1.0 — Built for scale from day one.*
