import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Calculator, FileText, History, Settings, LogOut, Leaf } from "lucide-react";
import { getCurrentUser, logout } from "@/lib/store"; 

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Papan Pemuka" },
    { to: "/calculator", icon: Calculator, label: "Kalkulator Karbon" },
    { to: "/result", icon: FileText, label: "Laporan Keputusan" },
    { to: "/history", icon: History, label: "Sejarah" },
    { to: "/settings", icon: Settings, label: "Tetapan" },
  ];

  return (
    <div className="w-64 bg-green-950 text-white flex flex-col min-h-screen font-sans">
      {/* Logo Area */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
          <div className="bg-green-600 p-2 rounded-xl">
            <Leaf className="size-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight leading-tight">Ladang Pro</h2>
            <p className="text-green-300 text-[10px] uppercase tracking-wider font-semibold">Bantuan Keputusan Karbon</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-green-800 text-white shadow-sm" 
                  : "text-green-100 hover:bg-green-900/50 hover:text-white"
              }`}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Dynamic User Profile */}
      <div className="p-4 border-t border-green-900/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-900/30 mb-3 border border-green-800/50">
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-sm font-bold text-white uppercase shadow-inner">
            {user ? user.name.charAt(0) : "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user ? user.name : "Petani Tetamu"}
            </p>
            <p className="text-xs text-green-400 truncate">
              {user ? user.email : "Sila log masuk"}
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-green-300 hover:text-white hover:bg-green-800/80 rounded-xl transition-all"
        >
          <LogOut className="size-4" />
          Log Keluar
        </button>
      </div>
    </div>
  );
}