"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PendingContact,
  ContactHistoryEntry,
} from "@/types/pendingContact";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  Phone,
  MessageSquare,
  Check,
  X,
  Clock,
  User,
  MapPin,
  Car,
  Wallet,
  Calendar,
  UserPlus,
} from "lucide-react";

interface DetailDrawerProps {
  contact: PendingContact | null;
  isOpen: boolean;
  onClose: () => void;
  onAddHistory: (
    id: number,
    entry: ContactHistoryEntry
  ) => Promise<PendingContact>;
  onCreateRegistration: (
    id: number,
    adminUserId: string
  ) => Promise<{ success: boolean; registrationId?: number; error?: string }>;
  onAbandon: (id: number) => Promise<PendingContact>;
  canWrite: boolean;
  currentUser: { userId?: string; name?: string } | null;
}

const statusLabels: Record<string, string> = {
  new: "Nou",
  contacted: "Contactat",
  resolved: "Rezolvat",
  abandoned: "Abandonat",
};

const statusColors: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  new: "destructive",
  contacted: "default",
  resolved: "secondary",
  abandoned: "outline",
};

export function PendingContactDetailDrawer({
  contact,
  isOpen,
  onClose,
  onAddHistory,
  onCreateRegistration,
  onAbandon,
  canWrite,
  currentUser,
}: DetailDrawerProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!contact) return null;

  const handleAddNote = async () => {
    if (!newNote.trim() || !canWrite || !currentUser?.userId) return;

    setIsSubmitting(true);
    try {
      await onAddHistory(contact.id, {
        timestamp: new Date().toISOString(),
        adminId: currentUser.userId,
        adminName: currentUser.name || "Admin",
        action: "note",
        note: newNote.trim(),
      });
      setNewNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRegistration = async () => {
    if (!canWrite || !currentUser?.userId) return;
    setIsSubmitting(true);
    try {
      await onCreateRegistration(contact.id, currentUser.userId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandon = async () => {
    if (!canWrite) return;
    setIsSubmitting(true);
    try {
      await onAbandon(contact.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isResolved = contact.status === "resolved";
  const isAbandoned = contact.status === "abandoned";
  const canTakeAction = canWrite && !isResolved && !isAbandoned;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Detalii contact
            <Badge variant={statusColors[contact.status]}>
              {statusLabels[contact.status]}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-4">
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {contact.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(contact.createdAt, "dd MMM yyyy HH:mm", {
                      locale: ro,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Form Data */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Date din formular</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {contact.formData.age && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Vârstă:</dt>
                      <dd>{contact.formData.age} ani</dd>
                    </div>
                  )}
                  {contact.formData.gender && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Gen:</dt>
                      <dd>
                        {contact.formData.gender === "male"
                          ? "Masculin"
                          : contact.formData.gender === "female"
                          ? "Feminin"
                          : "Necunoscut"}
                      </dd>
                    </div>
                  )}
                  {contact.formData.church && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Biserică:</dt>
                      <dd>
                        {contact.formData.church === "alta"
                          ? contact.formData.churchOther
                          : contact.formData.church}
                      </dd>
                    </div>
                  )}
                  {contact.formData.transport && (
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Transport:</dt>
                      <dd>{contact.formData.transport}</dd>
                    </div>
                  )}
                  {contact.formData.payTaxTo && (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Plătește la:</dt>
                      <dd>{contact.formData.payTaxTo}</dd>
                    </div>
                  )}
                  {(contact.formData.startDate || contact.formData.endDate) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-muted-foreground">Perioada:</dt>
                      <dd>
                        {contact.formData.startDate &&
                          format(
                            new Date(contact.formData.startDate),
                            "dd MMM",
                            { locale: ro }
                          )}
                        {" - "}
                        {contact.formData.endDate &&
                          format(
                            new Date(contact.formData.endDate),
                            "dd MMM",
                            { locale: ro }
                          )}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Contact History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Istoric contactări</CardTitle>
              </CardHeader>
              <CardContent>
                {contact.contactHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nicio contactare încă
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contact.contactHistory.map((entry, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-primary pl-3 py-1"
                      >
                        <div className="text-xs text-muted-foreground">
                          {format(
                            new Date(entry.timestamp),
                            "dd MMM yyyy HH:mm",
                            { locale: ro }
                          )}
                          {" - "}
                          {entry.adminName}
                        </div>
                        {entry.note && (
                          <p className="text-sm mt-1">{entry.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Note */}
            {canTakeAction && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Adaugă notă</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea
                    placeholder="Notă despre contactare..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmitting}
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Adaugă notă
                  </Button>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Actions */}
            {canTakeAction && (
              <div className="space-y-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Creează înregistrare
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirmă crearea înregistrării
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Aceasta va crea un cont și o înregistrare pentru{" "}
                        <strong>{contact.name}</strong> ({contact.phone}) cu
                        datele salvate. Utilizatorul va fi notificat prin SMS.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateRegistration}>
                        Creează înregistrare
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Marchează abandonat
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmă abandonarea</AlertDialogTitle>
                      <AlertDialogDescription>
                        Aceasta va marca contactul ca abandonat. Poți reactiva
                        mai târziu dacă este necesar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAbandon}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Abandonează
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Resolution info */}
            {isResolved && contact.resolvedRegistrationId && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="h-5 w-5" />
                    <span>
                      Rezolvat - Înregistrare #{contact.resolvedRegistrationId}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {isAbandoned && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <X className="h-5 w-5" />
                    <span>Contact abandonat</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
