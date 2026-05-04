import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { calculate, type FuelEntry, type Region, type Constraints } from "@/lib/carbon";
import { saveResult } from "@/lib/store";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/calculator")({
  component: CalculatorPage,
});

function CalculatorPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FuelEntry[]>([
    { id: crypto.randomUUID(), activity: "Mobile combustion", fuel: "Diesel", amount: 0 },
  ]);
  const [region, setRegion] = useState<Region>("Peninsular");
  const [electricity, setElectricity] = useState<number>(0);
  const [c, setC] = useState<Constraints>({
    budget: "Medium",
    machineAvailable: true,
    weather: "Good",
    time: "Flexible",
    labor: "Medium",
  });

  const update = (id: string, patch: Partial<FuelEntry>) =>
    setEntries((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => setEntries((p) => p.filter((e) => e.id !== id));
  const add = () =>
    setEntries((p) => [
      ...p,
      { id: crypto.randomUUID(), activity: "Mobile combustion", fuel: "Diesel", amount: 0 },
    ]);

  const submit = () => {
    const result = calculate({ entries, region, electricity, constraints: c });
    saveResult(result);
    navigate({ to: "/result" });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Kalkulator Karbon</h1>
        <p className="text-muted-foreground">Isi data aktiviti ladang anda untuk dapatkan analisis & tindakan.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scope 1 — Pembakaran Bahan Api</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map((e, idx) => (
            <div key={e.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4">
                <Label className="mb-2 block">Jenis aktiviti</Label>
                <Select
                  value={e.activity}
                  onValueChange={(v) => update(e.id, { activity: v as FuelEntry["activity"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile combustion">Mobile combustion</SelectItem>
                    <SelectItem value="Stationary combustion">Stationary combustion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label className="mb-2 block">Jenis bahan api</Label>
                <Select
                  value={e.fuel}
                  onValueChange={(v) => update(e.id, { fuel: v as FuelEntry["fuel"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                    <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4">
                <Label className="mb-2 block">Jumlah penggunaan</Label>
                <Input
                  type="number"
                  min={0}
                  value={e.amount || ""}
                  onChange={(ev) => update(e.id, { amount: Number(ev.target.value) || 0 })}
                  placeholder="cth: 250"
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={entries.length === 1}
                  onClick={() => remove(e.id)}
                  aria-label="Buang"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {idx < entries.length - 1 && <div className="col-span-12 border-b" />}
            </div>
          ))}
          <Button variant="outline" onClick={add}>
            <Plus className="size-4 mr-2" /> Tambah bahan api
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scope 2 — Elektrik</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Grid region</Label>
            <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Peninsular">Peninsular</SelectItem>
                <SelectItem value="Sabah">Sabah</SelectItem>
                <SelectItem value="Sarawak">Sarawak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Annual electricity (kWh)</Label>
            <Input
              type="number"
              min={0}
              value={electricity || ""}
              onChange={(e) => setElectricity(Number(e.target.value) || 0)}
              placeholder="cth: 12000"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Constraints — Sumber & Keadaan Anda</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-5">
          <Field label="Budget">
            <Select value={c.budget} onValueChange={(v) => setC({ ...c, budget: v as Constraints["budget"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Weather">
            <Select value={c.weather} onValueChange={(v) => setC({ ...c, weather: v as Constraints["weather"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Rainy">Rainy</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Time available">
            <Select value={c.time} onValueChange={(v) => setC({ ...c, time: v as Constraints["time"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Labor">
            <Select value={c.labor} onValueChange={(v) => setC({ ...c, labor: v as Constraints["labor"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Machine available?">
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={c.machineAvailable}
                onCheckedChange={(v) => setC({ ...c, machineAvailable: v })}
              />
              <span className="text-sm text-muted-foreground">{c.machineAvailable ? "Yes" : "No"}</span>
            </div>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={submit} className="gap-2">
          <Sparkles className="size-4" /> Calculate & get my plan
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}