import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { loadHistory } from "@/lib/store";
import type { CalcResult } from "@/lib/carbon";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<CalcResult[]>([]);
  useEffect(() => setItems(loadHistory()), []);

  const chartData = [...items].reverse().map((r, i) => ({
    name: `#${i + 1}`,
    total: Math.round(r.total),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">History</h1>
          <p className="text-muted-foreground">Track your emissions over time.</p>
        </div>
        <Button asChild><Link to="/calculator">New calculation</Link></Button>
      </header>

      {items.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No calculations yet.</CardContent></Card>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="oklch(0.5 0.13 150)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Records</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {items.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{new Date(r.date).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Top: {r.dominant}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{r.level}</Badge>
                    <div className="font-bold">{Math.round(r.total).toLocaleString()} kgCO₂e</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}