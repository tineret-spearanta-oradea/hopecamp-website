"use client";

import { useEffect, useState } from "react";
import { usePendingContacts } from "@/hooks/use-pending-contacts";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import AdminProtected from "@/components/auth/AdminProtected";
import { PERMISSIONS } from "@/types/permissions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingContactsTable } from "@/components/admin/pending-contacts/pending-contacts-table";
import { PendingContactDetailDrawer } from "@/components/admin/pending-contacts/detail-drawer";
import { PendingContact } from "@/types/pendingContact";
import { Clock, UserCheck, Users } from "lucide-react";

export default function PendingContactsPage() {
  const { userData } = useAuth();
  const { hasAnyPermission, isSuperAdmin } = usePermissions();
  const {
    pendingContacts,
    counts,
    isLoading,
    error,
    fetchPendingContacts,
    updateContact,
    addHistoryEntry,
    createRegistration,
    abandonContact,
  } = usePendingContacts();

  const [selectedContact, setSelectedContact] = useState<PendingContact | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "contacted" | "all">(
    "new"
  );

  const canWrite =
    isSuperAdmin || hasAnyPermission(PERMISSIONS.PENDING_CONTACTS_WRITE);

  useEffect(() => {
    fetchPendingContacts();
  }, [fetchPendingContacts]);

  const filteredContacts = pendingContacts.filter((c) => {
    if (activeTab === "new") return c.status === "new";
    if (activeTab === "contacted") return c.status === "contacted";
    return c.status !== "resolved" && c.status !== "abandoned";
  });

  const handleViewDetails = (contact: PendingContact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContact(null);
  };

  return (
    <AdminProtected requiredPermissions={[PERMISSIONS.PENDING_CONTACTS_READ]}>
      <div className="w-full max-w-[90vw] mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contacte în așteptare
            </h1>
            <p className="text-muted-foreground">
              Utilizatori care au încercat să se înregistreze dar nu au putut
              verifica telefonul
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Noi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {counts.new}
              </div>
              <p className="text-xs text-muted-foreground">
                Necesită contactare
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Contactați
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {counts.contacted}
              </div>
              <p className="text-xs text-muted-foreground">În proces</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total activ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts.total}</div>
              <p className="text-xs text-muted-foreground">
                Necesită atenție
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Table */}
        <Card>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="new">
                  Noi
                  {counts.new > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {counts.new}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="contacted">Contactați</TabsTrigger>
                <TabsTrigger value="all">Toate active</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <LoadingSpinner transparentBg />
                  </div>
                ) : error ? (
                  <div className="flex h-[300px] items-center justify-center text-red-500">
                    Eroare la încărcarea datelor: {error.message}
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    Nu există contacte în această categorie
                  </div>
                ) : (
                  <PendingContactsTable
                    contacts={filteredContacts}
                    onViewDetails={handleViewDetails}
                    canWrite={canWrite}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detail Drawer */}
        <PendingContactDetailDrawer
          contact={selectedContact}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onAddHistory={addHistoryEntry}
          onCreateRegistration={createRegistration}
          onAbandon={abandonContact}
          canWrite={canWrite}
          currentUser={userData}
        />
      </div>
    </AdminProtected>
  );
}
