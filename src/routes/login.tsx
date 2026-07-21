import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clearAuthSession, saveAuthSession } from "@/lib/auth";
import { validateLoginForm } from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@farm.local");
  const [password, setPassword] = useState("password");
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
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = typeof response.json === "function" ? await response.json().catch(() => null) : null;

      if (!response.ok || !data?.token) {
        throw new Error(data?.error || "Login gagal");
      }

      saveAuthSession({ token: data.token, user: data.user });
      toast.success("Login berhasil. Selamat datang.");
      try {
        await router.navigate({ to: "/dashboard" });
      } catch (navigationError) {
        console.error("Navigation failed", navigationError);
        window.location.assign('/dashboard');
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%),linear-gradient(135deg,_#f8fff8_0%,_#f3f8ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 rounded-[28px] border border-border/60 bg-background/90 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="flex flex-col justify-between rounded-[24px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                TernakPro Admin Portal
              </div>
              <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
                Kelola ternak Anda dengan lebih tenang dan terarah.
              </h1>
              <p className="mt-4 max-w-md text-sm text-white/90 sm:text-base">
                Pantau data ternak, kesehatan, produksi, dan pemilik dalam satu dashboard yang modern.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Akses aman untuk administrator</p>
                  <p className="text-sm text-white/85">Login menggunakan kredensial demo yang sudah disiapkan.</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground">Masuk ke akun admin</CardTitle>
              <p className="text-sm text-muted-foreground">
                Silakan gunakan email dan password yang telah disediakan.
              </p>
            </CardHeader>
            <CardContent className="px-0">
              <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Email admin</label>
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((current) => ({ ...current, email: "" }));
                    }}
                    placeholder="admin@farm.local"
                    type="email"
                    required
                    className="h-11 rounded-xl border-border/70 bg-background/80"
                  />
                  {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((current) => ({ ...current, password: "" }));
                    }}
                    placeholder="Masukkan password"
                    type="password"
                    required
                    className="h-11 rounded-xl border-border/70 bg-background/80"
                  />
                  {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
                </div>
                {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="h-11 w-full rounded-xl" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
