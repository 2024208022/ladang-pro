import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getLatest, getPrevious, recordPref } from "@/lib/store";
import type { CalcResult } from "@/lib/carbon";
import { ThumbsUp, ThumbsDown, ArrowLeft, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

const COLORS = ["oklch(0.55 0.14 150)", "oklch(0.5 0.1 60)", "oklch(0.7 0.15 80)", "oklch(0.6 0.12 200)", "oklch(0.65 0.18 30)"];

function ResultPage() {
  const [r, setR] = useState<CalcResult | null>(null);
  const [prev, setPrev] = useState<CalcResult | null>(null);
  useEffect(() => {
    setR(getLatest());
    setPrev(getPrevious());
  }, []);

  if (!r) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">No calculation yet. Run one to see your insight.</p>
            <Button asChild><Link to="/calculator">Go to calculator</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const diff = prev ? r.total - prev.total : null;
  const improving = diff !== null && diff < 0;

  const levelColor =
    r.level === "Low"
      ? "bg-[oklch(0.6_0.15_150)] text-white"
      : r.level === "Medium"
      ? "bg-[oklch(0.78_0.15_80)] text-foreground"
      : "bg-[oklch(0.6_0.22_27)] text-white";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hasil Analisis Karbon</h1>
          <p className="text-muted-foreground">Smart insight from your farm data</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/calculator"><ArrowLeft className="size-4 mr-2" /> Edit input</Link>
        </Button>
      </div>

      {/* Insight */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground font-medium">Total emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{format(r.total)}</div>
            <div className="text-sm text-muted-foreground">kgCO₂e</div>
            <Badge className={`mt-3 ${levelColor}`}>{r.level} level</Badge>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {r.level === "High" ? <AlertTriangle className="size-4 text-destructive" /> : r.level === "Medium" ? <Info className="size-4 text-[oklch(0.65_0.18_30)]" /> : <CheckCircle2 className="size-4 text-primary" />}
              Apa maksudnya?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <b>BM:</b>{" "}
              {r.level === "High"
                ? `Pelepasan ladang anda tinggi. Sumber utama ialah ${r.dominant}. Anda perlu ambil tindakan segera.`
                : r.level === "Medium"
                ? `Pelepasan ladang anda sederhana. ${r.dominant} adalah penyumbang terbesar. Masih ada ruang untuk dikurangkan.`
                : `Pelepasan ladang anda rendah. Teruskan amalan baik dan pantau ${r.dominant}.`}
            </p>
            <p className="text-muted-foreground">
              <b>EN:</b>{" "}
              {r.level === "High"
                ? `Your farm emissions are high — driven mainly by ${r.dominant}. Immediate action recommended.`
                : r.level === "Medium"
                ? `Your emissions are moderate. ${r.dominant} is the biggest contributor — there is room to improve.`
                : `Your emissions are low. Keep the good practices and monitor ${r.dominant}.`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Root cause breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={r.breakdown} dataKey="value" nameKey="source" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {r.breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${format(v)} kgCO₂e`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {r.breakdown.map((b, i) => (
                <div key={b.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{b.source}</span>
                    {i === 0 && <Badge variant="secondary">Dominant</Badge>}
                  </div>
                  <span className="font-medium">{b.pct.toFixed(0)}% · {format(b.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By source (kgCO₂e)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={r.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="source" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => `${format(v)} kgCO₂e`} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {r.breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 actions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Top 3 actions today</CardTitle>
          <p className="text-sm text-muted-foreground">Filtered by your constraints. Total potential: <b>−{format(r.actions.reduce((s, a) => s + a.reduction, 0))} kgCO₂e</b></p>
        </CardHeader>
        <CardContent className="space-y-4">
          {r.actions.length === 0 && (
            <p className="text-muted-foreground text-sm">No realistic actions match your constraints. Loosen them in Calculator and recalculate.</p>
          )}
          {r.actions.map((a, i) => (
            <div key={a.title} className="border rounded-xl p-4 flex gap-4 items-start">
              <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{a.title}</h3>
                  <span className="text-primary font-bold">−{format(a.reduction)} kgCO₂e</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.reason}</p>
                <div className="flex gap-2 mt-3 items-center">
                  <Badge variant="secondary">Impact: {a.impact}</Badge>
                  <Badge variant="outline">Effort: {a.effort}</Badge>
                  <Badge variant="outline">Source: {a.source}</Badge>
                  <div className="ml-auto flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => recordPref(a.title, "like")}>
                      <ThumbsUp className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => recordPref(a.title, "dismiss")}>
                      <ThumbsDown className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning feedback */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Learning feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {prev ? (
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Previous" value={`${format(prev.total)} kgCO₂e`} />
              <Stat label="Current" value={`${format(r.total)} kgCO₂e`} />
              <Stat
                label="Change"
                value={`${improving ? "↓" : "↑"} ${format(Math.abs(diff!))}`}
                tone={improving ? "good" : "warn"}
                sub={improving ? "Great — emissions reduced!" : "Higher than last time."}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              This is your first calculation. Run another later to see your progress.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, sub, tone = "neutral" }: { label: string; value: string; sub?: string; tone?: "good" | "warn" | "neutral" }) {
  const c = tone === "good" ? "text-[oklch(0.6_0.15_150)]" : tone === "warn" ? "text-[oklch(0.65_0.18_30)]" : "";
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${c}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function format(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}