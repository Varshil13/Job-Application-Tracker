import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal-primary: #1a9e8f;
    --teal-dark: #0d7a6e;
    --teal-light: #22b5a4;
    --teal-glow: rgba(26,158,143,0.18);
    --bg-panel: #0e1e1c;
    --bg-card: #112421;
    --bg-right: #0b1a18;
    --text-primary: #e8f5f3;
    --text-muted: #7ab5ae;
    --text-dim: #4d8a82;
    --border: rgba(26,158,143,0.22);
    --border-focus: rgba(26,158,143,0.7);
    --input-bg: #0d1f1d;
    --white: #ffffff;
    --shadow-card: 0 24px 64px rgba(0,0,0,0.5);
    --radius: 14px;
    --radius-sm: 8px;
    --font-head: 'Sora', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg-panel);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-wrapper {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 20% 50%, rgba(26,158,143,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(13,122,110,0.05) 0%, transparent 50%),
                #0a1412;
    padding: 24px;
  }

  .auth-card {
    width: 100%;
    max-width: 980px;
    min-height: 600px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: var(--shadow-card), 0 0 0 1px var(--border);
    position: relative;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── LEFT PANEL ── */
  .auth-left {
    background: #0e1e1c;
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 0% 0%, rgba(26,158,143,0.06) 0%, transparent 60%);
    pointer-events: none;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--teal-primary), var(--teal-dark));
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    color: white;
    font-family: var(--font-head);
    box-shadow: 0 4px 16px rgba(26,158,143,0.35);
  }

  .logo-name {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .auth-form-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32px 0;
  }

  .auth-heading {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .auth-subheading {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  /* Tabs */
  .tab-row {
    display: flex;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 4px;
    margin-bottom: 28px;
    gap: 4px;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.22s ease;
    background: transparent;
    color: var(--text-dim);
  }

  .tab-btn.active {
    background: linear-gradient(135deg, var(--teal-primary), var(--teal-dark));
    color: white;
    box-shadow: 0 2px 12px rgba(26,158,143,0.3);
  }

  /* Form */
  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 7px;
    letter-spacing: 0.01em;
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    color: var(--text-dim);
    font-size: 15px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .form-input {
    width: 100%;
    padding: 12px 14px 12px 40px;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: var(--text-dim); }

  .form-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(26,158,143,0.12);
  }

  .form-input:focus + .input-icon,
  .input-wrap:focus-within .input-icon {
    color: var(--teal-primary);
  }

  .eye-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-dim);
    font-size: 15px;
    padding: 2px;
    transition: color 0.2s;
  }

  .eye-btn:hover { color: var(--teal-primary); }

  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 13px;
  }

  .remember-wrap {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
  }

  .remember-wrap input[type="checkbox"] {
    accent-color: var(--teal-primary);
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  .forgot-link {
    color: var(--teal-light);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .forgot-link:hover { opacity: 0.75; }

  .btn-primary {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, var(--teal-primary) 0%, var(--teal-dark) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    box-shadow: 0 4px 20px rgba(26,158,143,0.35);
    letter-spacing: 0.01em;
    margin-bottom: 20px;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(26,158,143,0.45);
    opacity: 0.93;
  }

  .btn-primary:active { transform: translateY(0); }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    color: var(--text-dim);
    font-size: 13px;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Social */
  .social-row {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .social-btn {
    flex: 1;
    padding: 10px 8px;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-weight: 500;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    text-decoration: none;
  }

  .social-btn:hover {
    border-color: var(--teal-primary);
    background: rgba(26,158,143,0.07);
    color: var(--text-primary);
  }

  .social-btn svg { flex-shrink: 0; }

  .auth-footer {
    font-size: 11.5px;
    color: var(--text-dim);
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  .auth-footer a {
    color: var(--text-dim);
    text-decoration: none;
    transition: color 0.2s;
  }

  .auth-footer a:hover { color: var(--teal-light); }

  /* ── RIGHT PANEL ── */
  .auth-right {
    background: linear-gradient(160deg, #0d2825 0%, #091a17 60%, #051210 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 40px 36px 48px;
    position: relative;
    overflow: hidden;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,158,143,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,158,143,0.06) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .float-cards {
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    width: 88%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: floatCards 6s ease-in-out infinite alternate;
  }

  @keyframes floatCards {
    from { transform: translateX(-50%) translateY(0px); }
    to   { transform: translateX(-50%) translateY(-12px); }
  }

  .mini-card {
    background: rgba(20,44,40,0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(26,158,143,0.22);
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .mini-card-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--teal-light);
    margin-bottom: 2px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .mini-card-value {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    margin-bottom: 10px;
  }

  .donut-row {
    display: flex;
    gap: 14px;
    align-items: center;
  }

  .donut-svg { width: 54px; height: 54px; }

  .legend { display: flex; flex-direction: column; gap: 5px; font-size: 11px; color: var(--text-muted); }
  .legend-dot {
    width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px;
  }

  .alloc-rows { display: flex; flex-direction: column; gap: 7px; }

  .alloc-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-muted);
    align-items: center;
  }

  .alloc-name { color: var(--text-primary); font-weight: 500; }

  .alloc-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 20px;
  }

  .badge-green { background: rgba(34,181,164,0.15); color: #22b5a4; }

  .right-brand {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    z-index: 2;
  }

  .brand-icon-large {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, var(--teal-primary), var(--teal-dark));
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700;
    color: white; font-family: var(--font-head);
    box-shadow: 0 8px 32px rgba(26,158,143,0.4);
  }

  .right-tagline {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    line-height: 1.3;
    letter-spacing: -0.3px;
  }

  .right-sub {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.6;
    max-width: 280px;
  }

  .slide-dots {
    display: flex; gap: 6px; margin-top: 4px;
  }

  .dot {
    width: 22px; height: 5px; border-radius: 3px;
    background: rgba(26,158,143,0.35); transition: background 0.3s;
  }

  .dot.active { background: var(--teal-primary); }

  /* Name row for sign up */
  .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  @media (max-width: 768px) {
    .auth-card { grid-template-columns: 1fr; max-width: 420px; }
    .auth-right { display: none; }
    .auth-left { padding: 36px 28px; }
  }
`;

/* ── SVG Icons ── */
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconEye = ({ off }) => off ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

/* Social icons */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
);

/* ── Right Panel Visuals ── */
function RightPanel() {
  return (
    <div className="auth-right">
      <div className="grid-overlay" />

      <div className="float-cards">
        {/* Financial Plan Card */}
        <div className="mini-card">
          <div className="mini-card-title">Financial Plan</div>
          <div className="mini-card-value">$2,005.45 <span style={{fontSize:11,color:'#22b5a4',fontWeight:400}}>Available</span></div>
          <div className="donut-row">
            <svg className="donut-svg" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="22" fill="none" stroke="#1a2e2b" strokeWidth="10"/>
              <circle cx="30" cy="30" r="22" fill="none" stroke="#1a9e8f" strokeWidth="10"
                strokeDasharray="69 69" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 30 30)"/>
              <circle cx="30" cy="30" r="22" fill="none" stroke="#f59e0b" strokeWidth="10"
                strokeDasharray="35 103" strokeDashoffset="-69" strokeLinecap="round" transform="rotate(-90 30 30)"/>
              <circle cx="30" cy="30" r="22" fill="none" stroke="#3b82f6" strokeWidth="10"
                strokeDasharray="34 104" strokeDashoffset="-104" strokeLinecap="round" transform="rotate(-90 30 30)"/>
            </svg>
            <div className="legend">
              <div><span className="legend-dot" style={{background:'#1a9e8f'}}/>Budgeted Expenses</div>
              <div><span className="legend-dot" style={{background:'#f59e0b'}}/>Additional Spending</div>
              <div><span className="legend-dot" style={{background:'#3b82f6'}}/>In Stock</div>
            </div>
          </div>
        </div>

        {/* Capital Allocations Card */}
        <div className="mini-card">
          <div className="mini-card-title">Capital Allocations</div>
          <div className="mini-card-value" style={{fontSize:18}}>$17,366.00</div>
          <div className="alloc-rows">
            {[
              ["iPhone 15 Pro Max", "$1900", "+3.8%"],
              ["Gree Air Conditioner", "$700", "+25%"],
              ["TVS Apache RTR Bike", "$1400", "+4.2%"],
            ].map(([name, val, pct]) => (
              <div className="alloc-row" key={name}>
                <span className="alloc-name">{name}</span>
                <span>{val}</span>
                <span className="alloc-badge badge-green">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-brand">
        <div className="brand-icon-large">⁑</div>
        <div className="right-tagline">A Unified Hub for Smarter<br/>Financial Decision-Making</div>
        <div className="right-sub">Empowering you with a unified financial command center — delivering deep insights and a 360° view.</div>
        <div className="slide-dots">
          <div className="dot active"/><div className="dot"/><div className="dot"/>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AuthPages() {
  const [tab, setTab] = useState("signin");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* LEFT */}
          <div className="auth-left">
            <a href="#" className="logo">
              <div className="logo-icon">⁑</div>
              <span className="logo-name">DashDark X</span>
            </a>

            <div className="auth-form-area">
              <h1 className="auth-heading">
                {tab === "signin" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="auth-subheading">
                {tab === "signin"
                  ? "Sign in to continue to your dashboard."
                  : "Start your experience — it's free to get started."}
              </p>

              <div className="tab-row">
                <button className={`tab-btn${tab==="signin"?" active":""}`} onClick={()=>setTab("signin")}>Sign In</button>
                <button className={`tab-btn${tab==="signup"?" active":""}`} onClick={()=>setTab("signup")}>Sign Up</button>
              </div>

              {tab === "signup" && (
                <div className="name-row">
                  <div className="form-group">
                    <label className="form-label">First Name <span style={{color:'#e05555'}}>*</span></label>
                    <div className="input-wrap">
                      <span className="input-icon"><IconUser/></span>
                      <input className="form-input" type="text" placeholder="John"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name <span style={{color:'#e05555'}}>*</span></label>
                    <div className="input-wrap">
                      <span className="input-icon"><IconUser/></span>
                      <input className="form-input" type="text" placeholder="Carter"/>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address <span style={{color:'#e05555'}}>*</span></label>
                <div className="input-wrap">
                  <span className="input-icon"><IconMail/></span>
                  <input className="form-input" type="email" placeholder="Enter your email address"/>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password <span style={{color:'#e05555'}}>*</span></label>
                <div className="input-wrap">
                  <span className="input-icon"><IconLock/></span>
                  <input className="form-input" type={showPass?"text":"password"} placeholder="Enter your password"/>
                  <button className="eye-btn" onClick={()=>setShowPass(p=>!p)} type="button">
                    <IconEye off={showPass}/>
                  </button>
                </div>
              </div>

              {tab === "signup" && (
                <div className="form-group">
                  <label className="form-label">Confirm Password <span style={{color:'#e05555'}}>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon"><IconLock/></span>
                    <input className="form-input" type={showConfirm?"text":"password"} placeholder="Confirm your password"/>
                    <button className="eye-btn" onClick={()=>setShowConfirm(p=>!p)} type="button">
                      <IconEye off={showConfirm}/>
                    </button>
                  </div>
                </div>
              )}

              {tab === "signin" && (
                <div className="form-row">
                  <label className="remember-wrap">
                    <input type="checkbox"/>
                    Remember me
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button className="btn-primary">
                {tab === "signin" ? "Sign In →" : "Create Account →"}
              </button>

              <div className="divider">Or continue with</div>

              <div className="social-row">
                <button className="social-btn"><GoogleIcon/> Google</button>
                <button className="social-btn"><AppleIcon/> Apple</button>
                <button className="social-btn"><FacebookIcon/></button>
                <button className="social-btn"><XIcon/></button>
              </div>
            </div>

            <div className="auth-footer">
              <span>Copyright · DashDark X, All Rights Reserved</span>
              <div style={{display:'flex',gap:12}}>
                <a href="#">Terms &amp; Conditions</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <RightPanel/>
        </div>
      </div>
    </>
  );
}