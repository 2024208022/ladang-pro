import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, TrendingDown, TrendingUp, Calculator as CalcIcon } from "lucide-react";
import { loadHistory } from "@/lib/store";
import type { CalcResult } from "@/lib/carbon";

// We changed this to target "/dashboard"
export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [history, setHistory] = useState<CalcResult[]>([]);
  useEffect(() => setHistory(loadHistory()), []);
  const latest = history[0];
  const prev = history[1];
  const diff = latest && prev ? latest.total - prev.total : 0;
  const improving = diff < 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Selamat datang, petani 🌾</h1>
        <p className="text-muted-foreground mt-1">
          Track, understand, and reduce your farm carbon footprint.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Latest emissions"
          value={latest ? `${formatNum(latest.total)} kgCO₂e` : "—"}
          sub={latest ? `Level: ${latest.level}` : "Run your first calculation"}
          icon={<Leaf className="size-5" />}
        />
        <StatCard
          label="Top source"
          value={latest?.dominant ?? "—"}
          sub={latest ? `${latest.breakdown[0]?.pct.toFixed(0)}% of total` : "No data"}
          icon={<CalcIcon className="size-5" />}
        />
        <StatCard
          label="Trend vs last"
          value={prev ? `${improving ? "↓" : "↑"} ${formatNum(Math.abs(diff))}` : "—"}
          sub={prev ? (improving ? "Improving — good job!" : "Higher than before") : "Need 2 records"}
          icon={improving ? <TrendingDown className="size-5" /> : <TrendingUp className="size-5" />}
          tone={prev ? (improving ? "good" : "warn") : "neutral"}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What can you do today?</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Enter your fuel & electricity usage to receive your top 3 personalised actions.
          </p>
          <Button asChild>
            <Link to="/calculator">
              Start calculation <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {latest && (
        <Card>
          <CardHeader>
            <CardTitle>Your last 3 actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latest.actions.map((a) => (
              <div key={a.title} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.reason}</div>
                </div>
                <div className="text-sm text-primary font-semibold whitespace-nowrap ml-4">
                  −{formatNum(a.reduction)} kgCO₂e
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneCls =
    tone === "good" ? "text-[oklch(0.6_0.15_150)]" : tone === "warn" ? "text-[oklch(0.65_0.18_30)]" : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <span>{label}</span>
          <span className="size-9 rounded-lg bg-accent text-accent-foreground grid place-items-center">{icon}</span>
        </div>
        <div className={`text-2xl font-bold mt-2 ${toneCls}`}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
      </CardContent>
    </Card>
  );
}

function formatNum(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}