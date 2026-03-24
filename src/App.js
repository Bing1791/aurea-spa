import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────
const SERVICES = [
  { id: 1, name: "Signature Facial", duration: "60 min", price: 120, desc: "Deep cleanse, exfoliation & hydration treatment tailored to your unique skin type." },
  { id: 2, name: "Hot Stone Massage", duration: "90 min", price: 160, desc: "Volcanic basalt stones melt tension from your muscles, restoring deep calm." },
  { id: 3, name: "Aromatherapy Ritual", duration: "75 min", price: 140, desc: "Curated essential oil blends combined with gentle pressure point therapy." },
];
const PRODUCTS = [
  { id: 1, name: "Radiance Serum", volume: "30ml", price: 89, tag: "Best Seller", accent: "#c9a96e" },
  { id: 2, name: "Velvet Night Cream", volume: "50ml", price: 72, tag: "New", accent: "#8a9e8a" },
  { id: 3, name: "Cleansing Oil Elixir", volume: "100ml", price: 58, tag: null, accent: "#b07d62" },
];
const TIMES = ["9:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const DAYS = [
  { label: "Mon", date: "Mar 17" },
  { label: "Tue", date: "Mar 18" },
  { label: "Wed", date: "Mar 19" },
  { label: "Thu", date: "Mar 20" },
  { label: "Fri", date: "Mar 21" },
  { label: "Sat", date: "Mar 22" },
];

// ── STYLES ────────────────────────────────────────────────────────
const G = {
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{overflow-x:hidden;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:#0d0b09;}
    ::-webkit-scrollbar-thumb{background:#c9a96e;}
    .serif{font-family:'Cormorant Garamond',Georgia,serif;}
    .sans{font-family:'DM Sans',sans-serif;}
    .fade{animation:fadeUp .55s ease both;}
    .fade2{animation:fadeUp .55s .1s ease both;}
    .fade3{animation:fadeUp .55s .2s ease both;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
    @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    @keyframes popIn{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(32px);}to{opacity:1;transform:translateX(0);}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
    .card{background:rgba(255,255,255,.03);border:1px solid rgba(201,169,110,.15);transition:all .35s;}
    .card:hover{border-color:rgba(201,169,110,.5);background:rgba(201,169,110,.05);transform:translateY(-4px);}
    .card-sel{border-color:#c9a96e!important;background:rgba(201,169,110,.08)!important;}
    .gbtn{background:#c9a96e;color:#0d0b09;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;font-size:11px;padding:14px 28px;transition:all .25s;white-space:nowrap;}
    .gbtn:hover{background:#e2ba80;transform:translateY(-1px);box-shadow:0 8px 24px rgba(201,169,110,.3);}
    .gbtn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
    .obtn{background:transparent;color:#c9a96e;border:1px solid rgba(201,169,110,.5);cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:300;letter-spacing:1.5px;text-transform:uppercase;font-size:11px;padding:13px 28px;transition:all .25s;}
    .obtn:hover{background:rgba(201,169,110,.1);border-color:#c9a96e;}
    .inp{background:rgba(255,255,255,.04);border:1px solid rgba(201,169,110,.2);color:#e8dcc8;padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:13px;width:100%;outline:none;transition:border .25s;border-radius:2px;}
    .inp:focus{border-color:#c9a96e;}
    .inp::placeholder{color:#4a4030;}
    .slot{cursor:pointer;padding:10px 14px;border:1px solid rgba(201,169,110,.2);text-align:center;transition:all .2s;font-family:'DM Sans',sans-serif;font-size:12px;border-radius:2px;}
    .slot:hover{border-color:#c9a96e;}
    .slot.sel{background:#c9a96e;color:#0d0b09;border-color:#c9a96e;}
    .tslot{cursor:pointer;padding:9px 18px;border:1px solid rgba(201,169,110,.2);font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:.5px;transition:all .2s;border-radius:2px;}
    .tslot:hover{border-color:#c9a96e;}
    .tslot.sel{background:rgba(201,169,110,.15);border-color:#c9a96e;color:#c9a96e;}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
    .modal{background:#131009;border:1px solid rgba(201,169,110,.25);padding:40px;width:100%;max-width:440px;animation:popIn .3s ease;position:relative;max-height:90vh;overflow-y:auto;}
    .tab{cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid transparent;transition:all .25s;color:#5a5040;}
    .tab.act{color:#c9a96e;border-bottom-color:#c9a96e;}
    .err{font-family:'DM Sans',sans-serif;font-size:12px;color:#e87070;margin-top:6px;}
    .stripe-input{background:#1a1710;border:1px solid rgba(201,169,110,.2);color:#e8dcc8;padding:14px 16px;font-family:'DM Sans',sans-serif;font-size:14px;width:100%;outline:none;transition:border .25s;border-radius:2px;letter-spacing:.5px;}
    .stripe-input:focus{border-color:#c9a96e;}
    .stripe-input::placeholder{color:#3a3028;}
    @media(max-width:768px){
      .hide-mobile{display:none!important;}
      .grid-3{grid-template-columns:1fr!important;}
      .grid-2{grid-template-columns:1fr!important;}
      .hero-h{font-size:48px!important;}
      .nav-pad{padding:20px 20px!important;}
      .page-pad{padding:100px 20px 60px!important;}
      .stat-row{flex-direction:column!important;gap:36px!important;}
      .days-row{display:grid!important;grid-template-columns:repeat(3,1fr)!important;}
      .footer-row{flex-direction:column!important;gap:12px!important;text-align:center!important;}
      .steps-row{gap:4px!important;}
      .step-label{display:none!important;}
      .booking-grid{grid-template-columns:1fr!important;}
      .cart-drawer{width:100vw!important;}
    }
  `,
};

// ── HELPERS ───────────────────────────────────────────────────────
const fmtCard = (v) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
const fmtExp = (v) => v.replace(/\D/g, "").replace(/(.{2})/, "$1/").slice(0, 5);

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [authModal, setAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [stripeModal, setStripeModal] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [stripeErr, setStripeErr] = useState("");

  const [selService, setSelService] = useState(null);
  const [bookStep, setBookStep] = useState(1);
  const [selDay, setSelDay] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [bookForm, setBookForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [bookConfirmed, setBookConfirmed] = useState(false);
  const [bookRef, setBookRef] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const addToCart = (p) => {
    setCart(prev => {
      const e = prev.find(i => i.id === p.id);
      return e ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
  };
  const removeCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  // Simulated Firebase auth
  const handleLogin = async () => {
    setAuthErr("");
    if (!loginForm.email || !loginForm.password) { setAuthErr("Please fill in all fields."); return; }
    setAuthLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setAuthLoading(false);
    setUser({ name: loginForm.email.split("@")[0], email: loginForm.email, avatar: loginForm.email[0].toUpperCase() });
    setAuthModal(false);
    setLoginForm({ email: "", password: "" });
  };
  const handleRegister = async () => {
    setAuthErr("");
    if (!regForm.name || !regForm.email || !regForm.password) { setAuthErr("Please fill in all fields."); return; }
    if (regForm.password.length < 6) { setAuthErr("Password must be at least 6 characters."); return; }
    setAuthLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setAuthLoading(false);
    setUser({ name: regForm.name, email: regForm.email, avatar: regForm.name[0].toUpperCase() });
    setAuthModal(false);
    setRegForm({ name: "", email: "", password: "" });
  };

  // Simulated Stripe checkout
  const handleStripe = async () => {
    setStripeErr("");
    if (!cardNum || cardNum.length < 19) { setStripeErr("Please enter a valid card number."); return; }
    if (!cardExp || cardExp.length < 5) { setStripeErr("Please enter expiry date."); return; }
    if (!cardCvc || cardCvc.length < 3) { setStripeErr("Please enter CVC."); return; }
    if (!cardName) { setStripeErr("Please enter cardholder name."); return; }
    setStripeLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    setStripeLoading(false);
    setStripeSuccess(true);
    setCart([]);
  };

  // Simulated booking confirm
  const handleBookConfirm = async () => {
    if (!bookForm.name || !bookForm.email) return;
    setBookLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setBookLoading(false);
    setBookRef("AUR-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    setBookConfirmed(true);
  };

  const goBook = (service = null) => {
    setSelService(service);
    setBookStep(1);
    setBookConfirmed(false);
    setBookRef("");
    setSelDay(null);
    setSelTime(null);
    setBookForm({ name: user?.name || "", email: user?.email || "", phone: "", notes: "" });
    setPage("book");
    setMobileMenu(false);
  };

  const navTo = (p) => { setPage(p); setMobileMenu(false); };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#0d0b09", color: "#e8dcc8", minHeight: "100vh" }}>
      <style>{G.css}</style>

      {/* NAV */}
      <nav className="nav-pad" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "22px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(24px)", background: "rgba(13,11,9,.85)", borderBottom: "1px solid rgba(201,169,110,.08)" }}>
        <div className="serif" style={{ fontSize: "22px", fontWeight: 300, letterSpacing: "6px", color: "#e8dcc8", cursor: "pointer" }} onClick={() => navTo("home")}>AURÉA</div>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["home", "book", "shop"].map(p => (
            <span key={p} onClick={() => navTo(p)} style={{ cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 300, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: page === p ? "#c9a96e" : "#7a6a58", transition: "color .25s" }}>{p}</span>
          ))}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setUser(null)}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(201,169,110,.2)", border: "1px solid #c9a96e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#c9a96e" }}>{user.avatar}</div>
              <span style={{ fontSize: "12px", color: "#a89880" }}>{user.name}</span>
            </div>
          ) : (
            <span onClick={() => { setAuthModal(true); setAuthTab("login"); setAuthErr(""); }} style={{ cursor: "pointer", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#7a6a58", transition: "color .25s" }} onMouseEnter={e => e.target.style.color = "#c9a96e"} onMouseLeave={e => e.target.style.color = "#7a6a58"}>Sign In</span>
          )}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => { setCartOpen(!cartOpen); setStripeSuccess(false); }}>
            <CartIcon />
            {cartCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#c9a96e", color: "#0d0b09", borderRadius: "50%", width: "15px", height: "15px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans'" }}>{cartCount}</span>}
          </div>
        </div>

        {/* Mobile nav icons */}
        <div style={{ display: "none", gap: "16px", alignItems: "center" }} className="mobile-nav-icons">
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setCartOpen(!cartOpen)}>
            <CartIcon />
            {cartCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#c9a96e", color: "#0d0b09", borderRadius: "50%", width: "15px", height: "15px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </div>
          <div style={{ cursor: "pointer", color: "#a89880" }} onClick={() => setMobileMenu(!mobileMenu)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </div>
        </div>

        <style>{`@media(max-width:768px){.hide-mobile{display:none!important;}.mobile-nav-icons{display:flex!important;}}`}</style>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div style={{ position: "fixed", inset: 0, background: "#0d0b09", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px", animation: "popIn .25s ease" }}>
          <div style={{ position: "absolute", top: "24px", right: "24px", cursor: "pointer", color: "#5a5040", fontSize: "28px" }} onClick={() => setMobileMenu(false)}>×</div>
          {["home", "book", "shop"].map(p => (
            <span key={p} onClick={() => navTo(p)} className="serif" style={{ fontSize: "36px", fontWeight: 300, color: page === p ? "#c9a96e" : "#a89880", cursor: "pointer", textTransform: "capitalize", letterSpacing: "4px" }}>{p}</span>
          ))}
          {user ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#c9a96e", marginBottom: "8px" }}>{user.name}</div>
              <span onClick={() => { setUser(null); setMobileMenu(false); }} style={{ fontSize: "11px", color: "#5a5040", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Sign Out</span>
            </div>
          ) : (
            <span onClick={() => { setAuthModal(true); setAuthTab("login"); setMobileMenu(false); }} style={{ fontSize: "11px", color: "#c9a96e", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Sign In</span>
          )}
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cart-drawer" style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "380px", background: "#0f0d0a", borderLeft: "1px solid rgba(201,169,110,.2)", zIndex: 150, display: "flex", flexDirection: "column", animation: "slideLeft .3s ease" }}>
          <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid rgba(201,169,110,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="sans" style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c9a96e" }}>Cart {cartCount > 0 && `(${cartCount})`}</span>
            <span style={{ cursor: "pointer", color: "#5a5040", fontSize: "22px", lineHeight: 1 }} onClick={() => setCartOpen(false)}>×</span>
          </div>

          {stripeSuccess ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(100,200,100,.1)", border: "1px solid rgba(100,200,100,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "24px" }}>✓</div>
              <div className="serif" style={{ fontSize: "28px", fontWeight: 300, color: "#c9a96e", marginBottom: "12px" }}>Payment Successful</div>
              <p className="sans" style={{ fontSize: "13px", color: "#7a6a58", lineHeight: 1.7 }}>Your order has been confirmed. A receipt has been sent to your email.</p>
              <button className="obtn" style={{ marginTop: "32px" }} onClick={() => { setCartOpen(false); setStripeSuccess(false); }}>Continue Shopping</button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p className="sans" style={{ color: "#3a3028", fontSize: "13px" }}>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "40px", height: "50px", background: `rgba(201,169,110,.08)`, border: "1px solid rgba(201,169,110,.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "16px", height: "24px", background: item.accent + "66", borderRadius: "1px" }} />
                      </div>
                      <div>
                        <div className="serif" style={{ fontSize: "16px", color: "#e8dcc8" }}>{item.name}</div>
                        <div className="sans" style={{ fontSize: "11px", color: "#5a5040" }}>qty {item.qty} · {item.volume}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span className="sans" style={{ color: "#c9a96e" }}>${item.price * item.qty}</span>
                      <span style={{ cursor: "pointer", fontSize: "11px", color: "#3a3028" }} onClick={() => removeCart(item.id)}>remove</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "20px 28px 28px", borderTop: "1px solid rgba(201,169,110,.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px", color: "#5a5040" }}>
                  <span>Subtotal</span><span>${cartTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "12px", color: "#5a5040" }}>
                  <span>Shipping</span><span style={{ color: "#8a9e8a" }}>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <span className="sans" style={{ fontSize: "12px", color: "#a89880", letterSpacing: "1px" }}>Total</span>
                  <span className="serif" style={{ fontSize: "26px", fontWeight: 300, color: "#c9a96e" }}>${cartTotal}</span>
                </div>
                <button className="gbtn" style={{ width: "100%" }} onClick={() => { setStripeModal(true); setStripeErr(""); setCardNum(""); setCardExp(""); setCardCvc(""); setCardName(""); }}>
                  Checkout with Stripe
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── AUTH MODAL ── */}
      {authModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setAuthModal(false)}>
          <div className="modal">
            <div style={{ position: "absolute", top: "16px", right: "20px", cursor: "pointer", color: "#5a5040", fontSize: "22px" }} onClick={() => setAuthModal(false)}>×</div>
            <div className="serif" style={{ fontSize: "28px", fontWeight: 300, marginBottom: "28px", color: "#f0e6d2" }}>
              {authTab === "login" ? "Welcome Back" : "Create Account"}
            </div>
            <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid rgba(201,169,110,.1)", marginBottom: "28px" }}>
              <span className={`tab ${authTab === "login" ? "act" : ""}`} onClick={() => { setAuthTab("login"); setAuthErr(""); }}>Sign In</span>
              <span className={`tab ${authTab === "register" ? "act" : ""}`} onClick={() => { setAuthTab("register"); setAuthErr(""); }}>Register</span>
            </div>
            {authTab === "login" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input className="inp" placeholder="Email address" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
                <input className="inp" placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                {authErr && <div className="err">{authErr}</div>}
                <div style={{ fontSize: "11px", color: "#5a5040", marginTop: "2px" }}>Demo: any email / password</div>
                <button className="gbtn" style={{ marginTop: "8px", width: "100%" }} onClick={handleLogin} disabled={authLoading}>
                  {authLoading ? <Spinner /> : "Sign In"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input className="inp" placeholder="Full name" value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} />
                <input className="inp" placeholder="Email address" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} />
                <input className="inp" placeholder="Password (min 6 chars)" type="password" value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} />
                {authErr && <div className="err">{authErr}</div>}
                <button className="gbtn" style={{ marginTop: "8px", width: "100%" }} onClick={handleRegister} disabled={authLoading}>
                  {authLoading ? <Spinner /> : "Create Account"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STRIPE MODAL ── */}
      {stripeModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && !stripeLoading && setStripeModal(false)}>
          <div className="modal" style={{ maxWidth: "480px" }}>
            {!stripeLoading && <div style={{ position: "absolute", top: "16px", right: "20px", cursor: "pointer", color: "#5a5040", fontSize: "22px" }} onClick={() => setStripeModal(false)}>×</div>}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ width: "32px", height: "32px", background: "#635BFF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
              </div>
              <div>
                <div className="sans" style={{ fontSize: "13px", color: "#e8dcc8", fontWeight: 500 }}>Secure Payment</div>
                <div className="sans" style={{ fontSize: "11px", color: "#5a5040" }}>Powered by Stripe</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div className="sans" style={{ fontSize: "11px", color: "#5a5040" }}>Total</div>
                <div className="serif" style={{ fontSize: "22px", color: "#c9a96e" }}>${cartTotal}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div className="sans" style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Card Number</div>
                <div style={{ position: "relative" }}>
                  <input className="stripe-input" placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} maxLength={19} />
                  <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "6px" }}>
                    <div style={{ width: "28px", height: "18px", background: "#1a6be0", borderRadius: "2px", fontSize: "7px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>VISA</div>
                    <div style={{ width: "28px", height: "18px", background: "#eb001b", borderRadius: "2px" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <div className="sans" style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Expiry</div>
                  <input className="stripe-input" placeholder="MM/YY" value={cardExp} onChange={e => setCardExp(fmtExp(e.target.value))} maxLength={5} />
                </div>
                <div>
                  <div className="sans" style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>CVC</div>
                  <input className="stripe-input" placeholder="123" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} />
                </div>
              </div>
              <div>
                <div className="sans" style={{ fontSize: "11px", color: "#5a5040", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Cardholder Name</div>
                <input className="stripe-input" placeholder="Jane Smith" value={cardName} onChange={e => setCardName(e.target.value)} />
              </div>
              {stripeErr && <div className="err">{stripeErr}</div>}
              <button className="gbtn" style={{ width: "100%", marginTop: "8px", padding: "16px", fontSize: "12px" }} onClick={handleStripe} disabled={stripeLoading}>
                {stripeLoading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <Spinner /> Processing...
                  </div>
                ) : `Pay $${cartTotal}`}
              </button>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a3028" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <span className="sans" style={{ fontSize: "11px", color: "#3a3028" }}>256-bit SSL encrypted · Test mode</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PAGES ══════════════ */}

      {/* HOME */}
      {page === "home" && (
        <div style={{ position: "relative" }}>
          {/* Hero */}
          <section className="page-pad" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "140px 48px 80px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-5%", top: "10%", width: "520px", height: "600px", background: "radial-gradient(ellipse, rgba(201,169,110,.1) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: "8%", top: "15%", width: "400px", height: "500px", border: "1px solid rgba(201,169,110,.07)", borderRadius: "2px", pointerEvents: "none" }} />
            <div style={{ maxWidth: "600px" }}>
              <div className="sans fade" style={{ fontSize: "10px", letterSpacing: "5px", color: "#c9a96e", marginBottom: "24px", textTransform: "uppercase" }}>Luxury Wellness Studio · Paris</div>
              <h1 className="serif hero-h fade2" style={{ fontSize: "clamp(50px,7.5vw,92px)", fontWeight: 300, lineHeight: 1.04, marginBottom: "28px", color: "#f0e6d2" }}>
                Where Beauty<br /><em style={{ fontStyle: "italic", color: "#c9a96e" }}>Meets</em><br />Science
              </h1>
              <p className="sans fade3" style={{ fontWeight: 200, fontSize: "15px", lineHeight: 1.85, color: "#7a6a58", maxWidth: "400px", marginBottom: "48px" }}>
                Bespoke treatments crafted for your unique skin. The intersection of ancient ritual and modern dermatology.
              </p>
              <div className="fade3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button className="gbtn" onClick={() => goBook()}>Book a Session</button>
                <button className="obtn" onClick={() => navTo("shop")}>Shop Now</button>
              </div>
            </div>
          </section>

          {/* Services */}
          <section style={{ padding: "80px 48px" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <div className="sans" style={{ fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", marginBottom: "14px", textTransform: "uppercase" }}>Our Treatments</div>
              <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: "#f0e6d2" }}>Signature Services</h2>
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
              {SERVICES.map((s, i) => (
                <div key={s.id} className="card" style={{ padding: "36px 28px", cursor: "pointer", animationDelay: `${i * .1}s` }} onClick={() => goBook(s)}>
                  <div className="sans" style={{ fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", marginBottom: "18px", textTransform: "uppercase" }}>{s.duration}</div>
                  <h3 className="serif" style={{ fontSize: "24px", fontWeight: 400, marginBottom: "14px", color: "#f0e6d2" }}>{s.name}</h3>
                  <p className="sans" style={{ fontSize: "13px", fontWeight: 200, color: "#6a5a48", lineHeight: 1.75, marginBottom: "28px" }}>{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="serif" style={{ fontSize: "30px", fontWeight: 300, color: "#c9a96e" }}>${s.price}</span>
                    <span className="sans" style={{ fontSize: "11px", color: "#c9a96e", letterSpacing: "1px" }}>Book →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section style={{ padding: "60px 48px", borderTop: "1px solid rgba(201,169,110,.08)", borderBottom: "1px solid rgba(201,169,110,.08)" }}>
            <div className="stat-row" style={{ display: "flex", justifyContent: "center", gap: "80px", maxWidth: "760px", margin: "0 auto" }}>
              {[["12+", "Years of Expertise"], ["4,200+", "Happy Clients"], ["98%", "Satisfaction Rate"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div className="serif" style={{ fontSize: "48px", fontWeight: 300, color: "#c9a96e", marginBottom: "6px" }}>{n}</div>
                  <div className="sans" style={{ fontSize: "10px", letterSpacing: "2px", color: "#4a3a28", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ padding: "100px 48px", textAlign: "center" }}>
            <div className="sans" style={{ fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", marginBottom: "16px", textTransform: "uppercase" }}>Ready to Begin?</div>
            <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 300, color: "#f0e6d2", marginBottom: "36px" }}>
              Your transformation<br />starts here
            </h2>
            <button className="gbtn" onClick={() => goBook()}>Reserve Your Appointment</button>
          </section>
        </div>
      )}

      {/* BOOKING */}
      {page === "book" && (
        <div className="page-pad" style={{ padding: "120px 48px 80px", maxWidth: "860px", margin: "0 auto" }} key={bookConfirmed ? "confirmed" : "booking"}>
          {bookConfirmed ? (
            // ── BOOKING CONFIRMATION ──
            <div style={{ textAlign: "center" }} className="fade">
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #c9a96e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", background: "rgba(201,169,110,.08)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="sans" style={{ fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", marginBottom: "12px", textTransform: "uppercase" }}>Booking Confirmed</div>
              <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "#f0e6d2", marginBottom: "36px" }}>
                See you soon,<br />{bookForm.name.split(" ")[0]}
              </h2>

              {/* Receipt Card */}
              <div style={{ background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.2)", padding: "36px", maxWidth: "480px", margin: "0 auto 36px", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid rgba(201,169,110,.1)" }}>
                  <div>
                    <div className="sans" style={{ fontSize: "10px", color: "#5a5040", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Reference</div>
                    <div className="sans" style={{ fontSize: "16px", color: "#c9a96e", letterSpacing: "2px" }}>{bookRef}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="sans" style={{ fontSize: "10px", color: "#5a5040", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Status</div>
                    <div className="sans" style={{ fontSize: "12px", color: "#8a9e8a", padding: "4px 10px", border: "1px solid rgba(138,158,138,.3)", display: "inline-block", borderRadius: "2px" }}>Confirmed</div>
                  </div>
                </div>
                {[
                  ["Treatment", selService?.name],
                  ["Duration", selService?.duration],
                  ["Date", DAYS[selDay]?.label + " · " + DAYS[selDay]?.date],
                  ["Time", selTime],
                  ["Client", bookForm.name],
                  ["Email", bookForm.email],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "13px" }}>
                    <span className="sans" style={{ color: "#5a5040" }}>{label}</span>
                    <span className="sans" style={{ color: "#e8dcc8" }}>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(201,169,110,.1)", paddingTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="sans" style={{ fontSize: "11px", color: "#5a5040", letterSpacing: "1px" }}>Total Due</span>
                  <span className="serif" style={{ fontSize: "30px", fontWeight: 300, color: "#c9a96e" }}>${selService?.price}</span>
                </div>
              </div>

              <p className="sans" style={{ fontSize: "13px", color: "#5a5040", marginBottom: "36px", lineHeight: 1.7 }}>
                A confirmation email has been sent to <span style={{ color: "#a89880" }}>{bookForm.email}</span>.<br />We look forward to welcoming you.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="gbtn" onClick={() => navTo("home")}>Return Home</button>
                <button className="obtn" onClick={() => goBook()}>Book Another</button>
              </div>
            </div>
          ) : (
            // ── BOOKING FORM ──
            <div className="fade">
              <div style={{ marginBottom: "44px" }}>
                <div className="sans" style={{ fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", marginBottom: "14px", textTransform: "uppercase" }}>Reserve Your Time</div>
                <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "#f0e6d2" }}>Book a Session</h2>
              </div>

              {/* Steps */}
              <div className="steps-row" style={{ display: "flex", gap: "0", alignItems: "center", marginBottom: "44px" }}>
                {["Service", "Date & Time", "Details"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${bookStep > i ? "#c9a96e" : "rgba(201,169,110,.25)"}`, background: bookStep > i ? "#c9a96e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: "'DM Sans'", color: bookStep > i ? "#0d0b09" : "#4a3a28", flexShrink: 0 }}>
                        {bookStep > i + 1 ? "✓" : i + 1}
                      </div>
                      <span className="step-label sans" style={{ fontSize: "11px", letterSpacing: "1px", color: bookStep === i + 1 ? "#c9a96e" : "#4a3a28" }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ width: "32px", height: "1px", background: "rgba(201,169,110,.15)", margin: "0 10px", flexShrink: 0 }} />}
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {bookStep === 1 && (
                <div className="fade">
                  <div className="sans" style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a5040", marginBottom: "20px", textTransform: "uppercase" }}>Choose a Treatment</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {SERVICES.map(s => (
                      <div key={s.id} className={`card ${selService?.id === s.id ? "card-sel" : ""}`} style={{ padding: "24px 28px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => setSelService(s)}>
                        <div>
                          <h3 className="serif" style={{ fontSize: "22px", fontWeight: 400, color: "#f0e6d2", marginBottom: "4px" }}>{s.name}</h3>
                          <span className="sans" style={{ fontSize: "12px", color: "#4a3a28" }}>{s.duration}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="serif" style={{ fontSize: "28px", fontWeight: 300, color: "#c9a96e" }}>${s.price}</div>
                          {selService?.id === s.id && <div className="sans" style={{ fontSize: "10px", color: "#c9a96e", letterSpacing: "1px" }}>Selected ✓</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
                    <button className="gbtn" onClick={() => selService && setBookStep(2)} disabled={!selService}>Continue →</button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {bookStep === 2 && (
                <div className="fade">
                  <div className="sans" style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a5040", marginBottom: "20px", textTransform: "uppercase" }}>Select Date</div>
                  <div className="days-row" style={{ display: "flex", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
                    {DAYS.map((d, i) => (
                      <div key={d.label} className={`slot ${selDay === i ? "sel" : ""}`} onClick={() => setSelDay(i)} style={{ flex: "1", minWidth: "60px" }}>
                        <div style={{ fontSize: "9px", marginBottom: "6px", letterSpacing: "1px" }}>{d.label}</div>
                        <div className="serif" style={{ fontSize: "20px", fontWeight: 300 }}>{d.date.split(" ")[1]}</div>
                        <div style={{ fontSize: "9px", marginTop: "2px", color: selDay === i ? "#0d0b09" : "#4a3a28" }}>Mar</div>
                      </div>
                    ))}
                  </div>
                  <div className="sans" style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a5040", marginBottom: "16px", textTransform: "uppercase" }}>Available Times</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
                    {TIMES.map(t => (
                      <div key={t} className={`tslot ${selTime === t ? "sel" : ""}`} onClick={() => setSelTime(t)}>{t}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button className="obtn" onClick={() => setBookStep(1)}>← Back</button>
                    <button className="gbtn" onClick={() => selDay !== null && selTime && setBookStep(3)} disabled={selDay === null || !selTime}>Continue →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {bookStep === 3 && (
                <div className="fade">
                  <div className="booking-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "start" }}>
                    <div>
                      <div className="sans" style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a5040", marginBottom: "18px", textTransform: "uppercase" }}>Your Details</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input className="inp" placeholder="Full name *" value={bookForm.name} onChange={e => setBookForm(p => ({ ...p, name: e.target.value }))} />
                        <input className="inp" placeholder="Email address *" value={bookForm.email} onChange={e => setBookForm(p => ({ ...p, email: e.target.value }))} />
                        <input className="inp" placeholder="Phone (optional)" value={bookForm.phone} onChange={e => setBookForm(p => ({ ...p, phone: e.target.value }))} />
                        <textarea className="inp" placeholder="Special requests or notes..." value={bookForm.notes} onChange={e => setBookForm(p => ({ ...p, notes: e.target.value }))} style={{ height: "90px", resize: "none" }} />
                      </div>
                    </div>
                    <div>
                      <div className="sans" style={{ fontSize: "11px", letterSpacing: "2px", color: "#5a5040", marginBottom: "18px", textTransform: "uppercase" }}>Summary</div>
                      <div style={{ background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.15)", padding: "24px" }}>
                        {[
                          ["Treatment", selService?.name],
                          ["Date", DAYS[selDay]?.label + " · " + DAYS[selDay]?.date],
                          ["Time", selTime],
                          ["Duration", selService?.duration],
                        ].map(([l, v]) => (
                          <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
                            <span className="sans" style={{ color: "#5a5040" }}>{l}</span>
                            <span className="sans" style={{ color: "#c8b890" }}>{v}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(201,169,110,.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="sans" style={{ fontSize: "11px", color: "#5a5040" }}>Total</span>
                          <span className="serif" style={{ fontSize: "28px", fontWeight: 300, color: "#c9a96e" }}>${selService?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
                    <button className="obtn" onClick={() => setBookStep(2)}>← Back</button>
                    <button className="gbtn" onClick={handleBookConfirm} disabled={bookLoading || !bookForm.name || !bookForm.email}>
                      {bookLoading ? <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Spinner /> Confirming...</div> : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SHOP */}
      {page === "shop" && (
        <div className="page-pad" style={{ padding: "120px 48px 80px", maxWidth: "1100px", margin: "0 auto" }} key="shop">
          <div style={{ marginBottom: "56px" }} className="fade">
            <div className="sans" style={{ fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", marginBottom: "14px", textTransform: "uppercase" }}>Curated for You</div>
            <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "#f0e6d2" }}>The Collection</h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ height: "260px", background: "linear-gradient(145deg,#1a1610,#221e18)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: "70px", height: "110px", background: `linear-gradient(160deg,${p.accent}55,${p.accent}22)`, border: `1px solid ${p.accent}44`, borderRadius: "4px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "12px" }}>
                    <div className="sans" style={{ fontSize: "8px", color: p.accent + "cc", letterSpacing: "1px", textAlign: "center", textTransform: "uppercase" }}>AURÉA</div>
                  </div>
                  {p.tag && <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(201,169,110,.12)", border: "1px solid rgba(201,169,110,.3)", padding: "4px 10px", fontSize: "9px", fontFamily: "'DM Sans'", color: "#c9a96e", letterSpacing: "1.5px", textTransform: "uppercase" }}>{p.tag}</div>}
                </div>
                <div style={{ padding: "24px 24px 20px" }}>
                  <h3 className="serif" style={{ fontSize: "20px", fontWeight: 400, color: "#f0e6d2", marginBottom: "4px" }}>{p.name}</h3>
                  <div className="sans" style={{ fontSize: "11px", color: "#4a3a28", marginBottom: "18px" }}>{p.volume}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="serif" style={{ fontSize: "26px", fontWeight: 300, color: "#c9a96e" }}>${p.price}</span>
                    <button className="gbtn" style={{ padding: "10px 18px", fontSize: "10px" }} onClick={() => addToCart(p)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "60px", padding: "28px", border: "1px solid rgba(201,169,110,.12)", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#3a3028" }}>✦</span>
            <span className="sans" style={{ fontSize: "11px", letterSpacing: "3px", color: "#4a3a28", textTransform: "uppercase" }}>Complimentary shipping on orders over $150</span>
            <span style={{ color: "#3a3028" }}>✦</span>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer-row nav-pad" style={{ borderTop: "1px solid rgba(201,169,110,.08)", padding: "36px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="serif" style={{ fontSize: "18px", fontWeight: 300, letterSpacing: "6px", color: "#2a2018" }}>AURÉA</div>
        <div className="sans" style={{ fontSize: "11px", color: "#2a2018", letterSpacing: "1px" }}>© 2025 Auréa Wellness · Paris</div>
      </footer>
    </div>
  );
}

// ── MICRO COMPONENTS ──────────────────────────────────────────────
function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a58" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
function Spinner() {
  return <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,.2)", borderTop: "2px solid currentColor", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />;
}