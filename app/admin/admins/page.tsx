"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/types/user";
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
  UserPlus,
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
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [superAdminPrompt, setSuperAdminPrompt] =
    useState<SuperAdminPromptData>(null);
  const [superAdminReason, setSuperAdminReason] = useState("");
  const { toast } = useToast();

  // Redirect if not super admin
  useEffect(() => {
    if (!currentUser?.isSuperAdmin) {
      router.push("/admin");
    }
  }, [currentUser, router]);

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const q = query(collection(db, "users"), where("isAdmin", "==", true));
        const querySnapshot = await getDocs(q);
        const adminsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as User[];
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast({
          title: "Error",
          description: "Could not fetch admins",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  const handleRoleUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, "users", userId), updates);
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
        description: "Rolurile au fost actualizate cu succes",
      });
    } catch (error) {
      console.error("Error updating admin roles:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza rolurile",
        variant: "destructive",
      });
    }
  };

  const handleSuperAdminPrompt = (admin: User) => {
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

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Eroare",
        description: "Te rugăm să introduci o adresă de email",
        variant: "destructive",
      });
      return;
    }

    setIsAddingAdmin(true);
    try {
      // Find user by email
      const q = query(
        collection(db, "users"),
        where("email", "==", newAdminEmail.trim().toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "Eroare",
          description: "Nu am găsit niciun utilizator cu acest email",
          variant: "destructive",
        });
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;

      if (userData.isAdmin) {
        toast({
          title: "Eroare",
          description: "Acest utilizator este deja admin",
          variant: "destructive",
        });
        return;
      }

      // Make user an admin
      await updateDoc(doc(db, "users", userDoc.id), {
        isAdmin: true,
        isSuperAdmin: false,
      });

      // Add to admins list
      setAdmins([
        ...admins,
        { ...userData, uid: userDoc.id, isAdmin: true, isSuperAdmin: false },
      ]);

      toast({
        title: "Succes",
        description: "Admin adăugat cu succes",
      });

      setNewAdminEmail("");
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga adminul",
        variant: "destructive",
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  if (!currentUser?.isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestionare Admini</h1>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">
            Adaugă admin nou după email
          </label>
          <Input
            type="email"
            placeholder="utilizator@exemplu.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAddAdmin}
          disabled={isAddingAdmin || !newAdminEmail.trim()}
        >
          {isAddingAdmin ? "Se adaugă..." : "Adaugă Admin"}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.uid}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
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
                    {currentUser.uid !== admin.uid && (
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
            ))}
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
