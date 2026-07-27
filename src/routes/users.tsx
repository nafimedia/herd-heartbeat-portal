import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  Pencil,
  Trash2,
  KeyRound,
  Download,
  CheckCircle2,
  XCircle,
  UserCheck,
  Activity,
  Stethoscope,
  Wrench,
  User,
} from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";
import { ROLE_LABELS, type UserRole } from "@/lib/auth";
import {
  loadUserAccounts,
  saveUserAccounts,
  type UserAccount,
} from "@/lib/user-data";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Manajemen User & Role — KARTANING" },
      {
        name: "description",
        content: "Kelola daftar pengguna, peran (role), hak akses, dan status akun dalam sistem KARTANING.",
      },
    ],
  }),
  component: UsersPage,
});

export function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("semua");
  const [statusFilter, setStatusFilter] = useState<string>("semua");

  // Modal State User Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator" as UserRole,
    phone: "",
    status: "Aktif" as "Aktif" | "Nonaktif",
  });

  // Modal State Reset Password
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setUsers(loadUserAccounts());
  }, []);

  const syncUsers = (newList: UserAccount[]) => {
    setUsers(newList);
    saveUserAccounts(newList);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormUser({
      name: "",
      email: "",
      password: "password",
      role: "operator",
      phone: "",
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (userItem: UserAccount) => {
    setEditingUser(userItem);
    setFormUser({
      name: userItem.name,
      email: userItem.email,
      password: "",
      role: userItem.role,
      phone: userItem.phone,
      status: userItem.status,
    });
    setIsModalOpen(true);
  };

  // Save User Form
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUser.name.trim() || !formUser.email.trim()) {
      toast.error("Nama dan Email wajib diisi.");
      return;
    }

    if (editingUser) {
      const updatedList = users.map((item) =>
        item.id === editingUser.id
          ? {
              ...item,
              name: formUser.name.trim(),
              email: formUser.email.trim(),
              role: formUser.role,
              phone: formUser.phone.trim(),
              status: formUser.status,
            }
          : item
      );
      syncUsers(updatedList);
      toast.success(`Data akun ${formUser.name} berhasil diperbarui.`);
    } else {
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: formUser.name.trim(),
        email: formUser.email.trim(),
        role: formUser.role,
        phone: formUser.phone.trim() || "-",
        status: formUser.status,
        registeredDate: new Date().toISOString().slice(0, 10),
        lastLogin: "Baru dibuat",
      };
      syncUsers([newUser, ...users]);
      toast.success(`Akun ${formUser.name} (${ROLE_LABELS[formUser.role].label}) berhasil dibuat.`);
    }

    setIsModalOpen(false);
  };

  // Save Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error("Password baru wajib diisi.");
      return;
    }

    toast.success(`Password untuk ${resetUser?.name} berhasil direset.`);
    setIsResetModalOpen(false);
    setNewPassword("");
    setResetUser(null);
  };

  // Toggle User Active Status
  const handleToggleStatus = (userItem: UserAccount) => {
    const nextStatus = userItem.status === "Aktif" ? "Nonaktif" : "Aktif";
    const updated = users.map((u) => (u.id === userItem.id ? { ...u, status: nextStatus } : u));
    syncUsers(updated);
    toast.success(`Status akun ${userItem.name} diubah menjadi ${nextStatus}.`);
  };

  // Delete User Account
  const handleDeleteUser = (userItem: UserAccount) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${userItem.name}?`)) {
      const filtered = users.filter((u) => u.id !== userItem.id);
      syncUsers(filtered);
      toast.success(`Akun ${userItem.name} telah dihapus.`);
    }
  };

  // Export Users CSV
  const handleExportUsers = () => {
    downloadCsv("daftar_user_role.csv", users as unknown as Record<string, unknown>[]);
    toast.success("Daftar Pengguna berhasil diekspor CSV.");
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q);
    const matchRole = roleFilter === "semua" || u.role === roleFilter;
    const matchStatus = statusFilter === "semua" || u.status === statusFilter;
    return matchQuery && matchRole && matchStatus;
  });

  // Calculate Role Stats
  const countAdmin = users.filter((u) => u.role === "admin").length;
  const countMedis = users.filter((u) => u.role === "medis").length;
  const countOperator = users.filter((u) => u.role === "operator").length;
  const countPeternak = users.filter((u) => u.role === "peternak").length;

  return (
    <DashboardShell
      title="Manajemen User & Role"
      subtitle="Kelola pengguna sistem, hak akses (Super Admin, Medis, Operator, Peternak), dan status akun."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportUsers}>
            <Download className="mr-1.5 h-4 w-4" /> Ekspor CSV
          </Button>
          <Button size="sm" onClick={handleOpenAddModal}>
            <UserPlus className="mr-1.5 h-4 w-4" /> Tambah User Baru
          </Button>
        </div>
      }
    >
      {/* Overview Role Metric Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Super Admin</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{countAdmin} Akun</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/20">
              <Stethoscope className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Petugas Medis</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{countMedis} Akun</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/20">
              <Wrench className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Operator Lapangan</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{countOperator} Akun</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 border border-purple-500/20">
              <User className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Mitra Peternak</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{countPeternak} Akun</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Terdaftar</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{users.length} User</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama pengguna, email, atau nomor HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Peran (Role)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Role</SelectItem>
              <SelectItem value="admin">Super Admin</SelectItem>
              <SelectItem value="medis">Petugas Medis</SelectItem>
              <SelectItem value="operator">Operator Lapangan</SelectItem>
              <SelectItem value="peternak">Mitra Peternak</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table List */}
      <Card className="border-border/60">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base font-semibold">Daftar Pengguna Sistem KARTANING</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna / Akun</TableHead>
                  <TableHead>Role / Peran Akses</TableHead>
                  <TableHead>Kontak / No. HP</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Terakhir Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Tidak ada pengguna yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => {
                    const roleInfo = ROLE_LABELS[u.role] || ROLE_LABELS.admin;
                    const initials = u.name
                      ? u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "US";

                    return (
                      <TableRow key={u.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs border border-primary/20 shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className={`text-xs font-semibold ${roleInfo.badge}`}>
                            {roleInfo.label}
                          </Badge>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{roleInfo.title}</p>
                        </TableCell>

                        <TableCell className="text-xs font-mono font-medium text-foreground">
                          {u.phone}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {u.registeredDate}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {u.lastLogin}
                        </TableCell>

                        <TableCell>
                          {u.status === "Aktif" ? (
                            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
                              <XCircle className="mr-1 h-3 w-3" /> Nonaktif
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit User & Role"
                              onClick={() => handleOpenEditModal(u)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              title="Reset Password"
                              onClick={() => {
                                setResetUser(u);
                                setNewPassword("password123");
                                setIsResetModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-500/10 hover:text-amber-600"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              title={u.status === "Aktif" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                              onClick={() => handleToggleStatus(u)}
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              title="Hapus Akun"
                              onClick={() => handleDeleteUser(u)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG 1: TAMBAH / EDIT USER & ROLE */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User & Role" : "Tambah User Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="uName">Nama Lengkap *</Label>
              <Input
                id="uName"
                placeholder="Contoh: Pak Tono / Drh. Ahmad"
                value={formUser.name}
                onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uEmail">Email Pengguna *</Label>
              <Input
                id="uEmail"
                type="email"
                placeholder="Contoh: nama@farm.local"
                value={formUser.email}
                onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                required
              />
            </div>

            {!editingUser && (
              <div className="space-y-1.5">
                <Label htmlFor="uPassword">Password Awal *</Label>
                <Input
                  id="uPassword"
                  type="text"
                  value={formUser.password}
                  onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                  placeholder="Masukkan password"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Peran (Role Hak Akses) *</Label>
              <Select
                value={formUser.role}
                onValueChange={(val) => setFormUser({ ...formUser, role: val as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Super Admin / Ketua Tani (Akses Penuh)</SelectItem>
                  <SelectItem value="medis">Petugas Medis / Dokter Hewan (Rekam Medis & Obat)</SelectItem>
                  <SelectItem value="operator">Operator Lapangan (Ternak, Produksi & Pakan)</SelectItem>
                  <SelectItem value="peternak">Mitra Peternak (Read-Only Ternak Miliknya)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uPhone">Nomor HP / Whatsapp</Label>
              <Input
                id="uPhone"
                placeholder="Contoh: 0812-3456-7890"
                value={formUser.phone}
                onChange={(e) => setFormUser({ ...formUser, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status Akun</Label>
              <Select
                value={formUser.status}
                onValueChange={(val) => setFormUser({ ...formUser, status: val as "Aktif" | "Nonaktif" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: RESET PASSWORD */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password Pengguna</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Reset password untuk pengguna <strong className="text-foreground">{resetUser?.name}</strong> ({resetUser?.email}).
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="nPass">Password Baru</Label>
              <Input
                id="nPass"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password baru"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsResetModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Reset Password Now</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
