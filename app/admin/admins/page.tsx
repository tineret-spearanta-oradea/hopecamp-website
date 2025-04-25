"use client";

import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/auth-context";
import {useRouter} from "next/navigation";
import { updateUserData, makeUserSuperAdmin} from "@/lib/supabase/database/registration"; // Import Supabase functions
import {getUserRegistrationByEditionId, makeUserAdminForEdition} from "@/lib/supabase/database/registration";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
    ShieldAlert,
    ShieldCheck,
    UserMinus,
    Shield,
} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {getActiveEdition} from "@/lib/supabase/database/edition";
import {getRegistrationsByEditionId} from "@/lib/supabase/database/registration";
import {RegistrationWithProfile} from "@/types/registrationWithProfile";

type SuperAdminPromptData = {
    userId: string;
    userName: string;
    currentAdmin: boolean;
} | null;

export default function AdminsPage() {
    const {userData} = useAuth();
    const router = useRouter();
    const [admins, setAdmins] = useState<RegistrationWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [isAddingAdmin, setIsAddingAdmin] = useState(false);
    const [superAdminPrompt, setSuperAdminPrompt] =
        useState<SuperAdminPromptData>(null);
    const [superAdminReason, setSuperAdminReason] = useState("");
    const {toast} = useToast();

    // Redirect if not super admin
    useEffect(() => {
        if (!userData?.isSuperAdmin) {
            router.push("/admin");
        }
    }, [userData, router]);

    // Fetch admins
    useEffect(() => {
        const fetchAdmins = async () => {
            setLoading(true); // Ensure loading state is set
            try {
                const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
                const registrations = await getRegistrationsByEditionId(currentEdition.id);
                const adminsData = registrations.filter(user => user.isAdmin || user.isSuperAdmin);
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

    const handleRoleUpdate = async (userId: string, updates: Partial<Omit<RegistrationWithProfile, 'userId'>>) => {
        const adminToUpdate = admins.find(admin => admin.userId === userId);
        if (!adminToUpdate) {
            console.error("User not found for update:", userId);
            toast({title: "Eroare", description: "Userul nu a fost găsit.", variant: "destructive"});
            return;
        }

        try {
            if (updates.isAdmin !== undefined) {
                const currentEdition = await getActiveEdition();
                await makeUserAdminForEdition(userId, currentEdition.id, updates.isAdmin);
            }
            if (updates.isSuperAdmin !== undefined) {
                await makeUserSuperAdmin(userId, updates.isSuperAdmin);
            }
            setAdmins(
                admins.map((admin) =>
                    admin.userId === userId ? {...admin, ...updates} : admin
                )
            );

            // If removing admin status, remove from the list
            if (updates.isAdmin === false) {
                setAdmins(admins.filter((admin) => admin.userId !== userId));
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

    const handleSuperAdminPrompt = (admin: RegistrationWithProfile) => {
        setSuperAdminPrompt({
            userId: admin.userId,
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
            const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
            const userToAdd: RegistrationWithProfile | null = await getUserRegistrationByEditionId(currentEdition.id,undefined, newAdminEmail.trim().toLowerCase());

            if (!userToAdd) {
                toast({
                    title: "Eroare",
                    description: "Nu am găsit niciun utilizator cu acest email",
                    variant: "destructive",
                });
                return;
            }

            if (userToAdd.isAdmin) {
                toast({
                    title: "Eroare",
                    description: "Acest utilizator este deja admin",
                    variant: "destructive",
                });
                return;
            }

            await updateUserData({...userToAdd, isSuperAdmin: userToAdd.isSuperAdmin || false});

            // Add to local admins list
            setAdmins([...admins, {...userToAdd, isAdmin: true}]);

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
                                <TableRow key={admin.userId}>
                                    <TableCell>{admin.name}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        {admin.isSuperAdmin ? (
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="text-purple-500"/>
                                                <span className="text-sm">Super Admin</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="text-green-500"/>
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
                                                        handleRoleUpdate(admin.userId, {
                                                            isAdmin: false,
                                                            isSuperAdmin: false,
                                                        })
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <UserMinus className="h-4 w-4 mr-2"/>
                                                    Șterge Admin
                                                </Button>
                                            )}
                                            {userData.userId !== admin.userId && (
                                                <Button
                                                    variant={admin.isSuperAdmin ? "destructive" : "outline"}
                                                    size="sm"
                                                    onClick={() =>
                                                        admin.isSuperAdmin
                                                            ? handleRoleUpdate(admin.userId, {
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
                                                            <UserMinus className="h-4 w-4 mr-2"/>
                                                            Șterge Super Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="h-4 w-4 mr-2"/>
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
