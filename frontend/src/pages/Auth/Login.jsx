import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/authAPI";
import { isTokenExpired } from "../../utils/sessionManager";

/* ─── Injected CSS ──────────────────────────────────────────────────── */
const LOGIN_CSS = `
  @keyframes ckzFadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ckzFadeLeft { from { opacity:0; transform:translateX(-22px); } to { opacity:1; transform:translateX(0); } }
  @keyframes ckzSpin     { to { transform:rotate(360deg); } }
  @keyframes ckzFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes ckzPulse    { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.7);opacity:0} }
  @keyframes ckzGlow     { 0%,100%{opacity:.18} 50%{opacity:.32} }

  .ckz-lw *       { box-sizing:border-box; margin:0; padding:0; }
  .ckz-lw         { min-height:100vh; display:flex; font-family:'Inter',system-ui,-apple-system,sans-serif; background:#f8fafc; }

  /* ── LEFT PANEL ── */
  .ckz-left {
    width:48%; min-height:100vh;
    background:linear-gradient(155deg,#0d0d0d 0%,#1a0808 45%,#1c0d05 100%);
    position:relative; overflow:hidden;
    display:flex; flex-direction:column; padding:48px 52px 44px;
  }
  .ckz-blob1 {
    position:absolute; width:380px; height:380px; border-radius:50%;
    background:radial-gradient(circle,rgba(217,30,24,.22) 0%,transparent 70%);
    top:-80px; right:-80px; pointer-events:none; animation:ckzGlow 4s ease infinite;
  }
  .ckz-blob2 {
    position:absolute; width:280px; height:280px; border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.16) 0%,transparent 70%);
    bottom:80px; left:-60px; pointer-events:none; animation:ckzGlow 4s 2s ease infinite;
  }
  .ckz-dots {
    position:absolute; inset:0; pointer-events:none;
    background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);
    background-size:26px 26px;
  }

  .ckz-brand          { display:flex; align-items:center; gap:12px; animation:ckzFadeLeft .65s ease both; position:relative; z-index:1; }
  .ckz-brand img      { height:40px; }
  .ckz-brand-name     { color:#fff; font-size:21px; font-weight:800; letter-spacing:-.4px; }
  .ckz-brand-name em  { color:#D91E18; font-style:normal; }

  .ckz-sub-label { color:rgba(255,255,255,.35); font-size:10px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; margin-top:2px; }

  .ckz-hero       { margin-top:56px; position:relative; z-index:1; animation:ckzFadeUp .7s .1s ease both; }
  .ckz-hero h1    { color:#fff; font-size:36px; font-weight:800; line-height:1.2; margin-bottom:16px; }
  .ckz-hero h1 em { font-style:normal; color:#F97316; }
  .ckz-hero p     { color:rgba(255,255,255,.48); font-size:14.5px; line-height:1.7; }
  .ckz-hero p strong { color:#D91E18; font-weight:700; }

  .ckz-features      { margin-top:44px; display:flex; flex-direction:column; gap:22px; position:relative; z-index:1; animation:ckzFadeUp .7s .22s ease both; }
  .ckz-feature       { display:flex; align-items:flex-start; gap:16px; }
  .ckz-feat-ico      { width:44px; height:44px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(217,30,24,.13); border:1px solid rgba(217,30,24,.22); }
  .ckz-feat-ico i    { color:#D91E18; font-size:20px; }
  .ckz-feat-body h4  { color:#fff; font-size:14px; font-weight:700; margin-bottom:3px; }
  .ckz-feat-body p   { color:rgba(255,255,255,.4); font-size:12.5px; line-height:1.5; }

  .ckz-trust         { margin-top:auto; padding-top:40px; position:relative; z-index:1; animation:ckzFadeUp .7s .35s ease both; }
  .ckz-trust-card    { background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.09); border-radius:18px; padding:16px 20px; display:flex; align-items:center; gap:16px; backdrop-filter:blur(6px); }
  .ckz-avatars       { display:flex; }
  .ckz-av            { width:32px; height:32px; border-radius:50%; border:2.5px solid #1a0808; background:linear-gradient(135deg,#D91E18,#F97316); font-size:11px; font-weight:800; color:#fff; display:flex; align-items:center; justify-content:center; margin-left:-9px; }
  .ckz-avatars .ckz-av:first-child { margin-left:0; }
  .ckz-trust-text h5 { color:#fff; font-size:13.5px; font-weight:700; margin-bottom:2px; }
  .ckz-trust-text p  { color:rgba(255,255,255,.4); font-size:11.5px; }

  /* ── RIGHT PANEL ── */
  .ckz-right {
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:40px 32px; background:#fff; position:relative;
  }
  .ckz-right::before {
    content:""; position:absolute; top:0; left:0; right:0; height:200px;
    background:linear-gradient(180deg,rgba(217,30,24,.045) 0%,transparent 100%);
    pointer-events:none;
  }
  /* decorative corner ring */
  .ckz-ring {
    position:absolute; top:28px; right:28px;
    width:48px; height:48px; border-radius:50%;
    border:2px solid rgba(217,30,24,.14);
    pointer-events:none;
  }
  .ckz-ring::after {
    content:""; position:absolute; inset:-8px; border-radius:50%;
    border:2px solid rgba(249,115,22,.08);
  }

  .ckz-form-box  { width:100%; max-width:420px; animation:ckzFadeUp .75s .08s ease both; position:relative; z-index:1; }

  .ckz-tag       { font-size:13px; font-weight:700; color:#D91E18; letter-spacing:.3px; margin-bottom:10px; }
  .ckz-title     { font-size:27px; font-weight:800; color:#111; margin-bottom:7px; }
  .ckz-sub       { font-size:14px; color:#9ca3af; margin-bottom:34px; }

  .ckz-field     { margin-bottom:20px; }
  .ckz-label     { display:block; font-size:13.5px; font-weight:600; color:#374151; margin-bottom:8px; }
  .ckz-inp-wrap  { position:relative; display:flex; align-items:center; }
  .ckz-inp-ico   { position:absolute; left:14px; color:#c4c9d4; font-size:16px; pointer-events:none; transition:color .2s; }
  .ckz-inp       {
    width:100%; padding:13px 14px 13px 42px;
    border:1.5px solid #ede9e0; border-radius:12px;
    font-size:14px; color:#1A1A1A; background:#fff;
    outline:none !important; transition:border-color .22s,box-shadow .22s;
  }
  .ckz-inp:focus, .ckz-inp:focus-visible {
    border-color:#F97316 !important;
    box-shadow:0 0 0 3.5px rgba(249,115,22,0.14) !important;
    outline:none !important;
  }
  .ckz-inp:focus + .ckz-inp-ico,
  .ckz-inp-wrap:focus-within .ckz-inp-ico { color:#F97316; }
  .ckz-inp::placeholder    { color:#c4c9d4; }
  .ckz-inp-pr              { padding-right:44px !important; }
  .ckz-eye-btn             { position:absolute; right:13px; background:none; border:none; cursor:pointer; color:#9ca3af; padding:2px; font-size:17px; transition:color .2s; line-height:1; display:flex; align-items:center; }
  .ckz-eye-btn:hover       { color:#D91E18; }

  .ckz-meta      { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
  .ckz-check     { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13.5px; color:#374151; font-weight:500; user-select:none; }
  .ckz-check input { width:16px; height:16px; accent-color:#D91E18; cursor:pointer; }
  .ckz-forgot    { font-size:13.5px; font-weight:600; color:#D91E18; text-decoration:none; transition:opacity .18s; }
  .ckz-forgot:hover { opacity:.7; }

  .ckz-btn       {
    width:100%; padding:14px;
    background:linear-gradient(135deg,#D91E18 0%,#F97316 100%);
    border:none; border-radius:12px; color:#fff;
    font-size:15px; font-weight:700; letter-spacing:.3px; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow:0 4px 18px rgba(217,30,24,.38);
    transition:transform .18s,box-shadow .18s,opacity .18s;
    position:relative; overflow:hidden;
  }
  .ckz-btn::after  {
    content:""; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.15) 50%,transparent 100%);
    transform:translateX(-100%); transition:transform .45s ease;
  }
  .ckz-btn:hover:not(:disabled)::after { transform:translateX(100%); }
  .ckz-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 26px rgba(217,30,24,.44); }
  .ckz-btn:active:not(:disabled) { transform:translateY(0); }
  .ckz-btn:disabled { opacity:.72; cursor:not-allowed; }
  .ckz-arrow       { font-size:18px; transition:transform .22s; }
  .ckz-btn:hover:not(:disabled) .ckz-arrow { transform:translateX(5px); }

  .ckz-spinner   { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:ckzSpin .7s linear infinite; flex-shrink:0; }

  .ckz-copy { margin-top:38px; text-align:center; font-size:12px; color:#6b7280; line-height:1.7; }

  /* Responsive */
  @media (max-width:900px) { .ckz-left { width:44%; padding:36px 32px; } .ckz-hero h1 { font-size:28px; } }
  @media (max-width:680px) { .ckz-left { display:none; } .ckz-right { padding:32px 20px; } }
`;

/* ─── Feature list ─────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "bx-receipt",        title: "Fast Billing",      desc: "Lightning fast billing experience"  },
  { icon: "bx-bar-chart-alt-2",title: "Real-time Reports", desc: "Track sales and performance live"   },
  { icon: "bx-shield-alt-2",   title: "Secure & Reliable", desc: "Your data is always protected"      },
];

/* ─── Component ────────────────────────────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ckz-login-style";
    el.textContent = LOGIN_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser({ email: form.email, password: form.password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success(res.message || "Login successful!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ckz-lw">

      {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
      <div className="ckz-left">
        <div className="ckz-blob1" />
        <div className="ckz-blob2" />
        <div className="ckz-dots"  />

        {/* Brand */}
        <div className="ckz-brand">
          <img src="/assets/images/logo-1.png" alt="Chickoz" />
          <div>
            <div className="ckz-brand-name">CHICK<em>OZ</em></div>
            <div className="ckz-sub-label">POS System</div>
          </div>
        </div>

        {/* Hero */}
        <div className="ckz-hero">
          <h1>Smarter Billing.<br />Better <em>Business.</em></h1>
          <p>Manage orders, track sales, and grow<br />your restaurant with <strong>Chickoz</strong> POS.</p>
        </div>

        {/* Features */}
        <div className="ckz-features">
          {FEATURES.map(f => (
            <div className="ckz-feature" key={f.title}>
              <div className="ckz-feat-ico"><i className={`bx ${f.icon}`} /></div>
              <div className="ckz-feat-body">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="ckz-trust">
          <div className="ckz-trust-card">
            <div className="ckz-avatars">
              {["A", "B", "C"].map(l => <div className="ckz-av" key={l}>{l}</div>)}
              <div className="ckz-av" style={{ background: "#D91E18", fontSize: 9 }}>2K+</div>
            </div>
            <div className="ckz-trust-text">
              <h5>Trusted by 2,000+</h5>
              <p>Restaurant Owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
      <div className="ckz-right">
        <div className="ckz-ring" />

        <div className="ckz-form-box">
          <div className="ckz-tag">Welcome Back! 👋</div>
          <h2 className="ckz-title">Login to your account</h2>
          <p className="ckz-sub">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} noValidate>

            {/* Email */}
            <div className="ckz-field">
              <label className="ckz-label">Email Address</label>
              <div className="ckz-inp-wrap">
                <input
                  className="ckz-inp"
                  type="email"
                  name="email"
                  placeholder="youremail@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  style={{ paddingLeft: 42 }}
                />
                <i className="bx bx-envelope ckz-inp-ico" style={{ left: 14 }} />
              </div>
            </div>

            {/* Password */}
            <div className="ckz-field">
              <label className="ckz-label">Password</label>
              <div className="ckz-inp-wrap">
                <input
                  className="ckz-inp ckz-inp-pr"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingLeft: 42 }}
                />
                <i className="bx bx-lock ckz-inp-ico" style={{ left: 14 }} />
                <button
                  type="button"
                  className="ckz-eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                >
                  <i className={`bx bx-${showPw ? "hide" : "show"}`} />
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="ckz-meta">
              <label className="ckz-check">
                <input type="checkbox" id="remember-check" />
                Remember me
              </label>
              <Link to="/" className="ckz-forgot">Forgot password?</Link>
            </div>

            {/* Submit */}
            <button className="ckz-btn" type="submit" disabled={loading}>
              {loading ? (
                <><div className="ckz-spinner" /> Signing in...</>
              ) : (
                <>Login <i className="bx bx-right-arrow-alt ckz-arrow" /></>
              )}
            </button>
          </form>

          <div className="ckz-copy">
            © {new Date().getFullYear()} Chickoz &nbsp;·&nbsp; Crafted with ❤️ by Ahattrickz Info Tech
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
