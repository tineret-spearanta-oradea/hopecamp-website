"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { UserData } from "@/types/userData";
import { getAllUsersData, getUserData, updateUserData } from "@/lib/supabase/database/user"; // Import Supabase functions
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  UserMinus,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

type SuperAdminPromptData = {
  userId: string;
  userName: string;
  currentAdmin: boolean;
} | null;

export default function AdminsPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminUid, setNewAdminUid] = useState(""); // Changed from email to UID
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [superAdminPrompt, setSuperAdminPrompt] =
    useState<SuperAdminPromptData>(null);
  const [superAdminReason, setSuperAdminReason] = useState("");
  const { toast } = useToast();

  // Redirect if not super admin
  useEffect(() => {
    if (!userData?.isSuperAdmin) {
      router.push("/admin");
    }
  }, [userData, router]);

  // Fetch admins using Supabase
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true); // Ensure loading state is set
      try {
        const allUsers = await getAllUsersData();
        const adminsData = allUsers.filter(user => user.isAdmin);
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast({
          title: "Eroare",
          description: "Nu am putut prelua lista de admini",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  // Update roles using Supabase
  const handleRoleUpdate = async (userId: string, updates: Partial<Omit<UserData, 'uid'>>) => {
    // Ensure uid is not in the updates object passed to Supabase update function
    const adminToUpdate = admins.find(admin => admin.uid === userId);
    if (!adminToUpdate) {
        console.error("Admin not found for update:", userId);
        toast({ title: "Eroare", description: "Adminul nu a fost găsit.", variant: "destructive" });
        return;
    }

    const updatedAdminData: UserData = { ...adminToUpdate, ...updates };

    try {
      await updateUserData(updatedAdminData); // Use Supabase update function
      setAdmins(
        admins.map((admin) =>
          admin.uid === userId ? { ...admin, ...updates } : admin
        )
      );

      // If removing admin status, remove from the list
      if (!updates.isAdmin) {
        setAdmins(admins.filter((admin) => admin.uid !== userId));
      }

      toast({
        title: "Succes",
        description: "Rolurile au fost actualizate cu succes.",
      });
    } catch (error) {
      console.error("Error updating admin roles:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza rolurile.",
        variant: "destructive",
      });
    }
  };

  const handleSuperAdminPrompt = (admin: UserData) => {
    setSuperAdminPrompt({
      userId: admin.uid,
      userName: admin.name,
      currentAdmin: admin.isAdmin,
    });
    setSuperAdminReason("");
  };

  const handleMakeSuperAdmin = async () => {
    if (!superAdminPrompt) return;

    if (!superAdminReason.trim()) {
      toast({
        title: "Eroare",
        description: "Te rugăm să specifici un motiv",
        variant: "destructive",
      });
      return;
    }

    await handleRoleUpdate(superAdminPrompt.userId, {
      isSuperAdmin: true,
      isAdmin: true,
    });

    setSuperAdminPrompt(null);
    setSuperAdminReason("");
  };

  // Add admin using Supabase (by UID)
  const handleAddAdmin = async () => {
    const trimmedUid = newAdminUid.trim();
    if (!trimmedUid) {
      toast({
        title: "Eroare",
        description: "Te rugăm să introduci un User ID (UID)",
        variant: "destructive",
      });
      return;
    }

    // Basic UUID validation (optional, but recommended)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedUid)) {
        toast({ title: "Eroare", description: "User ID invalid.", variant: "destructive" });
        return;
    }


    setIsAddingAdmin(true);
    try {
      // Find user by UID using Supabase
      const userToAdd = await getUserData(trimmedUid);

      if (!userToAdd) {
        toast({
          title: "Eroare",
          description: "Nu am găsit niciun utilizator cu acest ID",
          variant: "destructive",
        });
        return;
      }

      if (userToAdd.isAdmin) {
        toast({
          title: "Info",
          description: "Acest utilizator este deja admin.",
          variant: "default", // Use default or info variant
        });
        return; // Don't proceed if already admin
      }

      // Make user an admin using Supabase
      await updateUserData({ ...userToAdd, isAdmin: true, isSuperAdmin: userToAdd.isSuperAdmin || false }); // Preserve superAdmin status if already set

      // Add to local admins list
      setAdmins([...admins, { ...userToAdd, isAdmin: true }]);

      toast({
        title: "Succes",
        description: `Utilizatorul ${userToAdd.name} a fost promovat la rolul de Admin.`,
      });

      setNewAdminUid(""); // Clear UID input
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga adminul.",
        variant: "destructive",
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  if (!userData?.isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestionare Admini</h1>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="newAdminUidInput" className="text-sm font-medium">
            Adaugă admin nou după User ID (UID)
          </label>
          <Input
            id="newAdminUidInput"
            type="text"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAddAdmin}
          disabled={isAddingAdmin || !newAdminUid.trim()}
        >
          {isAddingAdmin ? "Se adaugă..." : "Adaugă Admin"}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead>User ID (UID)</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center">Se încarcă adminii...</TableCell>
                 </TableRow>
             ) : admins.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center">Nu există admini.</TableCell>
                 </TableRow>
             ) : (
                admins.map((admin) => (
              <TableRow key={admin.uid}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs truncate max-w-[150px]" title={admin.uid}>{admin.uid}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        navigator.clipboard.writeText(admin.uid);
                        toast({ title: "Copiat!", description: "User ID copiat în clipboard." });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {admin.isSuperAdmin ? (
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="text-purple-500" />
                      <span className="text-sm">Super Admin</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-green-500" />
                      <span className="text-sm">Admin</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {!admin.isSuperAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRoleUpdate(admin.uid, {
                            isAdmin: false,
                            isSuperAdmin: false,
                          })
                        }
                        className="text-red-500 hover:text-red-600"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Șterge Admin
                      </Button>
                    )}
                    {userData.uid !== admin.uid && (
                      <Button
                        variant={admin.isSuperAdmin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          admin.isSuperAdmin
                            ? handleRoleUpdate(admin.uid, {
                                isSuperAdmin: false,
                                isAdmin: true,
                              })
                            : handleSuperAdminPrompt(admin)
                        }
                        className={
                          admin.isSuperAdmin
                            ? ""
                            : "text-purple-500 hover:text-purple-600"
                        }
                      >
                        {admin.isSuperAdmin ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Șterge Super Admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Promovează la Super Admin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!superAdminPrompt}
        onOpenChange={() => setSuperAdminPrompt(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promovare la Super Admin</DialogTitle>
            <DialogDescription>
              Ești pe cale să acorzi privilegii de Super Admin utilizatorului{" "}
              {superAdminPrompt?.userName}. Acest lucru îi va oferi acces
              complet la toate funcțiile administrative. Te rugăm să specifici
              motivul acestei acțiuni.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Introdu motivul..."
              value={superAdminReason}
              onChange={(e) => setSuperAdminReason(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuperAdminPrompt(null)}>
              Anulează
            </Button>
            <Button
              onClick={handleMakeSuperAdmin}
              disabled={!superAdminReason.trim()}
            >
              Confirmă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
