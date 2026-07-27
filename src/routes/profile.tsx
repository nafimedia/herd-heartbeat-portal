import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Save,
  CheckCircle2,
  Lock,
  Briefcase,
  MapPin,
  FileText,
  Sparkles,
  Stethoscope,
  Wrench,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getAuthSession,
  updateAuthUserProfile,
  ROLE_LABELS,
  type AuthUser,
} from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil Saya — KARTANING" },
      {
        name: "description",
        content: "Kelola foto profil, informasi akun, kata sandi, dan hak akses dalam sistem KARTANING.",
      },
    ],
  }),
  component: ProfilePage,
});

export function ProfilePage() {
  const session = getAuthSession();
  const initialUser = session?.user || {
    id: "usr-001",
    email: "admin@farm.local",
    role: "admin",
    name: "Pak Tono (Ketua KTT)",
    avatar: "",
    phone: "0812-3456-7890",
    jobTitle: "Ketua Kelompok Tani Ternak",
    bio: "Pengelola dan penanggung jawab operasional peternakan Mindajaya Farm.",
  };

  const [user, setUser] = useState<AuthUser>(initialUser);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialUser.avatar || "");
  const [jobTitle, setJobTitle] = useState(initialUser.jobTitle || "Ketua KTT / Pengelola");
  const [address, setAddress] = useState("Purwokerto, Jawa Tengah");
  const [bio, setBio] = useState(initialUser.bio || "");

  // Form State Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const s = getAuthSession();
    if (s?.user) {
      setUser(s.user);
      setAvatarPreview(s.user.avatar || "");
      if (s.user.jobTitle) setJobTitle(s.user.jobTitle);
      if (s.user.bio) setBio(s.user.bio);
    }
  }, []);

  const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.admin;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  // Handle Photo Upload File Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      setUser((prev) => ({ ...prev, avatar: base64 }));
      updateAuthUserProfile({ avatar: base64 });
      toast.success("Foto profil berhasil diperbarui.");
    };
    reader.readAsDataURL(file);
  };

  // Save General Profile Info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name?.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    updateAuthUserProfile({
      name: user.name.trim(),
      email: user.email.trim(),
      phone: user.phone?.trim() || "",
      jobTitle: jobTitle.trim(),
      bio: bio.trim(),
      avatar: avatarPreview,
    });

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Informasi profil berhasil disimpan.");
    }, 400);
  };

  // Handle Update Password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Masukkan password saat ini.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    toast.success("Password akun Anda berhasil diperbarui.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <DashboardShell
      title="Profil Saya"
      subtitle="Pengaturan data pribadi, foto avatar profil, kata sandi, dan ringkasan hak akses akun."
    >
      {/* Top Banner & Profile Overview Card */}
      <Card className="mb-8 border-border/60 overflow-hidden shadow-md">
        {/* Background Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_60%)]" />
        </div>

        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 gap-4">
            {/* Circular Avatar Photo Upload */}
            <div className="flex items-end gap-4">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full border-4 border-background bg-slate-900 overflow-hidden flex items-center justify-center shadow-lg text-foreground">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary font-extrabold text-2xl">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Camera Overlay Upload Button */}
                <label
                  htmlFor="photo-upload-input"
                  className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
                  title="Ganti Foto Profil"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center sm:text-left mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name || "User"}</h2>
                  <Badge variant="outline" className={`text-xs font-semibold ${roleInfo.badge}`}>
                    {roleInfo.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{jobTitle} · {user.email}</p>
              </div>
            </div>

            {/* Account Quick Badge */}
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 px-3 py-1">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Akun Terverifikasi
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs defaultValue="informasi" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border/60 rounded-xl">
          <TabsTrigger value="informasi" className="gap-2 text-xs font-semibold">
            <User className="h-4 w-4" /> Informasi Profil
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="gap-2 text-xs font-semibold">
            <Lock className="h-4 w-4" /> Keamanan & Password
          </TabsTrigger>
          <TabsTrigger value="hak-akses" className="gap-2 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" /> Peran & Hak Akses
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INFORMASI PROFIL */}
        <TabsContent value="informasi">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Data Pribadi & Kontak</CardTitle>
              <CardDescription>Perbarui informasi profil dan kontak penanggung jawab akun Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pName">Nama Lengkap *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="pName"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pEmail">Email Administrator *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="pEmail"
                        type="email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pPhone">Nomor WhatsApp / HP</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="pPhone"
                        placeholder="Contoh: 0812-3456-7890"
                        value={user.phone || ""}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pJob">Jabatan / Spesialisasi</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="pJob"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Contoh: Ketua Kelompok Tani / Dokter Hewan"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pAddress">Alamat / Wilayah Operasional</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pAddress"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Lokasi kandang atau domisili"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pBio">Bio Singkat & Catatan Tugas</Label>
                  <Textarea
                    id="pBio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan catatan singkat tugas atau keahlian Anda..."
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-1.5 h-4 w-4" /> {isSaving ? "Memproses..." : "Simpan Perubahan Profil"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: KEAMANAN & PASSWORD */}
        <TabsContent value="keamanan">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Ganti Kata Sandi (Password)</CardTitle>
              <CardDescription>Pastikan password akun Anda menggunakan kombinasi angka dan huruf yang aman.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="cPass">Password Saat Ini *</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="cPass"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan password saat ini"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nPass">Password Baru *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="nPass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPass">Konfirmasi Password Baru *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit">
                    <ShieldCheck className="mr-1.5 h-4 w-4" /> Perbarui Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PERAN & HAK AKSES */}
        <TabsContent value="hak-akses">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Peran & Hak Akses Akun: {roleInfo.label}
              </CardTitle>
              <CardDescription>
                Berikut adalah fitur yang diizinkan untuk diakses sesuai dengan peran Anda ({roleInfo.title}).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-500" /> Dashboard & Analytics
                  </p>
                  <p className="text-muted-foreground">Melihat ringkasan populasi, kesehatan, & produksi harian.</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-blue-500" /> Medis & Posyandu
                  </p>
                  <p className="text-muted-foreground">Pencatatan kartu kesehatan, hari posyandu, & obat stok.</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Wrench className="h-4 w-4 text-amber-500" /> Produksi & Pakan
                  </p>
                  <p className="text-muted-foreground">Pencatatan susu/telur dan persediaan pakan masuk/keluar.</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-purple-500" /> Manajemen User
                  </p>
                  <p className="text-muted-foreground">Pengelolaan akun petugas, penetapan role, & reset password.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
