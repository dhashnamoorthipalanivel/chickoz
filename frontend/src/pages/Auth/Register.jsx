import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/apiClient";

/* ─── Injected CSS (same design system as Login) ───────────────────── */
const REGISTER_CSS = `
  @keyframes ckzrFadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ckzrFadeLeft { from { opacity:0; transform:translateX(-22px); } to { opacity:1; transform:translateX(0); } }
  @keyframes ckzrSpin     { to { transform:rotate(360deg); } }
  @keyframes ckzrGlow     { 0%,100%{opacity:.18} 50%{opacity:.32} }

  .ckzr-lw *       { box-sizing:border-box; margin:0; padding:0; }
  .ckzr-lw         { min-height:100vh; display:flex; font-family:'Inter',system-ui,-apple-system,sans-serif; background:#f8fafc; }

  /* ── LEFT PANEL ── */
  .ckzr-left {
    width:48%; min-height:100vh;
    background:linear-gradient(155deg,#0d0d0d 0%,#1a0808 45%,#1c0d05 100%);
    position:relative; overflow:hidden;
    display:flex; flex-direction:column; padding:48px 52px 44px;
  }
  .ckzr-blob1 {
    position:absolute; width:380px; height:380px; border-radius:50%;
    background:radial-gradient(circle,rgba(217,30,24,.22) 0%,transparent 70%);
    top:-80px; right:-80px; pointer-events:none; animation:ckzrGlow 4s ease infinite;
  }
  .ckzr-blob2 {
    position:absolute; width:280px; height:280px; border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.16) 0%,transparent 70%);
    bottom:80px; left:-60px; pointer-events:none; animation:ckzrGlow 4s 2s ease infinite;
  }
  .ckzr-dots {
    position:absolute; inset:0; pointer-events:none;
    background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);
    background-size:26px 26px;
  }

  .ckzr-brand          { display:flex; align-items:center; gap:12px; animation:ckzrFadeLeft .65s ease both; position:relative; z-index:1; }
  .ckzr-brand img      { height:40px; }
  .ckzr-brand-name     { color:#fff; font-size:21px; font-weight:800; letter-spacing:-.4px; }
  .ckzr-brand-name em  { color:#D91E18; font-style:normal; }
  .ckzr-sub-label      { color:rgba(255,255,255,.35); font-size:10px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; margin-top:2px; }

  .ckzr-hero       { margin-top:56px; position:relative; z-index:1; animation:ckzrFadeUp .7s .1s ease both; }
  .ckzr-hero h1    { color:#fff; font-size:36px; font-weight:800; line-height:1.2; margin-bottom:16px; }
  .ckzr-hero h1 em { font-style:normal; color:#F97316; }
  .ckzr-hero p     { color:rgba(255,255,255,.48); font-size:14.5px; line-height:1.7; }
  .ckzr-hero p strong { color:#D91E18; font-weight:700; }

  /* Steps / benefits list */
  .ckzr-steps      { margin-top:44px; display:flex; flex-direction:column; gap:0; position:relative; z-index:1; animation:ckzrFadeUp .7s .22s ease both; }
  .ckzr-step       { display:flex; align-items:flex-start; gap:16px; padding-bottom:26px; position:relative; }
  .ckzr-step:not(:last-child)::before {
    content:""; position:absolute; left:21px; top:44px; bottom:0; width:1.5px;
    background:linear-gradient(to bottom,rgba(217,30,24,.3),transparent);
  }
  .ckzr-step-num   { width:44px; height:44px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(217,30,24,.13); border:1px solid rgba(217,30,24,.22); font-size:16px; font-weight:800; color:#D91E18; }
  .ckzr-step-body h4  { color:#fff; font-size:14px; font-weight:700; margin-bottom:3px; margin-top:10px; }
  .ckzr-step-body p   { color:rgba(255,255,255,.4); font-size:12.5px; line-height:1.5; }

  .ckzr-trust         { margin-top:auto; padding-top:40px; position:relative; z-index:1; animation:ckzrFadeUp .7s .35s ease both; }
  .ckzr-trust-card    { background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.09); border-radius:18px; padding:16px 20px; display:flex; align-items:center; gap:16px; backdrop-filter:blur(6px); }
  .ckzr-avatars       { display:flex; }
  .ckzr-av            { width:32px; height:32px; border-radius:50%; border:2.5px solid #1a0808; background:linear-gradient(135deg,#D91E18,#F97316); font-size:11px; font-weight:800; color:#fff; display:flex; align-items:center; justify-content:center; margin-left:-9px; }
  .ckzr-avatars .ckzr-av:first-child { margin-left:0; }
  .ckzr-trust-text h5 { color:#fff; font-size:13.5px; font-weight:700; margin-bottom:2px; }
  .ckzr-trust-text p  { color:rgba(255,255,255,.4); font-size:11.5px; }

  /* ── RIGHT PANEL ── */
  .ckzr-right {
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:40px 32px; background:#fff; position:relative;
  }
  .ckzr-right::before {
    content:""; position:absolute; top:0; left:0; right:0; height:200px;
    background:linear-gradient(180deg,rgba(217,30,24,.045) 0%,transparent 100%);
    pointer-events:none;
  }
  .ckzr-ring {
    position:absolute; top:28px; right:28px;
    width:48px; height:48px; border-radius:50%;
    border:2px solid rgba(217,30,24,.14); pointer-events:none;
  }
  .ckzr-ring::after {
    content:""; position:absolute; inset:-8px; border-radius:50%;
    border:2px solid rgba(249,115,22,.08);
  }

  .ckzr-form-box { width:100%; max-width:420px; animation:ckzrFadeUp .75s .08s ease both; position:relative; z-index:1; }

  .ckzr-tag     { font-size:13px; font-weight:700; color:#D91E18; letter-spacing:.3px; margin-bottom:10px; }
  .ckzr-title   { font-size:27px; font-weight:800; color:#111; margin-bottom:7px; }
  .ckzr-sub     { font-size:14px; color:#9ca3af; margin-bottom:34px; }

  .ckzr-field   { margin-bottom:20px; }
  .ckzr-label   { display:block; font-size:13.5px; font-weight:600; color:#374151; margin-bottom:8px; }
  .ckzr-inp-wrap { position:relative; display:flex; align-items:center; }
  .ckzr-inp-ico  { position:absolute; left:14px; color:#c4c9d4; font-size:16px; pointer-events:none; transition:color .2s; }
  .ckzr-inp {
    width:100%; padding:13px 14px 13px 42px;
    border:1.5px solid #ede9e0; border-radius:12px;
    font-size:14px; color:#1A1A1A; background:#fff;
    outline:none !important; transition:border-color .22s,box-shadow .22s;
  }
  .ckzr-inp:focus, .ckzr-inp:focus-visible {
    border-color:#F97316 !important;
    box-shadow:0 0 0 3.5px rgba(249,115,22,0.14) !important;
    outline:none !important;
  }
  .ckzr-inp-wrap:focus-within .ckzr-inp-ico { color:#F97316; }
  .ckzr-inp::placeholder    { color:#c4c9d4; }
  .ckzr-inp-pr              { padding-right:44px !important; }
  .ckzr-eye-btn             { position:absolute; right:13px; background:none; border:none; cursor:pointer; color:#9ca3af; padding:2px; font-size:17px; transition:color .2s; line-height:1; display:flex; align-items:center; }
  .ckzr-eye-btn:hover       { color:#D91E18; }

  .ckzr-terms   { font-size:13px; color:#6b7280; margin-bottom:26px; line-height:1.6; }
  .ckzr-terms a { color:#D91E18; font-weight:600; text-decoration:none; }
  .ckzr-terms a:hover { text-decoration:underline; }

  .ckzr-btn {
    width:100%; padding:14px;
    background:linear-gradient(135deg,#D91E18 0%,#F97316 100%);
    border:none; border-radius:12px; color:#fff;
    font-size:15px; font-weight:700; letter-spacing:.3px; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow:0 4px 18px rgba(217,30,24,.38);
    transition:transform .18s,box-shadow .18s,opacity .18s;
    position:relative; overflow:hidden;
  }
  .ckzr-btn::after {
    content:""; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.15) 50%,transparent 100%);
    transform:translateX(-100%); transition:transform .45s ease;
  }
  .ckzr-btn:hover:not(:disabled)::after { transform:translateX(100%); }
  .ckzr-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 26px rgba(217,30,24,.44); }
  .ckzr-btn:active:not(:disabled) { transform:translateY(0); }
  .ckzr-btn:disabled { opacity:.72; cursor:not-allowed; }
  .ckzr-arrow  { font-size:18px; transition:transform .22s; }
  .ckzr-btn:hover:not(:disabled) .ckzr-arrow { transform:translateX(5px); }

  .ckzr-spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:ckzrSpin .7s linear infinite; flex-shrink:0; }

  .ckzr-login-link { margin-top:26px; text-align:center; font-size:13.5px; color:#9ca3af; }
  .ckzr-login-link a { color:#D91E18; font-weight:700; text-decoration:none; margin-left:4px; transition:opacity .18s; }
  .ckzr-login-link a:hover { opacity:.75; }

  .ckzr-copy { margin-top:24px; text-align:center; font-size:12px; color:#d1d5db; line-height:1.7; }

  @media (max-width:900px) { .ckzr-left { width:44%; padding:36px 32px; } .ckzr-hero h1 { font-size:28px; } }
  @media (max-width:680px) { .ckzr-left { display:none; } .ckzr-right { padding:32px 20px; } }
`;

const STEPS = [
  { num: "1", title: "Create Your Account",  desc: "Fill in your details to get started instantly" },
  { num: "2", title: "Set Up Your Franchise", desc: "Configure your outlet and menu preferences"    },
  { num: "3", title: "Start Billing",         desc: "Go live and process orders with Chickoz POS"   },
];

/* ─── Component ────────────────────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", userName: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ckzr-register-style";
    el.textContent = REGISTER_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.email || !form.userName || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", {
        email:    form.email,
        userName: form.userName,
        password: form.password,
      });
      toast.success("Account created! Please log in.");
      setTimeout(() => navigate("/auth-login"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ckzr-lw">

      {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
      <div className="ckzr-left">
        <div className="ckzr-blob1" />
        <div className="ckzr-blob2" />
        <div className="ckzr-dots"  />

        {/* Brand */}
        <div className="ckzr-brand">
          <img src="/assets/images/logo-1.png" alt="Chickoz" />
          <div>
            <div className="ckzr-brand-name">CHICK<em>OZ</em></div>
            <div className="ckzr-sub-label">POS System</div>
          </div>
        </div>

        {/* Hero */}
        <div className="ckzr-hero">
          <h1>Join the Future<br />of <em>Restaurant Billing.</em></h1>
          <p>Set up your <strong>Chickoz</strong> account in seconds<br />and take control of your business today.</p>
        </div>

        {/* Steps */}
        <div className="ckzr-steps">
          {STEPS.map(s => (
            <div className="ckzr-step" key={s.num}>
              <div className="ckzr-step-num">{s.num}</div>
              <div className="ckzr-step-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="ckzr-trust">
          <div className="ckzr-trust-card">
            <div className="ckzr-avatars">
              {["A", "B", "C"].map(l => <div className="ckzr-av" key={l}>{l}</div>)}
              <div className="ckzr-av" style={{ background: "#D91E18", fontSize: 9 }}>2K+</div>
            </div>
            <div className="ckzr-trust-text">
              <h5>Trusted by 2,000+</h5>
              <p>Restaurant Owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
      <div className="ckzr-right">
        <div className="ckzr-ring" />

        <div className="ckzr-form-box">
          <div className="ckzr-tag">Get Started ✨</div>
          <h2 className="ckzr-title">Create your account</h2>
          <p className="ckzr-sub">Fill in your details to register</p>

          <form onSubmit={handleRegister} noValidate>

            {/* Email */}
            <div className="ckzr-field">
              <label className="ckzr-label">Email Address</label>
              <div className="ckzr-inp-wrap">
                <input
                  className="ckzr-inp"
                  type="email"
                  name="email"
                  placeholder="youremail@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  style={{ paddingLeft: 42 }}
                />
                <i className="bx bx-envelope ckzr-inp-ico" />
              </div>
            </div>

            {/* Username */}
            <div className="ckzr-field">
              <label className="ckzr-label">Username</label>
              <div className="ckzr-inp-wrap">
                <input
                  className="ckzr-inp"
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  value={form.userName}
                  onChange={handleChange}
                  autoComplete="username"
                  style={{ paddingLeft: 42 }}
                />
                <i className="bx bx-user ckzr-inp-ico" />
              </div>
            </div>

            {/* Password */}
            <div className="ckzr-field">
              <label className="ckzr-label">Password</label>
              <div className="ckzr-inp-wrap">
                <input
                  className="ckzr-inp ckzr-inp-pr"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42 }}
                />
                <i className="bx bx-lock ckzr-inp-ico" />
                <button
                  type="button"
                  className="ckzr-eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                >
                  <i className={`bx bx-${showPw ? "hide" : "show"}`} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="ckzr-terms">
              By registering you agree to the Chickoz&nbsp;
              <Link to="#">Terms of Use</Link>&nbsp;and&nbsp;<Link to="#">Privacy Policy</Link>.
            </div>

            {/* Submit */}
            <button className="ckzr-btn" type="submit" disabled={loading}>
              {loading ? (
                <><div className="ckzr-spinner" /> Creating account...</>
              ) : (
                <>Create Account <i className="bx bx-right-arrow-alt ckzr-arrow" /></>
              )}
            </button>
          </form>

          <div className="ckzr-login-link">
            Already have an account?
            <Link to="/auth-login">Login</Link>
          </div>

          <div className="ckzr-copy">
            © {new Date().getFullYear()} Chickoz &nbsp;·&nbsp; Crafted with ❤️ by Ahattrickz Info Tech
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
