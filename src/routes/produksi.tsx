import { createFileRoute } from "@tanstack/react-router";
import { Milk, Beef, Egg, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { produksiBulanan, produksiSusu } from "@/lib/mock-data";

export const Route = createFileRoute("/produksi")({
  head: () => ({
    meta: [
      { title: "Produksi — TernakPro" },
      { name: "description", content: "Catatan produksi susu, daging, dan telur dari peternakan." },
    ],
  }),
  component: ProduksiPage,
});

function ProduksiPage() {
  return (
    <DashboardShell title="Produksi" subtitle="Ringkasan hasil susu, daging, dan telur">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Susu Bulan Ini" value="11.340 L" delta={4.8} icon={Milk} tone="primary" />
        <StatCard label="Daging (Karkas)" value="502 kg" delta={7.9} icon={Beef} tone="accent" />
        <StatCard label="Telur" value="5.480" hint="butir" delta={5.2} icon={Egg} tone="warning" />
        <StatCard label="Rata-rata Harian Susu" value="378 L" delta={2.1} icon={TrendingUp} tone="success" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Produksi 6 Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={produksiBulanan}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="bulan" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="susu" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="telur" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="daging" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Susu Mingguan (Liter)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produksiSusu}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hari" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="liter" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
