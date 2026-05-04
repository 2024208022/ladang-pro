import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calculator, Sparkles, History, Settings, Sprout } from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Calculator", url: "/calculator", icon: Calculator },
  { title: "Result", url: "/result", icon: Sparkles },
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
        <div className="size-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center">
          <Sprout className="size-5" />
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">Ladang Pro</div>
          <div className="text-xs opacity-70">Carbon Decision Support</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.url;
          return (
            <Link
              key={it.url}
              to={it.url}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <it.icon className="size-4" />
              {it.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs opacity-60 border-t border-sidebar-border">
        🌱 Smart farm assistant
      </div>
    </aside>
  );
}