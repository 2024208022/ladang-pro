import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { registerNewUser } from "@/lib/store";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerNewUser(name, email, password);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* LEFT SIDE - Dark Green Split */}
      <div className="hidden lg:flex w-1/2 bg-[#0c3b24] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors text-sm mb-12">
            <ArrowLeft className="size-4" /> Kembali ke Laman Utama
          </Link>
          
          <div className="flex items-center gap-3 text-white mb-16">
            <div className="bg-green-600/20 p-2 rounded-xl border border-green-500/30">
              <Leaf className="size-6 text-green-400" />
            </div>
            <h2 className="font-bold text-xl tracking-tight">Ladang Pro</h2>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-green-800/50 border border-green-700/50 text-green-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-2 animate-pulse"></span>
            Percuma untuk 30 Hari Pertama
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
            Mulakan perjalanan <span className="text-green-400 italic font-light">lestari</span> anda hari ini.
          </h1>
          
          <p className="text-green-100/80 text-lg mb-10 max-w-md leading-relaxed">
            Daftar dalam masa kurang dari 2 minit dan dapatkan laporan karbon pertama anda secara percuma.
          </p>

          <div className="space-y-5">
            {[
              "Analisis karbon automatik tanpa kerumitan teknikal",
              "Cadangan tindakan dipersonalisisasi untuk ladang anda",
              "Data selamat disimpan secara lokal di peranti anda"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-green-50/90">
                <CheckCircle2 className="size-6 text-green-400 flex-shrink-0" />
                <span className="text-base">{text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-72 h-72 bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f7f9f4]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-50">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 mb-6">
              <Leaf className="size-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-950 mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
              Daftar Akaun Baharu
            </h2>
            <p className="text-slate-500 text-sm">Sertai Ladang Pro untuk mula mengurus kelestarian ladang anda.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Nama Penuh</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmad Emir" 
                className="w-full h-12 px-4 rounded-xl border border-green-200 bg-[#f7f9f4] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Alamat E-mel</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="petani@ladang.com" 
                className="w-full h-12 px-4 rounded-xl border border-green-200 bg-[#f7f9f4] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">Kata Laluan</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-12 px-4 rounded-xl border border-green-200 bg-[#f7f9f4] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm"
              />
            </div>

            <div className="flex items-start gap-3 mt-4 mb-6">
              <input type="checkbox" required className="mt-1 border-green-300 text-green-600 focus:ring-green-500 rounded" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Saya bersetuju dengan <a href="#" className="text-green-600 font-semibold hover:underline">Terma Perkhidmatan</a> dan <a href="#" className="text-green-600 font-semibold hover:underline">Dasar Privasi</a>
              </p>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-[0_4px_14px_rgba(22,163,74,0.35)] hover:shadow-[0_8px_20px_rgba(22,163,74,0.4)] hover:-translate-y-0.5"
            >
              Daftar Percuma
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Sudah mempunyai akaun?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-700 hover:underline">
              Log Masuk
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}