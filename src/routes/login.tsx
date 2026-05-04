import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,wght@0,600;0,700;1,400;1,600&display=swap');

        .font-display { font-family: 'Fraunces', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-1deg); }
        }

        .panel-left {
          animation: fadeIn 0.8s ease forwards;
        }
        .card-anim {
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .orb-1 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(134,239,172,0.25) 0%, transparent 65%);
          top: -80px; left: -80px;
          animation: float 9s ease-in-out infinite;
          pointer-events: none;
        }
        .orb-2 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 65%);
          bottom: -60px; right: -40px;
          animation: floatReverse 11s ease-in-out infinite;
          pointer-events: none;
        }
        .orb-3 {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(187,247,208,0.2) 0%, transparent 65%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: float 13s ease-in-out 1s infinite;
          pointer-events: none;
        }

        .leaf-decoration {
          position: absolute;
          opacity: 0.06;
        }

        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #86efac;
          pointer-events: none;
        }
        .input-field {
          width: 100%;
          height: 52px;
          padding: 0 44px 0 44px;
          border-radius: 14px;
          border: 1.5px solid #d1fae5;
          background: #f7fdf9;
          font-size: 15px;
          color: #052e16;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: #86efac; }
        .input-field:focus {
          border-color: #4ade80;
          background: white;
          box-shadow: 0 0 0 4px rgba(74,222,128,0.12);
        }
        .input-field:hover:not(:focus) {
          border-color: #86efac;
          background: white;
        }
        .input-right {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #4ade80;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .input-right:hover { color: #16a34a; }

        .submit-btn {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          font-size: 16px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(22,163,74,0.35);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover {
          background: linear-gradient(135deg, #15803d 0%, #166534 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(22,163,74,0.42);
        }
        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(22,163,74,0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #bbf7d0;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #d1fae5;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 24px;
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
        }
        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #86efac;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          padding: 8px 12px;
          border-radius: 10px;
          margin: -8px -12px;
        }
        .back-link:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }

        .logo-ring {
          width: 64px; height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(22,163,74,0.35);
          margin-bottom: 20px;
        }
        
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .checkbox-wrap input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #16a34a;
          cursor: pointer;
          border-radius: 5px;
        }
      `}</style>

      {/* LEFT PANEL — decorative */}
      <div
        className="panel-left hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          width: "45%",
          background: "linear-gradient(145deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          flexShrink: 0,
        }}
      >
        <div className="orb-1" />
        <div className="orb-2" />
        <div className="orb-3" />

        {/* Faint leaf pattern */}
        <svg className="leaf-decoration" style={{ top: "20%", right: "-20px", width: 220 }} viewBox="0 0 200 200" fill="white">
          <path d="M100 10 C140 10, 190 50, 190 100 C190 150, 150 190, 100 190 C50 190, 10 160, 10 100 C10 50, 60 10, 100 10 Z" />
        </svg>
        <svg className="leaf-decoration" style={{ bottom: "15%", left: "-30px", width: 180 }} viewBox="0 0 200 200" fill="white">
          <path d="M100 10 C140 10, 190 50, 190 100 C190 150, 150 190, 100 190 C50 190, 10 160, 10 100 C10 50, 60 10, 100 10 Z" />
        </svg>

        {/* Logo + Back */}
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={15} />
            Kembali ke Laman Utama
          </Link>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Leaf size={18} className="text-green-300" />
            </div>
            <span className="font-display text-white font-bold text-xl tracking-tight">Ladang Pro</span>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <div className="feature-pill mb-6">
            <div className="feature-dot" />
            Sistem Karbon Pertanian No.1
          </div>
          <h2
            className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Satu platform untuk semua keperluan
            <span style={{ color: "#86efac", fontStyle: "italic" }}> kelestarian </span>
            anda.
          </h2>
          <p className="text-green-200 text-base leading-relaxed max-w-sm">
            Dari pengiraan karbon hinggalah pelan tindakan yang dipersonalisasi — semuanya dalam satu papan pemuka yang mudah difahami.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {["Analisis Automatik", "Data Selamat", "Cadangan Pintar"].map((f) => (
              <div key={f} className="feature-pill">{f}</div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="testimonial-card">
            <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
              "Ladang Pro membantu kami mengurangkan pelepasan karbon sebanyak 38% dalam masa 6 bulan tanpa mengorbankan hasil tuaian."
            </p>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 38, height: 38,
                  borderRadius: "50%",
                  background: "rgba(74,222,128,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "#86efac",
                  border: "1px solid rgba(134,239,172,0.3)",
                }}
              >
                AH
              </div>
              <div>
                <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0 }}>Emir Erfan</p>
                <p style={{ color: "#86efac", fontSize: 12, margin: 0 }}>Pekebun Kura-Kura, Pahang</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div
        className="flex-1 flex flex-col"
        style={{ background: "#f7fdf9" }}
      >
        {/* Mobile header */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-green-900 text-lg">Ladang Pro</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-800 transition-colors">
            <ArrowLeft size={14} />
            Kembali
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="card-anim w-full max-w-md">

            {/* Card */}
            <div
              style={{
                background: "white",
                borderRadius: 28,
                padding: "48px 44px",
                border: "1px solid #d1fae5",
                boxShadow: "0 24px 60px rgba(22,163,74,0.08), 0 4px 16px rgba(22,163,74,0.04)",
              }}
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-10">
                <div className="logo-ring">
                  <Leaf size={30} className="text-white" />
                </div>
                <h1
                  className="text-3xl font-bold text-green-950 mb-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Selamat Kembali
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Log masuk untuk mengurus jejak karbon ladang anda
                </p>
              </div>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#166534",
                      marginBottom: 8,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Alamat E-mel
                  </label>
                  <div className="input-wrap">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      required
                      placeholder="petani@ladang.com"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#166534", letterSpacing: "0.01em" }}>
                      Kata Laluan
                    </label>
                    <a href="#" style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      Lupa kata laluan?
                    </a>
                  </div>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="input-field"
                    />
                    <button
                      type="button"
                      className="input-right"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="checkbox-wrap">
                  <input type="checkbox" />
                  <span style={{ fontSize: 13, color: "#4b7a5a", fontWeight: 500 }}>Ingat saya selama 30 hari</span>
                </label>

                {/* Submit */}
                <div style={{ marginTop: 4 }}>
                  <button type="submit" className="submit-btn">
                    Log Masuk
                  </button>
                </div>
              </form>

              <div className="divider">atau</div>

              {/* Register nudge */}
              <div
                style={{
                  background: "#f0fdf4",
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: "1px solid #d1fae5",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#4b7a5a", margin: 0 }}>
                  Belum mempunyai akaun?{" "}
                  <Link
                    to="/dashboard"
                    style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}
                  >
                    Daftar Percuma →
                  </Link>
                </p>
              </div>
            </div>

            {/* Below card note */}
            <p style={{ textAlign: "center", fontSize: 12, color: "#86efac", marginTop: 20 }}>
              Data anda disimpan secara lokal dan selamat 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}