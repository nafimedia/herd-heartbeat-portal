import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Activity,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { clearAuthSession, saveAuthSession } from "@/lib/auth";
import { validateLoginForm } from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — KARTANING" },
      { name: "description", content: "Portal login administrator KARTANING - Sistem Manajemen Peternakan Mindajaya." },
    ],
  }),
  component: LoginPage,
});

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearAuthSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Periksa kembali data yang Anda masukkan.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = typeof response.json === "function" ? await response.json().catch(() => null) : null;

      if (!response.ok || !data?.token) {
        throw new Error(data?.error || "Login gagal");
      }

      saveAuthSession({ token: data.token, user: data.user });
      toast.success("Login berhasil. Selamat datang di Dashboard Admin.");
      try {
        await router.navigate({ to: "/dashboard" });
      } catch (navigationError) {
        console.error("Navigation failed", navigationError);
        window.location.assign("/dashboard");
      }
    } catch (loginError) {
      console.error("Login failed", loginError);
      setError("Email atau password tidak valid.");
      toast.error("Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Dynamic Ambient Glow Background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:grid-cols-12">
          {/* Left Branding Hero Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white lg:col-span-6 lg:p-10">
            {/* Background Pattern Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />

            <div>
              {/* Back to landing page link */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Beranda Landing Page
              </Link>

              {/* Logo & Portal Badge */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 p-2 backdrop-blur shadow-inner">
                  <img
                    src="/images/logomindajaya.png"
                    alt="Minda Jaya Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">KARTANING</h2>
                  <p className="text-xs text-white/80 font-medium">Sistem Pendataan & Manajemen Peternakan</p>
                </div>
              </div>

              <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Operasional Peternakan yang Lebih Terstruktur.
              </h1>
              <p className="mt-4 text-sm text-white/85 leading-relaxed">
                Kelola data ternak (Kambing, Domba, Sapi, Ayam, Bebek), rekam kartu kesehatan medis, persediaan obat & stok pakan secara profesional dalam satu portal admin.
              </p>
            </div>

            {/* Feature Highlights Card */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Pendataan Multi-Jenis Ternak</p>
                  <p className="text-white/75">Pencatatan lengkap sapi, kambing, domba & unggas.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-teal-300 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Akses Admin Terproteksi</p>
                  <p className="text-white/75">Autentikasi aman dengan kontrol sesi terenkripsi.</p>
                </div>
              </div>
            </div>

            {/* Footer Credit */}
            <div className="mt-8 border-t border-white/15 pt-4 text-[11px] text-white/70">
              Created by : tim PKM posyandu ternak unu purwokerto dan kelompok ternak mindajaya farm 2026
            </div>
          </div>

          {/* Right Form Login Panel */}
          <div className="flex flex-col justify-between bg-slate-900 p-8 lg:col-span-6 lg:p-10">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <KeyRound className="mr-1 h-3 w-3" /> Portal Administrator
                </Badge>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">Masuk ke Akun Admin</h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Masukkan email dan password untuk mengakses dashboard manajemen KARTANING.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Email Administrator
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="admin@farm.local"
                      required
                      className="h-11 rounded-xl border-slate-700 bg-slate-800/80 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      placeholder="Masukkan password"
                      required
                      className="h-11 rounded-xl border-slate-700 bg-slate-800/80 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-rose-400">{errors.password}</p>}
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                    {error}
                  </div>
                )}

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span>Ingat sesi browser saya</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    "Memproses Login..."
                  ) : (
                    <>
                      Masuk ke Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
