import { useState, useEffect, useRef } from "react";

/* ─── INJECT GLOBAL STYLES & FONTS ─── */
const GlobalStyles = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      :root{
        --bg0:#06060F;--bg1:#0C0C1E;--bg2:#111128;--bg3:#181834;
        --card:#13132A;--card-hover:#181840;
        --border:rgba(255,255,255,0.07);--border-accent:rgba(120,100,255,0.35);
        --pu:#7C6EFA;--pu-light:#A89EFD;--pu-dim:rgba(124,110,250,0.15);
        --cy:#22D3EE;--am:#FCD34D;--gr:#34D399;--re:#FB7185;
        --tx0:#F0F0FF;--tx1:#A8A8CC;--tx2:#6060A0;
        --ra:10px;--ra-lg:16px;--ra-xl:24px;
        --sh:0 4px 24px rgba(0,0,0,0.5);
      }
      body{background:var(--bg0);color:var(--tx0);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
      h1,h2,h3,h4,h5{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-0.02em}
      ::-webkit-scrollbar{width:6px;height:6px}
      ::-webkit-scrollbar-track{background:var(--bg1)}
      ::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}
      ::-webkit-scrollbar-thumb:hover{background:var(--pu)}
      a{color:inherit;text-decoration:none}
      input,textarea,select{font-family:'DM Sans',sans-serif;background:var(--bg2);border:1px solid var(--border);border-radius:var(--ra);color:var(--tx0);padding:10px 14px;font-size:14px;width:100%;outline:none;transition:border-color 0.2s}
      input:focus,textarea:focus,select:focus{border-color:var(--pu)}
      input::placeholder,textarea::placeholder{color:var(--tx2)}
      select option{background:var(--bg2)}
      .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:0.02em;white-space:nowrap}
      .scroll-x{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
      .scroll-x::-webkit-scrollbar{display:none}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .fade-up{animation:fadeUp 0.4s ease forwards}
      .card-hover{transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s}
      .card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.6);border-color:var(--border-accent)}
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
  return null;
};

/* ─── MOCK DATA ─── */
const CATS = [
  { id:"all", name:"All", icon:"◈", count:1840 },
  { id:"ai", name:"AI & ML", icon:"⟁", count:342 },
  { id:"fintech", name:"FinTech", icon:"◈", count:218 },
  { id:"health", name:"HealthTech", icon:"⊕", count:189 },
  { id:"edtech", name:"EdTech", icon:"◉", count:156 },
  { id:"saas", name:"SaaS & B2B", icon:"⬡", count:203 },
  { id:"clean", name:"CleanTech", icon:"✦", count:94 },
  { id:"web3", name:"Web3", icon:"⛬", count:131 },
  { id:"ecom", name:"E-Commerce", icon:"⟐", count:167 },
  { id:"deep", name:"Deep Tech", icon:"⊗", count:78 },
  { id:"media", name:"Media", icon:"▷", count:112 },
];

const FULL_CATS = [
  { name:"AI & Machine Learning", subs:[
    { name:"Natural Language Processing", tags:["Chatbots","Translation","Sentiment Analysis","Document AI"] },
    { name:"Computer Vision", tags:["Medical Imaging","Object Detection","Video Analytics","Facial Recognition"] },
    { name:"Generative AI", tags:["Text Generation","Image Generation","Code Generation","Multimodal AI"] },
    { name:"AI Platforms & MLOps", tags:["Model Training","Model Deployment","Data Labeling","AI Infrastructure"] },
    { name:"AI for Business", tags:["Process Automation","Predictive Analytics","Decision Intelligence","AI Agents"] },
  ]},
  { name:"FinTech & Finance", subs:[
    { name:"Payments & Transfers", tags:["B2B Payments","Cross-Border","Mobile Payments","POS Systems"] },
    { name:"Banking & Lending", tags:["Neobanking","SME Lending","BNPL","Mortgage Tech"] },
    { name:"InsurTech", tags:["Life Insurance","Health Insurance","P&C","Embedded Insurance"] },
    { name:"WealthTech", tags:["Robo-Advisory","Portfolio Management","Retail Investing","Pension Tech"] },
    { name:"Crypto & DeFi", tags:["DeFi Protocols","Crypto Exchange","Stablecoins","Custody Solutions"] },
    { name:"RegTech", tags:["KYC/AML","Compliance Automation","Fraud Detection","Reporting"] },
  ]},
  { name:"HealthTech & BioTech", subs:[
    { name:"Telemedicine", tags:["Virtual Consultations","Remote Monitoring","Mental Health","Chronic Care"] },
    { name:"Health Data & AI", tags:["Diagnostics AI","EHR Systems","Clinical Decision Support","Genomics"] },
    { name:"MedTech Devices", tags:["Wearables","Surgical Robotics","Implantables","Diagnostic Devices"] },
    { name:"Pharma Tech", tags:["Drug Discovery","Clinical Trials","Supply Chain","Distribution"] },
    { name:"Mental Health", tags:["Therapy Platforms","Wellness Apps","Crisis Intervention","Mindfulness"] },
  ]},
  { name:"EdTech", subs:[
    { name:"K-12 Education", tags:["Curriculum Tools","Student Engagement","Parent Portals","Assessment"] },
    { name:"Higher Education", tags:["LMS Platforms","Research Tools","University Operations","MOOCs"] },
    { name:"Corporate Learning", tags:["LXP","Skills Training","Compliance Training","Leadership Dev"] },
    { name:"Language Learning", tags:["Language Apps","Translation Tools","Language AI","Tutoring"] },
    { name:"STEM & Coding", tags:["Coding Bootcamps","Math Platforms","Science Simulations","Robotics Edu"] },
  ]},
  { name:"SaaS & Enterprise Software", subs:[
    { name:"HR & People Ops", tags:["HRIS","Recruiting","Performance Mgmt","Payroll","Employee Experience"] },
    { name:"Marketing Tech", tags:["CRM","Marketing Automation","Analytics","Attribution","CDP"] },
    { name:"Legal Tech", tags:["Contract Management","Legal Research","eDiscovery","IP Management"] },
    { name:"Project & Operations", tags:["Project Mgmt","ERP","Supply Chain","Procurement","Facilities"] },
    { name:"Customer Success", tags:["CS Platforms","Ticketing","Community","Feedback","NPS"] },
  ]},
  { name:"CleanTech & Sustainability", subs:[
    { name:"Renewable Energy", tags:["Solar","Wind","Hydro","Energy Storage","Grid Management"] },
    { name:"Carbon & Climate", tags:["Carbon Credits","Footprint Tracking","Net Zero Tools","ESG Reporting"] },
    { name:"AgriTech", tags:["Precision Farming","Agri AI","Food Tech","Vertical Farming","Supply Chain"] },
    { name:"Waste & Circular Economy", tags:["Recycling Tech","Waste Marketplace","Upcycling","Packaging"] },
    { name:"Water Technology", tags:["Water Purification","Irrigation Tech","Water Monitoring","Desalination"] },
  ]},
];

const STAGES = ["Pre-Seed","Seed","Series A","Series B","Growth","Enterprise"];

const STARTUPS = [
  { id:1, name:"NeuralPath AI", initials:"NP", color:"#7C6EFA", stage:"Seed", cat:"ai",
    tagline:"Autonomous AI agents that reduce enterprise ops costs by 60%",
    location:"San Francisco, USA", flag:"🇺🇸", founded:2023, team:12, raised:"$2.4M",
    tags:["AI Agents","Enterprise","Automation","SaaS"],
    upvotes:847, views:12400, verified:true, featured:true, trending:true,
    desc:"NeuralPath builds the orchestration layer for enterprise AI — enabling autonomous, multi-step workflow execution across any business system without custom code. Backed by Y Combinator W24.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:2, name:"GreenVolt", initials:"GV", color:"#34D399", stage:"Series A", cat:"clean",
    tagline:"Decentralized P2P solar energy trading for emerging markets",
    location:"Lagos, Nigeria", flag:"🇳🇬", founded:2022, team:34, raised:"$8.1M",
    tags:["Clean Energy","Africa","Blockchain","Impact"],
    upvotes:1203, views:28700, verified:true, featured:true, trending:false,
    desc:"GreenVolt powers Africa's energy transition through a decentralized trading platform that lets solar panel owners sell excess energy directly to neighbors.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:3, name:"MediLens", initials:"ML", color:"#FB7185", stage:"Pre-Seed", cat:"health",
    tagline:"CV-powered diagnostics for rural healthcare across SE Asia",
    location:"Singapore", flag:"🇸🇬", founded:2023, team:8, raised:"$1.2M",
    tags:["Health AI","Diagnostics","Impact","Computer Vision"],
    upvotes:534, views:8900, verified:true, featured:false, trending:true,
    desc:"MediLens deploys computer vision models on affordable hardware to give rural clinics diagnostic capabilities previously only available in tier-1 hospitals.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:4, name:"EduVerse", initials:"EV", color:"#FCD34D", stage:"Seed", cat:"edtech",
    tagline:"Immersive VR classrooms making elite education globally accessible",
    location:"Bangalore, India", flag:"🇮🇳", founded:2022, team:23, raised:"$3.7M",
    tags:["VR/AR","Education","Accessibility","B2C"],
    upvotes:692, views:15300, verified:true, featured:false, trending:true,
    desc:"EduVerse lets students in any country attend live virtual classes taught by Ivy League educators in immersive, collaborative 3D environments.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:5, name:"ChainPay", initials:"CP", color:"#A78BFA", stage:"Series A", cat:"fintech",
    tagline:"Instant cross-border B2B settlements via stablecoin rails",
    location:"Dubai, UAE", flag:"🇦🇪", founded:2021, team:41, raised:"$12M",
    tags:["Stablecoins","B2B Payments","Cross-Border","FinTech"],
    upvotes:1567, views:41200, verified:true, featured:true, trending:false,
    desc:"ChainPay enables real-time international B2B settlement at <0.1% cost through its proprietary stablecoin infrastructure. Processing $2.4B ARR.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:6, name:"RoboFarm", initials:"RF", color:"#22D3EE", stage:"Seed", cat:"deep",
    tagline:"Autonomous micro-robots increasing crop yield 40% with zero pesticides",
    location:"Berlin, Germany", flag:"🇩🇪", founded:2022, team:19, raised:"$5.4M",
    tags:["Robotics","AgriTech","Sustainability","Hardware"],
    upvotes:781, views:18100, verified:true, featured:false, trending:false,
    desc:"RoboFarm's swarms of matchbox-sized robots navigate crop rows with millimeter precision, applying targeted micro-doses and eliminating broad-spectrum pesticide use.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:7, name:"ShopStack", initials:"SS", color:"#F97316", stage:"Series B", cat:"ecom",
    tagline:"AI-native commerce OS for D2C brands scaling to 9 figures",
    location:"New York, USA", flag:"🇺🇸", founded:2020, team:87, raised:"$31M",
    tags:["Commerce","AI","D2C","Shopify Alternative"],
    upvotes:2103, views:67800, verified:true, featured:true, trending:false,
    desc:"ShopStack replaces the Shopify + 20 apps setup with a single AI-powered commerce OS — from inventory to customer lifetime value optimization.",
    website:"#", linkedin:"#", twitter:"#" },
  { id:8, name:"DataWeave", initials:"DW", color:"#818CF8", stage:"Seed", cat:"saas",
    tagline:"No-code data pipeline builder shipping analytics 10x faster",
    location:"Toronto, Canada", flag:"🇨🇦", founded:2023, team:11, raised:"$1.8M",
    tags:["No-Code","Data Engineering","Analytics","SaaS"],
    upvotes:423, views:7600, verified:false, featured:false, trending:true,
    desc:"DataWeave gives data teams a visual pipeline builder that auto-generates production-ready dbt, Airflow, and Spark code — no Python required.",
    website:"#", linkedin:"#", twitter:"#" },
];

const HACKATHONS = [
  { id:1, title:"AI for Healthcare Global Hackathon 2025", startup:"MediLens", color:"#FB7185", initials:"ML",
    prize:"$50,000", spots:2340, maxSpots:5000, deadline:"Jun 15, 2025", status:"Open",
    tags:["AI","Healthcare","Open Source"], duration:"72 hours",
    desc:"Build AI solutions that improve healthcare access in underserved communities. Winners get mentorship + fast-track to MediLens partnership." },
  { id:2, title:"CleanTech Innovation Challenge", startup:"GreenVolt", color:"#34D399", initials:"GV",
    prize:"$30,000", spots:1890, maxSpots:3000, deadline:"Jul 1, 2025", status:"Open",
    tags:["CleanEnergy","Climate","Hardware"], duration:"7 days",
    desc:"Design novel energy distribution solutions for off-grid communities in Sub-Saharan Africa. Hardware and software submissions welcome." },
  { id:3, title:"FinTech Frontier Buildathon", startup:"ChainPay", color:"#A78BFA", initials:"CP",
    prize:"$75,000", spots:3100, maxSpots:3500, deadline:"Jun 28, 2025", status:"Closing Soon",
    tags:["Blockchain","Payments","DeFi"], duration:"48 hours",
    desc:"Build the next generation of cross-border payment infrastructure. Top teams get seed investment consideration from ChainPay's VC network." },
  { id:4, title:"Enterprise AI Automation Sprint", startup:"NeuralPath AI", color:"#7C6EFA", initials:"NP",
    prize:"$100,000", spots:890, maxSpots:2000, deadline:"Aug 10, 2025", status:"Upcoming",
    tags:["AI Agents","Enterprise","Automation"], duration:"5 days",
    desc:"Create autonomous AI agents that solve real enterprise bottlenecks. Grand prize winner joins NeuralPath as a founding team member." },
];

const OPPORTUNITIES = [
  { id:1, type:"Internship", role:"ML Research Intern", company:"NeuralPath AI", color:"#7C6EFA", initials:"NP",
    location:"Remote / SF", comp:"$3,200/mo", duration:"3 months", tags:["Python","PyTorch","LLMs"],
    posted:"2d ago", applicants:47 },
  { id:2, type:"Full-Time", role:"Frontend Engineer (React)", company:"GreenVolt", color:"#34D399", initials:"GV",
    location:"Lagos, Nigeria (Hybrid)", comp:"$60K–$80K", duration:"Permanent", tags:["React","TypeScript","Mobile"],
    posted:"1d ago", applicants:89 },
  { id:3, type:"Internship", role:"Business Development Intern", company:"ChainPay", color:"#A78BFA", initials:"CP",
    location:"Dubai, UAE", comp:"$2,500/mo", duration:"6 months", tags:["B2B Sales","FinTech","Growth"],
    posted:"3d ago", applicants:134 },
  { id:4, type:"Full-Time", role:"Product Designer", company:"EduVerse", color:"#FCD34D", initials:"EV",
    location:"Bangalore (Remote OK)", comp:"₹18–28 LPA", duration:"Permanent", tags:["Figma","UX","VR/AR"],
    posted:"5d ago", applicants:62 },
  { id:5, type:"Contract", role:"DevOps / Cloud Engineer", company:"ShopStack", color:"#F97316", initials:"SS",
    location:"Remote", comp:"$120–150/hr", duration:"6 months", tags:["AWS","K8s","Terraform"],
    posted:"1d ago", applicants:28 },
  { id:6, type:"Internship", role:"Data Science Intern", company:"DataWeave", color:"#818CF8", initials:"DW",
    location:"Toronto / Remote", comp:"$2,800/mo", duration:"4 months", tags:["Python","SQL","dbt"],
    posted:"4d ago", applicants:71 },
];

const SERVICES = [
  { id:1, name:"Brand & Identity", icon:"✦", color:"#FCD34D",
    desc:"Logo, brand guidelines, pitch decks, and full visual identity by our global creative team.",
    items:["Logo & Brand Kit","Pitch Deck Design","Social Media Kit","Brand Strategy"],
    price:"From $499", badge:"Most Popular" },
  { id:2, name:"Digital Marketing", icon:"◈", color:"#7C6EFA",
    desc:"Full-funnel digital marketing: SEO, paid ads, content strategy, and social media management.",
    items:["SEO & SEM","Paid Ads (Meta/Google)","Content Marketing","Performance Analytics"],
    price:"From $799/mo", badge:"" },
  { id:3, name:"Software Development", icon:"⟨/⟩", color:"#22D3EE",
    desc:"Dedicated engineering teams for MVP builds, scaling infrastructure, and product iteration.",
    items:["MVP Development","Full-Stack Teams","DevOps & Cloud","QA & Testing"],
    price:"From $150/hr", badge:"Top Rated" },
  { id:4, name:"HR & Global Talent", icon:"◉", color:"#34D399",
    desc:"End-to-end HR: talent acquisition, onboarding, payroll, and global employer-of-record services.",
    items:["Global Recruitment","EOR Services","Payroll Management","HR Compliance"],
    price:"From $299/mo", badge:"" },
  { id:5, name:"Legal & Compliance", icon:"⚖", color:"#FB7185",
    desc:"Startup-friendly legal support covering incorporation, IP, contracts, and regulatory compliance.",
    items:["Incorporation","IP Protection","Contract Review","Regulatory Advice"],
    price:"From $199", badge:"" },
  { id:6, name:"IT Infrastructure", icon:"⬡", color:"#A78BFA",
    desc:"Managed IT: cloud architecture, cybersecurity, DevOps automation, and 24/7 technical support.",
    items:["Cloud Architecture","Cybersecurity","DevOps Setup","24/7 Support"],
    price:"From $499/mo", badge:"" },
];

const STATS = [
  { label:"Startups Listed", value:"5,200+", icon:"🚀" },
  { label:"Student Members", value:"148K+", icon:"🎓" },
  { label:"Countries", value:"140+", icon:"🌍" },
  { label:"Hackathons Hosted", value:"320+", icon:"⚡" },
  { label:"Jobs & Internships", value:"9,800+", icon:"💼" },
  { label:"Funding Facilitated", value:"$2.4B+", icon:"💰" },
];

/* ─── UTILITY COMPONENTS ─── */
const Avatar = ({ initials, color, size = 40, radius = 10 }) => (
  <div style={{ width:size, height:size, minWidth:size, borderRadius:radius,
    background:`${color}22`, border:`1.5px solid ${color}44`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size * 0.32, fontWeight:700, color, fontFamily:"Bricolage Grotesque,sans-serif" }}>
    {initials}
  </div>
);

const Badge = ({ children, color = "#7C6EFA", bg }) => (
  <span className="chip" style={{
    background: bg || `${color}18`,
    color, border:`1px solid ${color}30`
  }}>{children}</span>
);

const StageTag = ({ stage }) => {
  const map = { "Pre-Seed":["#FCD34D","#3D3000"], "Seed":["#34D399","#002D1F"],
    "Series A":["#7C6EFA","#1A1050"], "Series B":["#22D3EE","#001E2A"],
    "Growth":["#F97316","#2D1500"], "Enterprise":["#A78BFA","#1E1040"] };
  const [c, bg] = map[stage] || ["#A8A8CC","#1A1A30"];
  return <span className="chip" style={{ background:bg, color:c, border:`1px solid ${c}30` }}>{stage}</span>;
};

const Btn = ({ children, variant="primary", onClick, style={}, size="md" }) => {
  const pad = size === "sm" ? "6px 14px" : size === "lg" ? "14px 28px" : "10px 20px";
  const fs = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const styles = {
    primary: { background:"var(--pu)", color:"#fff", border:"none" },
    outline: { background:"transparent", color:"var(--pu-light)", border:"1px solid var(--border-accent)" },
    ghost: { background:"transparent", color:"var(--tx1)", border:"1px solid var(--border)" },
    danger: { background:"rgba(251,113,133,0.1)", color:"#FB7185", border:"1px solid rgba(251,113,133,0.3)" },
    success: { background:"rgba(52,211,153,0.1)", color:"#34D399", border:"1px solid rgba(52,211,153,0.3)" },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], padding:pad, borderRadius:"var(--ra)", cursor:"pointer",
      fontSize:fs, fontWeight:600, fontFamily:"DM Sans,sans-serif",
      display:"inline-flex", alignItems:"center", gap:6, transition:"all 0.15s",
      whiteSpace:"nowrap", ...style
    }}
    onMouseEnter={e => { if(variant==="primary") e.target.style.filter="brightness(1.1)"; }}
    onMouseLeave={e => { e.target.style.filter=""; }}>
      {children}
    </button>
  );
};

const StatusDot = ({ status }) => {
  const map = { "Open":"#34D399","Closing Soon":"#FCD34D","Upcoming":"#7C6EFA","Closed":"#FB7185" };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
    <span style={{ width:7, height:7, borderRadius:"50%", background:map[status]||"#aaa",
      boxShadow:status==="Open"?`0 0 6px ${map[status]}`:"none" }}/>
    <span style={{ fontSize:11, color:map[status]||"var(--tx2)", fontWeight:600 }}>{status}</span>
  </span>;
};

const Card = ({ children, style={}, onClick }) => (
  <div className="card-hover" onClick={onClick} style={{
    background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--ra-lg)",
    padding:"20px", cursor:onClick?"pointer":"default", ...style
  }}>{children}</div>
);

/* ─── STARTUP CARD ─── */
const StartupCard = ({ s, onClick }) => (
  <Card onClick={() => onClick(s)} style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <Avatar initials={s.initials} color={s.color} size={46}/>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:700, fontSize:16, color:"var(--tx0)" }}>{s.name}</span>
            {s.verified && <span title="Verified" style={{ color:"#7C6EFA", fontSize:14 }}>✓</span>}
            {s.trending && <span className="chip" style={{ background:"rgba(252,211,77,0.12)", color:"#FCD34D", border:"1px solid rgba(252,211,77,0.25)", fontSize:10 }}>🔥 Trending</span>}
          </div>
          <div style={{ fontSize:12, color:"var(--tx2)", marginTop:2 }}>{s.flag} {s.location} · {s.founded}</div>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); }} style={{
        background:"transparent", border:"1px solid var(--border)", borderRadius:"var(--ra)",
        color:"var(--tx2)", cursor:"pointer", padding:"4px 10px", fontSize:12, display:"flex", alignItems:"center", gap:4
      }}>▲ {s.upvotes.toLocaleString()}</button>
    </div>
    <p style={{ fontSize:13, color:"var(--tx1)", lineHeight:1.6 }}>{s.tagline}</p>
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {s.tags.slice(0,3).map(t => <Badge key={t}>{t}</Badge>)}
      <StageTag stage={s.stage}/>
    </div>
    <div style={{ display:"flex", gap:16, paddingTop:8, borderTop:"1px solid var(--border)" }}>
      <div><div style={{ fontSize:10, color:"var(--tx2)", marginBottom:2 }}>RAISED</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#34D399" }}>{s.raised}</div></div>
      <div><div style={{ fontSize:10, color:"var(--tx2)", marginBottom:2 }}>TEAM</div>
        <div style={{ fontSize:13, fontWeight:600 }}>{s.team} people</div></div>
      <div><div style={{ fontSize:10, color:"var(--tx2)", marginBottom:2 }}>VIEWS</div>
        <div style={{ fontSize:13, fontWeight:600 }}>{s.views.toLocaleString()}</div></div>
    </div>
  </Card>
);

/* ─── NAV BAR ─── */
const NavBar = ({ page, setPage, setShowReg, setRegType }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id:"home", label:"Home" }, { id:"discover", label:"Discover" },
    { id:"hackathons", label:"Hackathons" }, { id:"opportunities", label:"Opportunities" },
    { id:"services", label:"Services" }, { id:"architecture", label:"Architecture" },
  ];
  return (
    <nav style={{ position:"sticky", top:0, zIndex:1000,
      background:"rgba(6,6,15,0.9)", backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--border)", padding:"0 24px" }}>
      <div style={{ maxWidth:1320, margin:"0 auto", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:32 }}>
          <div onClick={() => setPage("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"var(--pu)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⬡</div>
            <span style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:800, fontSize:18,
              background:"linear-gradient(90deg,#7C6EFA,#22D3EE)", WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent" }}>LaunchNexus</span>
          </div>
          <div style={{ display:"flex", gap:2 }}>
            {navItems.slice(1,6).map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                background:"transparent", border:"none", cursor:"pointer",
                padding:"6px 12px", borderRadius:"var(--ra)", fontSize:13, fontWeight:500,
                color: page===n.id ? "var(--pu-light)" : "var(--tx2)",
                fontFamily:"DM Sans,sans-serif",
                background: page===n.id ? "var(--pu-dim)" : "transparent",
                transition:"all 0.15s"
              }}>{n.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setPage("architecture")} style={{
            background:"transparent", border:"none", cursor:"pointer",
            padding:"6px 12px", borderRadius:"var(--ra)", fontSize:13, fontWeight:500,
            color: page==="architecture" ? "var(--pu-light)" : "var(--tx2)",
            background: page==="architecture" ? "var(--pu-dim)" : "transparent",
            fontFamily:"DM Sans,sans-serif"
          }}>Docs</button>
          <Btn variant="ghost" size="sm" onClick={() => { setRegType("student"); setShowReg(true); }}>For Students</Btn>
          <Btn variant="primary" size="sm" onClick={() => { setRegType("startup"); setShowReg(true); }}>List Your Startup →</Btn>
        </div>
      </div>
    </nav>
  );
};

/* ─── HERO ─── */
const Hero = ({ setPage, setShowReg, setRegType }) => {
  const [q, setQ] = useState("");
  return (
    <section style={{ padding:"90px 24px 70px", textAlign:"center",
      background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,110,250,0.12), transparent)" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div className="chip fade-up" style={{ background:"var(--pu-dim)", color:"var(--pu-light)",
          border:"1px solid var(--border-accent)", marginBottom:20, fontSize:12, display:"inline-flex" }}>
          ⚡ 5,200+ Startups · 140+ Countries · $2.4B+ Facilitated
        </div>
        <h1 className="fade-up" style={{ fontSize:"clamp(38px,5vw,68px)", fontWeight:800, lineHeight:1.1,
          marginBottom:20, color:"var(--tx0)" }}>
          The Global Stage for
          <br/>
          <span style={{ background:"linear-gradient(135deg,#7C6EFA,#22D3EE,#34D399)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Tomorrow's Startups
          </span>
        </h1>
        <p className="fade-up" style={{ fontSize:18, color:"var(--tx1)", lineHeight:1.7, marginBottom:40, maxWidth:620, margin:"0 auto 40px" }}>
          Connect startups with a global user base, expert feedback, student talent, and enterprise-grade services — all in one platform built to accelerate growth at every stage.
        </p>
        <div className="fade-up" style={{ display:"flex", gap:10, maxWidth:580, margin:"0 auto 20px",
          background:"var(--bg2)", borderRadius:14, padding:6, border:"1px solid var(--border-accent)" }}>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search startups, categories, technologies..."
            style={{ flex:1, background:"transparent", border:"none", padding:"8px 10px", fontSize:14,
              color:"var(--tx0)", outline:"none" }}
            onKeyDown={e => e.key==="Enter" && setPage("discover")} />
          <Btn variant="primary" onClick={() => setPage("discover")}>Search</Btn>
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:8 }}>
          <Btn variant="outline" onClick={() => { setRegType("startup"); setShowReg(true); }}>🚀 List Your Startup</Btn>
          <Btn variant="ghost" onClick={() => { setRegType("student"); setShowReg(true); }}>🎓 Join as Student</Btn>
          <Btn variant="ghost" onClick={() => setPage("hackathons")}>⚡ View Hackathons</Btn>
        </div>
      </div>
    </section>
  );
};

/* ─── STATS BAR ─── */
const StatsBar = () => (
  <div style={{ padding:"20px 24px", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)",
    background:"var(--bg1)", overflowX:"auto" }}>
    <div style={{ maxWidth:1320, margin:"0 auto", display:"flex", gap:0, justifyContent:"space-around",
      flexWrap:"wrap" }}>
      {STATS.map(s => (
        <div key={s.label} style={{ padding:"12px 20px", textAlign:"center", minWidth:130 }}>
          <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
          <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:22, fontWeight:700,
            color:"var(--tx0)" }}>{s.value}</div>
          <div style={{ fontSize:11, color:"var(--tx2)", marginTop:2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── CATEGORY GRID ─── */
const CategorySection = ({ selected, setSelected, setPage }) => (
  <section style={{ padding:"50px 24px" }}>
    <div style={{ maxWidth:1320, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:24 }}>
        <h2 style={{ fontSize:26, fontWeight:700 }}>Browse by Category</h2>
        <button onClick={() => setPage("discover")} style={{ background:"none", border:"none",
          color:"var(--pu-light)", cursor:"pointer", fontSize:13, fontWeight:500 }}>View all →</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
        {CATS.map(c => (
          <div key={c.id} onClick={() => { setSelected(c.id); setPage("discover"); }}
            className="card-hover"
            style={{ background: selected===c.id ? "var(--pu-dim)" : "var(--card)",
              border:`1px solid ${selected===c.id ? "var(--border-accent)" : "var(--border)"}`,
              borderRadius:12, padding:"14px 10px", cursor:"pointer", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{c.icon}</div>
            <div style={{ fontSize:12, fontWeight:600, color: selected===c.id ? "var(--pu-light)" : "var(--tx1)" }}>
              {c.name}</div>
            <div style={{ fontSize:10, color:"var(--tx2)", marginTop:3 }}>{c.count}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── STARTUPS SECTION ─── */
const StartupsSection = ({ setSelectedStartup, limit = 6 }) => (
  <section style={{ padding:"10px 24px 60px" }}>
    <div style={{ maxWidth:1320, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:26, fontWeight:700 }}>Trending Startups</h2>
          <p style={{ fontSize:13, color:"var(--tx2)", marginTop:4 }}>Discover what's building momentum globally</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
        {STARTUPS.slice(0, limit).map(s => (
          <StartupCard key={s.id} s={s} onClick={setSelectedStartup} />
        ))}
      </div>
    </div>
  </section>
);

/* ─── HACKATHON SPOTLIGHT ─── */
const HackathonSpotlight = ({ setPage }) => (
  <section style={{ padding:"60px 24px",
    background:"linear-gradient(180deg, var(--bg1) 0%, var(--bg0) 100%)",
    borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
    <div style={{ maxWidth:1320, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:28 }}>
        <div>
          <div className="chip" style={{ background:"rgba(252,211,77,0.1)", color:"#FCD34D",
            border:"1px solid rgba(252,211,77,0.25)", marginBottom:10, display:"inline-flex" }}>⚡ Live Hackathons</div>
          <h2 style={{ fontSize:26, fontWeight:700 }}>Win. Build. Get Hired.</h2>
          <p style={{ fontSize:13, color:"var(--tx2)", marginTop:4 }}>
            Participate in hackathons hosted by global startups. Win prizes, get exposure, land offers.
          </p>
        </div>
        <Btn variant="outline" onClick={() => setPage("hackathons")}>View All Hackathons →</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {HACKATHONS.map(h => (
          <Card key={h.id} style={{ borderLeft:`3px solid ${h.color}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Avatar initials={h.initials} color={h.color} size={36} radius={8}/>
                <div>
                  <div style={{ fontSize:11, color:"var(--tx2)" }}>{h.startup}</div>
                  <div style={{ fontSize:11, color:"var(--tx2)" }}>{h.duration}</div>
                </div>
              </div>
              <StatusDot status={h.status}/>
            </div>
            <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:700, fontSize:15,
              color:"var(--tx0)", lineHeight:1.3, marginBottom:8 }}>{h.title}</div>
            <p style={{ fontSize:12, color:"var(--tx2)", lineHeight:1.6, marginBottom:12 }}>{h.desc.slice(0,100)}...</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
              {h.tags.map(t => <Badge key={t} color={h.color}>{t}</Badge>)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              paddingTop:12, borderTop:"1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize:10, color:"var(--tx2)" }}>PRIZE POOL</div>
                <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:18, fontWeight:700,
                  color:"#34D399" }}>{h.prize}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"var(--tx2)" }}>REGISTERED</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{h.spots.toLocaleString()} / {h.maxSpots.toLocaleString()}</div>
                <div style={{ height:3, borderRadius:2, background:"var(--bg3)",
                  width:80, marginTop:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.round(h.spots/h.maxSpots*100)}%`,
                    background: h.status==="Closing Soon" ? "#FCD34D" : h.color, borderRadius:2 }}/>
                </div>
              </div>
            </div>
            <div style={{ marginTop:12 }}>
              <Btn variant="outline" size="sm" style={{ width:"100%", justifyContent:"center" }}>
                {h.status === "Upcoming" ? "Set Reminder" : "Register Now →"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

/* ─── STUDENT SECTION ─── */
const StudentSection = ({ setShowReg, setRegType }) => (
  <section style={{ padding:"70px 24px" }}>
    <div style={{ maxWidth:1320, margin:"0 auto",
      background:"var(--bg2)", borderRadius:20, padding:"50px 40px",
      border:"1px solid var(--border)",
      background:"linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(124,110,250,0.08) 100%)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
        <div>
          <div className="chip" style={{ background:"rgba(34,211,238,0.1)", color:"#22D3EE",
            border:"1px solid rgba(34,211,238,0.25)", marginBottom:16, display:"inline-flex" }}>🎓 For Students</div>
          <h2 style={{ fontSize:34, fontWeight:800, lineHeight:1.2, marginBottom:16 }}>
            Your Bridge to the World's Most Exciting Startups
          </h2>
          <p style={{ fontSize:15, color:"var(--tx1)", lineHeight:1.7, marginBottom:28 }}>
            Join 148,000+ students from 500+ universities getting real-world experience, winning hackathon prizes, and landing jobs at fast-growing startups.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
            {[
              ["⚡","Compete in startup-hosted hackathons with $50K+ prize pools"],
              ["💼","Apply directly to internships and full-time roles from your university"],
              ["🌍","Get hands-on with cutting-edge products across 140+ countries"],
              ["📱","Promote startup products on social media and earn rewards"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:16, width:28, textAlign:"center" }}>{icon}</span>
                <span style={{ fontSize:13, color:"var(--tx1)" }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="success" size="lg" onClick={() => { setRegType("student"); setShowReg(true); }}>
              Join Free as Student →
            </Btn>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"Universities", val:"500+", color:"#22D3EE" },
            { label:"Student Members", val:"148K+", color:"#7C6EFA" },
            { label:"Hackathon Prizes", val:"$4.2M+", color:"#FCD34D" },
            { label:"Students Hired", val:"12,800+", color:"#34D399" },
            { label:"Active Internships", val:"2,400+", color:"#F97316" },
            { label:"Avg Response Time", val:"48h", color:"#FB7185" },
          ].map(s => (
            <div key={s.label} style={{ background:"var(--card)", border:`1px solid ${s.color}25`,
              borderRadius:12, padding:"20px 16px", textAlign:"center" }}>
              <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:26, fontWeight:800,
                color:s.color }}>{s.val}</div>
              <div style={{ fontSize:11, color:"var(--tx2)", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── COE SERVICES ─── */
const ServicesSection = ({ setPage }) => (
  <section style={{ padding:"10px 24px 70px" }}>
    <div style={{ maxWidth:1320, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
        <div>
          <div className="chip" style={{ background:"rgba(124,110,250,0.1)", color:"var(--pu-light)",
            border:"1px solid var(--border-accent)", marginBottom:12, display:"inline-flex" }}>
            🏢 Centre of Excellence
          </div>
          <h2 style={{ fontSize:26, fontWeight:700 }}>Enterprise Services for Startups</h2>
          <p style={{ fontSize:13, color:"var(--tx2)", marginTop:4 }}>
            Acceleration-grade services from our global expert network — priced for startup budgets.
          </p>
        </div>
        <Btn variant="outline" onClick={() => setPage("services")}>Explore All Services →</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16, marginTop:28 }}>
        {SERVICES.map(s => (
          <Card key={s.id} style={{ borderTop:`3px solid ${s.color}`, position:"relative" }}>
            {s.badge && <span className="chip" style={{ position:"absolute", top:16, right:16,
              background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}30`, fontSize:10 }}>
              {s.badge}</span>}
            <div style={{ fontSize:26, marginBottom:12, color:s.color }}>{s.icon}</div>
            <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:700, fontSize:17,
              marginBottom:8 }}>{s.name}</div>
            <p style={{ fontSize:13, color:"var(--tx1)", lineHeight:1.6, marginBottom:14 }}>{s.desc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
              {s.items.map(i => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--tx2)" }}>
                  <span style={{ color:s.color, fontSize:10 }}>✓</span> {i}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              paddingTop:12, borderTop:"1px solid var(--border)" }}>
              <span style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:700,
                fontSize:15, color:"var(--tx0)" }}>{s.price}</span>
              <Btn variant="ghost" size="sm">Get Quote →</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

/* ─── DISCOVER PAGE ─── */
const DiscoverPage = ({ selectedCat, setSelectedCat, setSelectedStartup }) => {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const filtered = STARTUPS.filter(s => {
    const matchCat = selectedCat === "all" || s.cat === selectedCat;
    const matchStage = stage === "All" || s.stage === stage;
    const matchQ = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchStage && matchQ;
  });
  return (
    <div style={{ maxWidth:1320, margin:"0 auto", padding:"40px 24px" }}>
      <h1 style={{ fontSize:32, fontWeight:800, marginBottom:6 }}>Discover Startups</h1>
      <p style={{ color:"var(--tx2)", marginBottom:28, fontSize:14 }}>
        Browse {STARTUPS.length}+ verified startups across all categories and stages
      </p>
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, tag, technology..."
          style={{ maxWidth:320, flex:"1 1 200px" }}/>
        <select value={stage} onChange={e => setStage(e.target.value)} style={{ maxWidth:160 }}>
          {["All", ...STAGES].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="scroll-x" style={{ flex:"1 1 400px" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setSelectedCat(c.id)} style={{
              padding:"6px 14px", borderRadius:20, border:"1px solid",
              borderColor: selectedCat===c.id ? "var(--pu)" : "var(--border)",
              background: selectedCat===c.id ? "var(--pu-dim)" : "var(--card)",
              color: selectedCat===c.id ? "var(--pu-light)" : "var(--tx2)",
              cursor:"pointer", fontSize:12, fontWeight:500, whiteSpace:"nowrap",
              fontFamily:"DM Sans,sans-serif", transition:"all 0.15s"
            }}>{c.icon} {c.name}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px", color:"var(--tx2)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <div style={{ fontSize:18, fontWeight:600, color:"var(--tx1)", marginBottom:8 }}>No startups found</div>
          <div>Try adjusting your filters or search terms</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
          {filtered.map(s => <StartupCard key={s.id} s={s} onClick={setSelectedStartup}/>)}
        </div>
      )}
    </div>
  );
};

/* ─── HACKATHONS PAGE ─── */
const HackathonsPage = () => (
  <div style={{ maxWidth:1320, margin:"0 auto", padding:"40px 24px" }}>
    <div style={{ marginBottom:36 }}>
      <h1 style={{ fontSize:32, fontWeight:800, marginBottom:6 }}>Hackathons & Challenges</h1>
      <p style={{ color:"var(--tx2)", fontSize:14 }}>
        Global hackathons hosted by innovative startups — win prizes, build your portfolio, get hired.
      </p>
    </div>
    <div style={{ display:"grid", gap:20 }}>
      {HACKATHONS.map(h => (
        <div key={h.id} className="card-hover" style={{ background:"var(--card)",
          border:`1px solid var(--border)`, borderRadius:16, padding:24,
          borderLeft:`4px solid ${h.color}` }}>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            <Avatar initials={h.initials} color={h.color} size={56} radius={12}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                <div>
                  <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700 }}>{h.title}</h3>
                  <div style={{ fontSize:12, color:"var(--tx2)", marginTop:4 }}>
                    Hosted by <b style={{ color:"var(--tx1)" }}>{h.startup}</b> · {h.duration} · Deadline: {h.deadline}
                  </div>
                </div>
                <StatusDot status={h.status}/>
              </div>
              <p style={{ fontSize:13, color:"var(--tx1)", lineHeight:1.6, margin:"12px 0" }}>{h.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                {h.tags.map(t => <Badge key={t} color={h.color}>{t}</Badge>)}
              </div>
              <div style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"center",
                paddingTop:14, borderTop:"1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize:10, color:"var(--tx2)" }}>PRIZE POOL</div>
                  <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:22, fontWeight:800, color:"#34D399" }}>{h.prize}</div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"var(--tx2)", marginBottom:6 }}>PARTICIPANTS ({h.spots.toLocaleString()} / {h.maxSpots.toLocaleString()})</div>
                  <div style={{ height:6, borderRadius:3, background:"var(--bg3)", width:200, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${Math.round(h.spots/h.maxSpots*100)}%`,
                      background:h.color, borderRadius:3 }}/>
                  </div>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
                  <Btn variant="ghost" size="sm">Learn More</Btn>
                  <Btn variant="primary" size="sm">
                    {h.status==="Upcoming" ? "Set Reminder" : "Register Now →"}
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── OPPORTUNITIES PAGE ─── */
const OpportunitiesPage = () => {
  const [type, setType] = useState("All");
  const types = ["All","Internship","Full-Time","Contract"];
  const filtered = OPPORTUNITIES.filter(o => type==="All" || o.type===type);
  return (
    <div style={{ maxWidth:1320, margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:6 }}>Jobs & Internships</h1>
        <p style={{ color:"var(--tx2)", fontSize:14 }}>Opportunities from verified startups actively building the future</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {types.map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            padding:"8px 18px", borderRadius:20, border:"1px solid",
            borderColor: type===t ? "var(--pu)" : "var(--border)",
            background: type===t ? "var(--pu-dim)" : "var(--card)",
            color: type===t ? "var(--pu-light)" : "var(--tx2)",
            cursor:"pointer", fontSize:13, fontWeight:500, fontFamily:"DM Sans,sans-serif"
          }}>{t}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:12, color:"var(--tx2)", alignSelf:"center" }}>
          {filtered.length} positions
        </span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(o => (
          <Card key={o.id} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <Avatar initials={o.initials} color={o.color} size={48} radius={10}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:17, fontWeight:700 }}>{o.role}</div>
                  <div style={{ fontSize:12, color:"var(--tx2)", marginTop:3 }}>
                    {o.company} · {o.location} · {o.posted}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span className="chip" style={{ background: o.type==="Full-Time"?"rgba(52,211,153,0.1)":o.type==="Internship"?"rgba(124,110,250,0.1)":"rgba(249,115,22,0.1)",
                    color: o.type==="Full-Time"?"#34D399":o.type==="Internship"?"var(--pu-light)":"#F97316",
                    border:`1px solid ${o.type==="Full-Time"?"#34D39930":o.type==="Internship"?"var(--border-accent)":"rgba(249,115,22,0.3)"}` }}>
                    {o.type}
                  </span>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"10px 0" }}>
                {o.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                paddingTop:10, borderTop:"1px solid var(--border)" }}>
                <div style={{ display:"flex", gap:20, fontSize:12 }}>
                  <span><b style={{ color:"var(--tx0)" }}>{o.comp}</b> <span style={{ color:"var(--tx2)" }}>· {o.duration}</span></span>
                  <span style={{ color:"var(--tx2)" }}>{o.applicants} applicants</span>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn variant="ghost" size="sm">Save</Btn>
                  <Btn variant="primary" size="sm">Apply Now →</Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ─── SERVICES PAGE ─── */
const ServicesPage = () => (
  <div style={{ maxWidth:1320, margin:"0 auto", padding:"40px 24px" }}>
    <div style={{ textAlign:"center", marginBottom:48 }}>
      <div className="chip" style={{ background:"var(--pu-dim)", color:"var(--pu-light)",
        border:"1px solid var(--border-accent)", marginBottom:16, display:"inline-flex" }}>
        🏢 Centre of Excellence
      </div>
      <h1 style={{ fontSize:40, fontWeight:800, marginBottom:12 }}>Enterprise-Grade Services</h1>
      <p style={{ fontSize:16, color:"var(--tx1)", maxWidth:600, margin:"0 auto", lineHeight:1.7 }}>
        Acceleration-ready services from our global expert network. From MVP to market — we've got every function covered.
      </p>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:20 }}>
      {SERVICES.map(s => (
        <Card key={s.id} style={{ borderTop:`3px solid ${s.color}`, position:"relative" }}>
          {s.badge && <span className="chip" style={{ position:"absolute", top:16, right:16,
            background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}30`, fontSize:10 }}>
            {s.badge}</span>}
          <div style={{ fontSize:32, marginBottom:14, color:s.color }}>{s.icon}</div>
          <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:700, fontSize:19, marginBottom:8 }}>{s.name}</div>
          <p style={{ fontSize:13, color:"var(--tx1)", lineHeight:1.6, marginBottom:16 }}>{s.desc}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
            {s.items.map(i => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--tx1)" }}>
                <span style={{ color:s.color, width:16, textAlign:"center" }}>✓</span> {i}
              </div>
            ))}
          </div>
          <div style={{ paddingTop:16, borderTop:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:10, color:"var(--tx2)", marginBottom:2 }}>STARTING FROM</div>
              <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:18, fontWeight:800, color:s.color }}>{s.price}</div>
            </div>
            <Btn variant="outline" size="sm">Request Quote →</Btn>
          </div>
        </Card>
      ))}
    </div>
    <div style={{ marginTop:48, background:"var(--bg2)", borderRadius:20,
      padding:"40px 32px", border:"1px solid var(--border)", textAlign:"center" }}>
      <h2 style={{ fontSize:28, fontWeight:700, marginBottom:12 }}>Need a Custom Solution?</h2>
      <p style={{ color:"var(--tx1)", marginBottom:24, maxWidth:500, margin:"0 auto 24px" }}>
        Our enterprise team handles complex, multi-service engagements for growth-stage and enterprise startups.
      </p>
      <Btn variant="primary" size="lg">Book a Strategy Call →</Btn>
    </div>
  </div>
);

/* ─── ARCHITECTURE PAGE ─── */
const ArchitecturePage = () => {
  const sections = [
    { title:"System Architecture", icon:"🏗️", content:[
      { head:"Overview", text:"LaunchNexus is a dual-sided marketplace built as a distributed microservices system, designed to scale from 0 to millions of users. The platform uses event-driven architecture with an API Gateway routing to independent services, each with dedicated data stores." },
      { head:"Core Services", items:["Auth Service — JWT + OAuth (Google, LinkedIn, GitHub)","Startup Service — Profile CRUD, verification workflow, document management","Student Service — University linking, profile, skills","Hackathon Service — Event management, registration, submission scoring","Messaging Service — Real-time chat via Socket.io + message persistence","Search Service — Typesense full-text search with instant autocomplete","Notification Service — Email (SendGrid), Push (FCM), In-app notifications","Media Service — File uploads to S3, CDN via Cloudflare"] },
    ]},
    { title:"Tech Stack", icon:"⚙️", content:[
      { head:"Frontend", items:["Next.js 14 (App Router) — SSR + SSG for SEO-critical pages","TypeScript — Full type safety across frontend + backend","Tailwind CSS + shadcn/ui — Rapid UI with consistent design tokens","Zustand + React Query — Lightweight client state + async server state","Socket.io client — Real-time messaging and notifications","React Hook Form + Zod — Performant forms with runtime validation"] },
      { head:"Backend", items:["Node.js 20 + Fastify — High-throughput async API runtime","Prisma ORM — Type-safe DB access with automatic migrations","BullMQ + Redis — Job queues for emails, media processing, indexing","Typesense — Fast full-text search (self-hosted, <1M records)","Kong API Gateway — Rate limiting, auth middleware, service routing"] },
      { head:"Data Layer", items:["PostgreSQL 15 (primary) — All relational data","Redis 7 (cache + queues) — Sessions, hot data, job queues","AWS S3 + CloudFront — Document & media storage and CDN","Elasticsearch — Advanced analytics and complex search queries at scale"] },
    ]},
    { title:"Database Schema", icon:"🗄️", content:[
      { head:"Core Tables", items:["users — Base account (email, role, auth_provider, verification status)","startup_profiles — Full startup entity with stage, metrics, category, location","startup_documents — Verification docs with admin review workflow","startup_products — Product listings with screenshots and links","student_profiles — Student entity with university, skills, preferences","universities — Verified institution registry with email domain validation","categories / subcategories / sub_subcategories — 3-level taxonomy","hackathons — Events with prize structure, dates, registration limits","hackathon_registrations — Student ↔ hackathon many-to-many with team grouping","conversations + messages — Full chat system with participant tracking","opportunities — Job/internship listings with application tracking","startup_upvotes — Upvote system (composite PK prevents duplicates)","startup_feedback — Reviews with rating, verified flag","service_orders — COE service engagement tracking","notifications — Per-user notification queue"] },
    ]},
    { title:"API Design", icon:"🔌", content:[
      { head:"RESTful Endpoints", items:["POST /api/v1/auth/register · POST /auth/login · POST /auth/oauth/:provider","GET/POST /api/v1/startups · GET /startups/:slug · POST /startups/:id/upvote","POST /api/v1/startups/:id/documents (S3 presigned upload)","GET/POST /api/v1/hackathons · POST /hackathons/:id/register","GET/POST /api/v1/conversations · POST /conversations/:id/messages","WS /ws/conversations — Socket.io real-time namespace","GET/POST /api/v1/opportunities · POST /opportunities/:id/apply","GET /api/v1/search?q=&type= — Global full-text search","Admin: PUT /api/v1/admin/startups/:id/verify (approve/reject workflow)"] },
      { head:"Versioning", text:"All APIs versioned at /api/v1. Breaking changes introduce /api/v2 with a 6-month deprecation window. Changelogs maintained in OpenAPI 3.0 spec." },
    ]},
    { title:"UI Architecture", icon:"🖥️", content:[
      { head:"Page Structure", items:["Public (unauth): Landing, Discover, Startup Profile, Hackathons, Opportunities, Services","Auth flows: Login, Register (5-step Startup wizard, 3-step Student wizard)","Startup Dashboard: Overview, Profile Editor, Products, Hackathons, Opportunities, Messages, Analytics, Service Orders","Student Dashboard: Feed, Saved, My Hackathons, Applications, Messages, Profile","Admin Panel: Verification queue, Analytics, User management, Content moderation"] },
      { head:"State Management", items:["Server state: TanStack Query v5 (auto-caching, revalidation, optimistic updates)","Client state: Zustand stores (auth session, notification tray, message drafts)","Form state: React Hook Form (uncontrolled, performant, no re-renders)","Real-time state: Socket.io context for live message counts, online indicators"] },
    ]},
    { title:"Startup Registration Flow", icon:"📋", content:[
      { head:"5-Step Wizard", items:["Step 1 — Account Setup: Email, password, role (Founder / Team Member)","Step 2 — Company Status: Registered? (Yes → upload incorporation cert) or Not yet registered → select timeline","Step 3 — Startup Details: Name, tagline, description, founded year, team size, stage, raise, 3-level category selection","Step 4 — Products & Links: Product name/desc/URL, up to 5 screenshots, website, pitch deck, social links","Step 5 — Review & Submit: Preview profile → Accept T&C → Submit for admin verification → Status: Under Review (24-48h)"] },
    ]},
    { title:"Categories System", icon:"🏷️", content:[
      { head:"3-Level Taxonomy (10 Categories)", items:FULL_CATS.map(c => `${c.name}: ${c.subs.map(s=>s.name).join(", ")}`) },
    ]},
    { title:"Scalability & Infra", icon:"📈", content:[
      { head:"Scaling Strategy", items:["Horizontal scaling: Stateless services behind ALB, Kubernetes HPA rules","DB scaling: PgBouncer connection pooling, read replicas, sharding at 10M records","Cache: L1 Node.js LRU (5min) → L2 Redis (15min) → L3 Cloudflare CDN (24h)","Queue: BullMQ for async jobs (email, media resize, search indexing)","CDN: Cloudflare for all static assets + startup logo WebP optimization","Deploy: AWS EKS + Vercel (frontend) + GitHub Actions CI/CD"] },
      { head:"Security", items:["JWT 15-min access tokens + 7d refresh tokens in httpOnly cookies","Rate limiting: 100 req/min public, 1000 req/min authenticated (Kong)","File uploads: S3 presigned URLs, MIME validation, async virus scanning","Secrets: AWS Secrets Manager / Doppler — zero secrets in codebase","CORS whitelist, CSP headers, Zod input validation on all API routes"] },
    ]},
  ];
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:40 }}>
        <div className="chip" style={{ background:"var(--pu-dim)", color:"var(--pu-light)",
          border:"1px solid var(--border-accent)", marginBottom:16, display:"inline-flex" }}>
          📐 System Architecture Document v1.0
        </div>
        <h1 style={{ fontSize:38, fontWeight:800, marginBottom:12 }}>LaunchNexus Architecture</h1>
        <p style={{ fontSize:15, color:"var(--tx1)", lineHeight:1.7 }}>
          A production-ready, horizontally scalable microservices platform built for global startup discovery, student engagement, hackathon management, and enterprise service delivery.
        </p>
      </div>
      {sections.map(section => (
        <div key={section.title} style={{ marginBottom:36, background:"var(--card)",
          border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"18px 24px", borderBottom:"1px solid var(--border)",
            background:"var(--bg2)", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:20 }}>{section.icon}</span>
            <h2 style={{ fontSize:18, fontWeight:700 }}>{section.title}</h2>
          </div>
          <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:18 }}>
            {section.content.map(block => (
              <div key={block.head}>
                <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:600, fontSize:14,
                  color:"var(--pu-light)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {block.head}
                </div>
                {block.text && <p style={{ fontSize:13, color:"var(--tx1)", lineHeight:1.7 }}>{block.text}</p>}
                {block.items && (
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {block.items.map(item => (
                      <div key={item} style={{ display:"flex", gap:10, alignItems:"flex-start",
                        fontSize:13, color:"var(--tx1)", lineHeight:1.6 }}>
                        <span style={{ color:"var(--pu)", marginTop:2, fontSize:10, minWidth:14 }}>▸</span>
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
};

/* ─── STARTUP DETAIL MODAL ─── */
const StartupModal = ({ startup: s, onClose }) => {
  if (!s) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(8px)", zIndex:2000, overflow:"auto",
      display:"flex", justifyContent:"center", padding:"40px 16px" }}>
      <div style={{ background:"var(--bg1)", border:"1px solid var(--border)", borderRadius:20,
        width:"100%", maxWidth:720, height:"fit-content" }}>
        <div style={{ background:"linear-gradient(135deg, rgba(124,110,250,0.1), rgba(34,211,238,0.06))",
          padding:"32px 32px 24px", borderBottom:"1px solid var(--border)", borderRadius:"20px 20px 0 0",
          position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16,
            background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"50%",
            width:32, height:32, cursor:"pointer", color:"var(--tx1)", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <Avatar initials={s.initials} color={s.color} size={64} radius={14}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                <span style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:24, fontWeight:800 }}>{s.name}</span>
                {s.verified && <span style={{ fontSize:13, color:"var(--pu)", fontWeight:600 }}>✓ Verified</span>}
                {s.trending && <span className="chip" style={{ background:"rgba(252,211,77,0.12)",
                  color:"#FCD34D", border:"1px solid rgba(252,211,77,0.25)", fontSize:11 }}>🔥 Trending</span>}
              </div>
              <div style={{ fontSize:13, color:"var(--tx2)" }}>{s.flag} {s.location} · Founded {s.founded}</div>
              <div style={{ marginTop:8 }}><StageTag stage={s.stage}/></div>
            </div>
          </div>
        </div>
        <div style={{ padding:"24px 32px", display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:18, fontWeight:700,
              marginBottom:10 }}>{s.tagline}</h3>
            <p style={{ fontSize:14, color:"var(--tx1)", lineHeight:1.7 }}>{s.desc}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[["RAISED",s.raised,"#34D399"],["TEAM SIZE",`${s.team} people`,"var(--pu-light)"],
              ["UPVOTES",s.upvotes.toLocaleString(),"#FCD34D"],["VIEWS",s.views.toLocaleString(),"#22D3EE"]]
              .map(([l,v,c]) => (
                <div key={l} style={{ background:"var(--bg2)", borderRadius:10, padding:14, textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"var(--tx2)", marginBottom:4 }}>{l}</div>
                  <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:18, fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
          </div>
          <div>
            <div style={{ fontSize:12, color:"var(--tx2)", marginBottom:8 }}>TAGS</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {s.tags.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, paddingTop:8 }}>
            <Btn variant="primary" style={{ flex:1, justifyContent:"center" }}>↑ Upvote ({s.upvotes.toLocaleString()})</Btn>
            <Btn variant="outline" style={{ flex:1, justifyContent:"center" }}>💬 Send Message</Btn>
            <Btn variant="ghost" style={{ flex:1, justifyContent:"center" }}>🔗 Visit Website</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── REGISTER MODAL ─── */
const RegisterModal = ({ type, onClose }) => {
  const [step, setStep] = useState(1);
  const [isCompanyReg, setIsCompanyReg] = useState(null);
  const totalSteps = type === "startup" ? 5 : 3;
  const stepLabels = type === "startup"
    ? ["Account","Company","Details","Products","Review"]
    : ["Account","University","Profile"];

  const Field = ({ label, placeholder, type: t = "text", options }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>{label}</label>
      {options ? (
        <select>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={t} placeholder={placeholder}/>
      )}
    </div>
  );

  const renderStartupStep = () => {
    if (step === 1) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Create Your Account</h3>
        <Field label="Full Name" placeholder="John Smith"/>
        <Field label="Work Email" placeholder="john@startup.com" type="email"/>
        <Field label="Password" placeholder="Min. 8 characters" type="password"/>
        <Field label="Your Role" options={["Founder / CEO","Co-Founder","CTO","CMO","Business Development","Team Member"]}/>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <span style={{ fontSize:11, color:"var(--tx2)" }}>Or sign up with</span>
          {["Google","LinkedIn","GitHub"].map(p => (
            <button key={p} style={{ padding:"4px 12px", background:"var(--bg2)",
              border:"1px solid var(--border)", borderRadius:6, color:"var(--tx1)",
              cursor:"pointer", fontSize:11, fontFamily:"DM Sans,sans-serif" }}>{p}</button>
          ))}
        </div>
      </div>
    );
    if (step === 2) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:8 }}>Company Registration Status</h3>
        <p style={{ fontSize:13, color:"var(--tx2)", marginBottom:20 }}>Tell us about your company's legal status so we can verify your listing.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {[
            ["yes","✅ Yes — Company is legally registered"],
            ["no","⏳ Not yet — We plan to register within 12 months"],
          ].map(([v, l]) => (
            <div key={v} onClick={() => setIsCompanyReg(v)}
              style={{ padding:"14px 16px", border:`1px solid ${isCompanyReg===v?"var(--pu)":"var(--border)"}`,
                borderRadius:10, cursor:"pointer",
                background: isCompanyReg===v ? "var(--pu-dim)" : "var(--bg2)",
                fontSize:14, color: isCompanyReg===v ? "var(--pu-light)" : "var(--tx1)", transition:"all 0.15s" }}>
              {l}
            </div>
          ))}
        </div>
        {isCompanyReg === "yes" && (
          <div style={{ padding:16, background:"var(--bg2)", borderRadius:10, border:"1px solid var(--border)" }}>
            <Field label="Country of Incorporation" options={["United States","United Kingdom","India","Singapore","UAE","Germany","Canada","Australia","Other"]}/>
            <Field label="Company Registration Number" placeholder="e.g. 12345678"/>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>
                Upload Incorporation Certificate
              </label>
              <div style={{ border:"2px dashed var(--border)", borderRadius:8, padding:"24px 16px",
                textAlign:"center", color:"var(--tx2)", fontSize:12, cursor:"pointer",
                background:"var(--bg3)", transition:"border-color 0.15s" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>📎</div>
                Drop PDF / JPG here or <span style={{ color:"var(--pu-light)" }}>browse</span>
                <div style={{ marginTop:4, fontSize:10 }}>Max 10MB · PDF, JPG, PNG</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
    if (step === 3) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Startup Details</h3>
        <Field label="Startup Name" placeholder="Your startup's name"/>
        <Field label="Tagline (max 120 chars)" placeholder="One sentence that explains what you do"/>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>Description</label>
          <textarea placeholder="Tell us about your startup — problem, solution, traction, vision..."
            style={{ height:90, resize:"vertical" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Founded Year" placeholder="2023"/>
          <Field label="Team Size" placeholder="12"/>
          <Field label="Stage" options={STAGES}/>
          <Field label="Total Raised" placeholder="$500K"/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Category" options={FULL_CATS.map(c => c.name)}/>
          <Field label="Country" placeholder="USA"/>
        </div>
      </div>
    );
    if (step === 4) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Products & Links</h3>
        <Field label="Product Name" placeholder="Your main product's name"/>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>Product Description</label>
          <textarea placeholder="Describe what your product does..." style={{ height:70, resize:"vertical" }}/>
        </div>
        <Field label="Product URL" placeholder="https://app.yourstartup.com" type="url"/>
        <Field label="Company Website" placeholder="https://yourstartup.com" type="url"/>
        <Field label="Pitch Deck URL" placeholder="https://drive.google.com/..." type="url"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="LinkedIn" placeholder="linkedin.com/company/..."/>
          <Field label="Twitter / X" placeholder="@yourstartup"/>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>
            Product Screenshots (up to 5)
          </label>
          <div style={{ border:"2px dashed var(--border)", borderRadius:8, padding:"16px",
            textAlign:"center", color:"var(--tx2)", fontSize:12, cursor:"pointer", background:"var(--bg3)" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>🖼️</div>
            Drop images here or <span style={{ color:"var(--pu-light)" }}>browse</span>
          </div>
        </div>
      </div>
    );
    if (step === 5) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:8 }}>Review & Submit</h3>
        <p style={{ fontSize:13, color:"var(--tx1)", marginBottom:20, lineHeight:1.6 }}>
          Your startup listing will go live after our team reviews and verifies your submission (typically within 24–48 hours). You'll receive email updates throughout the process.
        </p>
        <div style={{ background:"var(--bg2)", borderRadius:12, padding:20,
          border:"1px solid var(--border)", marginBottom:20 }}>
          {[["Status","Under Review after submission"],["Verification","24–48 hours"],
            ["Notification","Email at every stage"],["Listing","Public on approval"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
              borderBottom:"1px solid var(--border)", fontSize:13 }}>
              <span style={{ color:"var(--tx2)" }}>{k}</span>
              <span style={{ color:"var(--tx0)", fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:16, background:"rgba(52,211,153,0.06)", borderRadius:10,
          border:"1px solid rgba(52,211,153,0.2)", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16 }}>✅</span>
          <div style={{ fontSize:12, color:"#34D399", lineHeight:1.6 }}>
            By submitting, you agree to LaunchNexus Terms of Service and confirm all information provided is accurate. False information may result in permanent removal.
          </div>
        </div>
      </div>
    );
  };

  const renderStudentStep = () => {
    if (step === 1) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Create Student Account</h3>
        <Field label="Full Name" placeholder="Your full name"/>
        <Field label="University Email" placeholder="name@university.edu" type="email"/>
        <Field label="Password" placeholder="Min. 8 characters" type="password"/>
        <Field label="Country" placeholder="India"/>
      </div>
    );
    if (step === 2) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>University Details</h3>
        <Field label="University / College Name" placeholder="Search your university..."/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Degree" options={["Bachelor's","Master's","PhD","Diploma","Associate"]}/>
          <Field label="Graduation Year" placeholder="2026"/>
        </div>
        <Field label="Major / Field of Study" placeholder="Computer Science"/>
      </div>
    );
    if (step === 3) return (
      <div>
        <h3 style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>Your Profile</h3>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12, color:"var(--tx2)", marginBottom:6, fontWeight:500 }}>Bio</label>
          <textarea placeholder="Tell startups about yourself — what you're building, interested in, or looking for..." style={{ height:80, resize:"vertical" }}/>
        </div>
        <Field label="Skills (comma separated)" placeholder="Python, React, Machine Learning, Product Design"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="GitHub URL" placeholder="github.com/username"/>
          <Field label="LinkedIn URL" placeholder="linkedin.com/in/username"/>
        </div>
        <Field label="Portfolio / Website" placeholder="yourportfolio.com"/>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
          <input type="checkbox" id="openwork" style={{ width:"auto", accentColor:"var(--pu)" }}/>
          <label htmlFor="openwork" style={{ fontSize:13, color:"var(--tx1)", cursor:"pointer" }}>
            I'm open to internship and job opportunities
          </label>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(10px)", zIndex:2000, display:"flex",
      alignItems:"center", justifyContent:"center", padding:16, overflow:"auto" }}>
      <div style={{ background:"var(--bg1)", border:"1px solid var(--border)", borderRadius:20,
        width:"100%", maxWidth:520, maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ padding:"24px 28px", borderBottom:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontSize:18, fontWeight:700 }}>
              {type === "startup" ? "🚀 List Your Startup" : "🎓 Join as Student"}
            </div>
            <div style={{ fontSize:12, color:"var(--tx2)", marginTop:2 }}>
              Step {step} of {totalSteps} — {stepLabels[step - 1]}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"var(--bg2)", border:"1px solid var(--border)",
            borderRadius:"50%", width:30, height:30, cursor:"pointer",
            color:"var(--tx1)", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:"4px 28px 12px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", gap:4, padding:"12px 0" }}>
            {Array.from({length:totalSteps}).map((_, i) => (
              <div key={i} style={{ flex:1, height:3, borderRadius:2,
                background: i < step ? "var(--pu)" : "var(--bg3)",
                transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ display:"flex", gap:0 }}>
            {stepLabels.map((l, i) => (
              <div key={l} style={{ flex:1, fontSize:9, color: i < step ? "var(--pu-light)" : "var(--tx2)",
                textAlign:"center", fontWeight: i === step-1 ? 600 : 400 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          {type === "startup" ? renderStartupStep() : renderStudentStep()}
        </div>
        <div style={{ padding:"16px 28px 24px", borderTop:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between" }}>
          <Btn variant="ghost" onClick={() => step > 1 ? setStep(s => s-1) : onClose()}>
            {step > 1 ? "← Back" : "Cancel"}
          </Btn>
          <Btn variant="primary" onClick={() => step < totalSteps ? setStep(s => s+1) : onClose()}>
            {step === totalSteps ? (type === "startup" ? "Submit for Review ✓" : "Complete Registration ✓") : "Continue →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ─── FOOTER ─── */
const Footer = ({ setPage }) => (
  <footer style={{ background:"var(--bg1)", borderTop:"1px solid var(--border)", padding:"50px 24px 24px" }}>
    <div style={{ maxWidth:1320, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:32, marginBottom:48, flexWrap:"wrap" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"var(--pu)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⬡</div>
            <span style={{ fontFamily:"Bricolage Grotesque,sans-serif", fontWeight:800, fontSize:16,
              background:"linear-gradient(90deg,#7C6EFA,#22D3EE)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              LaunchNexus</span>
          </div>
          <p style={{ fontSize:13, color:"var(--tx2)", lineHeight:1.7, maxWidth:240 }}>
            The global platform connecting startups, students, and enterprise services to accelerate innovation.
          </p>
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            {["Twitter","LinkedIn","GitHub","Discord"].map(s => (
              <button key={s} style={{ padding:"5px 10px", background:"var(--bg2)",
                border:"1px solid var(--border)", borderRadius:6, color:"var(--tx2)",
                cursor:"pointer", fontSize:11, fontFamily:"DM Sans,sans-serif" }}>{s}</button>
            ))}
          </div>
        </div>
        {[
          { title:"Platform", links:["Discover Startups","Hackathons","Opportunities","COE Services"] },
          { title:"Startups", links:["Submit Startup","Verification","Dashboard","Analytics"] },
          { title:"Students", links:["Join Platform","Find Internships","Hackathons","University Portal"] },
          { title:"Company", links:["About Us","Careers","Blog","Contact"] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontWeight:600, fontSize:13, color:"var(--tx0)", marginBottom:12 }}>{col.title}</div>
            {col.links.map(l => (
              <div key={l} style={{ fontSize:12, color:"var(--tx2)", marginBottom:8, cursor:"pointer",
                transition:"color 0.15s" }}
                onMouseEnter={e => e.target.style.color="var(--pu-light)"}
                onMouseLeave={e => e.target.style.color="var(--tx2)"}>
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ paddingTop:24, borderTop:"1px solid var(--border)",
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div style={{ fontSize:12, color:"var(--tx2)" }}>
          © 2025 LaunchNexus Global Ltd. · All rights reserved
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
            <span key={l} style={{ fontSize:12, color:"var(--tx2)", cursor:"pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─── MAIN APP ─── */
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showReg, setShowReg] = useState(false);
  const [regType, setRegType] = useState("startup");

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg0)" }}>
      <GlobalStyles/>
      <NavBar page={page} setPage={setPage} setShowReg={setShowReg} setRegType={setRegType}/>
      {page === "home" && (
        <>
          <Hero setPage={setPage} setShowReg={setShowReg} setRegType={setRegType}/>
          <StatsBar/>
          <CategorySection selected={selectedCat} setSelected={setSelectedCat} setPage={setPage}/>
          <StartupsSection setSelectedStartup={setSelectedStartup}/>
          <HackathonSpotlight setPage={setPage}/>
          <StudentSection setShowReg={setShowReg} setRegType={setRegType}/>
          <ServicesSection setPage={setPage}/>
          <Footer setPage={setPage}/>
        </>
      )}
      {page === "discover" && (
        <DiscoverPage selectedCat={selectedCat} setSelectedCat={setSelectedCat} setSelectedStartup={setSelectedStartup}/>
      )}
      {page === "hackathons" && <HackathonsPage/>}
      {page === "opportunities" && <OpportunitiesPage/>}
      {page === "services" && <ServicesPage/>}
      {page === "architecture" && <ArchitecturePage/>}
      {selectedStartup && <StartupModal startup={selectedStartup} onClose={() => setSelectedStartup(null)}/>}
      {showReg && <RegisterModal type={regType} onClose={() => setShowReg(false)}/>}
    </div>
  );
}
