import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Beef, HeartPulse, Milk, ShieldCheck, Sparkles, Star, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TernakPro — Kelola peternakan lebih cerdas" },
      { name: "description", content: "Landing page TernakPro untuk melihat fitur management ternak, kesehatan, produksi, dan pakan." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const features = [
    { title: "Pantau ternak", description: "Lihat populasi, status kesehatan, dan perkembangan individu dalam satu tampilan.", icon: Beef },
    { title: "Kelola pakan", description: "Cek stok, minimum aman, dan item yang butuh perhatian segera.", icon: Wheat },
    { title: "Catat produksi", description: "Pantau susu, daging, dan telur dari satu dashboard yang rapi.", icon: Milk },
    { title: "Aman dan cepat", description: "Login admin, sesi aman, dan akses terkontrol untuk tim Anda.", icon: ShieldCheck },
  ];

  const testimonials = [
    {
      quote: "Kini kami bisa memantau kesehatan ternak dan stok pakan tanpa bolak-balik dokumen.",
      name: "Bapak Arif",
      role: "Pemilik Peternakan Citra Mandiri",
    },
    {
      quote: "Dashboard-nya ringkas, informatif, dan sangat membantu saat rapat operasional.",
      name: "Ibu Sari",
      role: "Koordinator Produksi",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_38%),linear-gradient(135deg,_#07110c,_#10231a)] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">TernakPro</p>
            <p className="text-sm text-white/70">Portal operasional peternakan</p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link to="/login">Masuk admin</Link>
        </Button>
      </header>

      <main className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 pt-6 lg:px-8 lg:pt-12">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              <HeartPulse className="h-4 w-4" />
              Operasional peternakan yang lebih terarah
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Kelola ternak, pakan, dan produksi dari satu platform yang terasa premium.
              </h1>
              <p className="max-w-2xl text-lg text-white/75">
                TernakPro membantu tim peternakan melihat kondisi harian, mengelola stok, dan memantau produksi dengan dashboard yang bersih, cepat, dan modern.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 shadow-lg shadow-emerald-500/20">
                <Link to="/dashboard" className="flex items-center gap-2">
                  Lihat dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/20">
                <Link to="/login">Demo login</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2">⚡ Update real-time</div>
              <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2">📊 Laporan siap pakai</div>
              <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2">🧠 UI yang modern</div>
            </div>
          </div>

          <Card className="border-white/10 bg-black/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Apa yang bisa Anda pantau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/75">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="font-medium text-white">Dashboard ringkasan</p>
                <p className="mt-1">Populasi, kesehatan, susu, dan stok pakan dalam satu layar.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="font-medium text-white">Manajemen data harian</p>
                <p className="mt-1">Catat ternak, cek kesehatan, dan kelola produksi dengan cepat.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-3 transition-transform duration-300 hover:-translate-y-1">
                <p className="font-medium text-white">Alur kerja yang sederhana</p>
                <p className="mt-1">Pindah dari landing page ke dashboard dengan navigasi yang jelas.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Apa kata mereka</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/80">“{item.quote}”</p>
                  <div className="mt-3">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-white/60">{item.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 backdrop-blur-xl">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">Live demo</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Coba pengalaman admin dalam hitungan menit.</h3>
                <p className="mt-3 max-w-xl text-sm text-white/75">
                  Gunakan kredensial demo untuk melihat dashboard, mengelola data, dan merasakan alur kerja yang lebih profesional.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link to="/login">Masuk demo</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/20">
                  <Link to="/dashboard">Buka dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-white/60 lg:px-8">
        <p>Herd Heartbeat Portal — TernakPro © 2026</p>
      </footer>
    </div>
  );
}
