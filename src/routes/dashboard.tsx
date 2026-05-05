import { createFileRoute, Link } from "@tanstack/react-router";
import { getCurrentUser, loadHistory } from "@/lib/store";
import { ArrowRight, Leaf, Calculator, TrendingDown, TrendingUp, History, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const user = getCurrentUser();
  const history = loadHistory();
  const hasCalculations = history.length > 0;

  // Grab the latest and previous calculations to show trends
  const latest = hasCalculations ? history[0] : null;
  const previous = history.length > 1 ? history[1] : null;

  // Calculate percentage change if we have at least 2 records
  let trend = 0;
  let isGoodTrend = true;
  if (latest && previous && previous.totalEmissions > 0) {
    trend = ((latest.totalEmissions - previous.totalEmissions) / previous.totalEmissions) * 100;
    isGoodTrend = trend <= 0; // Less emissions is good!
  }

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Baru sahaja";
    return new Date(isoString).toLocaleDateString('ms-MY', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="p-6 md:p-10 bg-[#f7f9f4] min-h-screen font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-950 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Selamat datang, {user ? user.name.split(' ')[0] : "Petani"}! 👋
            </h1>
            <p className="text-slate-600 text-lg">
              Pantau dan urus prestasi kelestarian ladang anda di sini.
            </p>
          </div>
          <Link 
            to="/calculator" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-[0_4px_14px_rgba(22,163,74,0.25)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.3)] hover:-translate-y-0.5 flex-shrink-0"
          >
            <Calculator className="size-5" /> Kira Baru
          </Link>
        </header>

        {!hasCalculations ? (
          /* EMPTY STATE - If they haven't calculated anything yet */
          <div className="bg-white rounded-3xl p-12 text-center border border-green-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Leaf className="size-10 text-green-300" />
            </div>
            <h2 className="text-2xl font-bold text-green-950 mb-3" style={{ fontFamily: "'Fraunces', serif" }}>Tiada Rekod Karbon</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Papan pemuka anda masih kosong. Jalankan pengiraan pertama anda untuk mula melihat data dan analitik ladang.
            </p>
            <Link to="/calculator" className="px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
              Mula Kira Sekarang
            </Link>
          </div>
        ) : (
          /* DASHBOARD CONTENT - If they have data */
          <div className="space-y-8">
            
            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Emissions Card */}
              <div className="bg-green-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-green-900/10">
                <div className="absolute -right-6 -top-6 opacity-10">
                  <Leaf className="size-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-green-300 font-medium mb-2">Jejak Karbon Terkini</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold">{latest?.totalEmissions.toFixed(0)}</span>
                    <span className="text-lg text-green-400">kg CO₂e</span>
                  </div>
                  
                  {previous && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${isGoodTrend ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {isGoodTrend ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
                      {Math.abs(trend).toFixed(1)}% berbanding rekod lepas
                    </div>
                  )}
                </div>
              </div>

              {/* Scope Breakdown Cards */}
              <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 font-medium">Scope 1 (Bahan Api)</p>
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle className="size-4" /></div>
                </div>
                <p className="text-3xl font-bold text-green-950 mb-1">{latest?.scope1.toFixed(0)} <span className="text-sm font-normal text-slate-400">kg CO₂e</span></p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(latest!.scope1 / latest!.totalEmissions) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 font-medium">Scope 2 (Elektrik)</p>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Leaf className="size-4" /></div>
                </div>
                <p className="text-3xl font-bold text-green-950 mb-1">{latest?.scope2.toFixed(0)} <span className="text-sm font-normal text-slate-400">kg CO₂e</span></p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(latest!.scope2 / latest!.totalEmissions) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: Visual Breakdown & Recommended Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Root Cause Visualizer */}
              <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
                <h3 className="text-xl font-bold text-green-950 mb-6 font-display">Punca Pelepasan Utama</h3>
                <div className="space-y-5">
                  {latest?.breakdown.map((item, i) => {
                    const percentage = (item.value / latest.totalEmissions) * 100;
                    // Give highest emitter a red color, others green
                    const barColor = i === 0 ? "bg-red-400" : "bg-green-400"; 
                    
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm font-medium mb-1.5">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-green-950 font-bold">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Highlighted Action */}
              <div className="bg-gradient-to-br from-green-50 to-[#ecfdf5] rounded-3xl p-8 border border-green-200 shadow-sm flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-200/50 text-green-800 text-xs font-bold rounded-full mb-4 self-start">
                  <CheckCircle2 className="size-3.5" /> Fokus Utama Anda
                </div>
                <h3 className="text-2xl font-bold text-green-950 mb-3 leading-tight">
                  {latest?.topActions[0]?.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {latest?.topActions[0]?.description}
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1.5 bg-white text-green-800 text-xs font-bold rounded-lg border border-green-100 shadow-sm">
                    Kos: {latest?.topActions[0]?.cost}
                  </span>
                  <span className="px-3 py-1.5 bg-white text-green-800 text-xs font-bold rounded-lg border border-green-100 shadow-sm">
                    Impak: {latest?.topActions[0]?.impact}
                  </span>
                </div>
              </div>

            </div>

            {/* BOTTOM ROW: History Table */}
            <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-950 font-display">Sejarah Pengiraan</h3>
                <Link to="/history" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                  Lihat Semua <ArrowRight className="size-4" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-green-100">
                      <th className="pb-3 pt-2 px-4 text-sm font-semibold text-slate-500">Tarikh</th>
                      <th className="pb-3 pt-2 px-4 text-sm font-semibold text-slate-500">Total (kg CO₂e)</th>
                      <th className="pb-3 pt-2 px-4 text-sm font-semibold text-slate-500 hidden sm:table-cell">Scope 1</th>
                      <th className="pb-3 pt-2 px-4 text-sm font-semibold text-slate-500 hidden sm:table-cell">Scope 2</th>
                      <th className="pb-3 pt-2 px-4 text-sm font-semibold text-slate-500 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 5).map((entry, idx) => (
                      <tr key={idx} className="border-b border-green-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-medium text-slate-700">
                          {formatDate(entry.timestamp)}
                        </td>
                        <td className="py-4 px-4 font-bold text-green-900">
                          {entry.totalEmissions.toFixed(0)}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500 hidden sm:table-cell">
                          {entry.scope1.toFixed(0)}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500 hidden sm:table-cell">
                          {entry.scope2.toFixed(0)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to="/result" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                            <ArrowRight className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}