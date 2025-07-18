"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminMessage } from "@/types/message"; // Use AdminMessage
import Image from "next/image";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { getUserMessages } from "@/lib/supabase/database/message"; // Updated import
import { Loader2, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { getCurrentDebtForRegistration } from "@/lib/supabase/database/marketTransaction";
import { formatAmount } from "@/types/marketTransaction";

import {RegistrationWithProfile} from "@/types/registrationWithProfile";

interface UserDetailsDialogProps {
  registration: RegistrationWithProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({
  registration,
  isOpen,
  onClose,
}: UserDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [messages, setMessages] = useState<AdminMessage[]>([]); // Use AdminMessage
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [currentDebt, setCurrentDebt] = useState<number | null>(null);
  const [debtLoading, setDebtLoading] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      if (registration) {
        setMessagesLoading(true);
        const userMessages = await getUserMessages(registration.userId);
        setMessages(userMessages);
        setMessagesLoading(false);
      }
    }

    fetchMessages();
  }, [registration]);

  useEffect(() => {
    async function fetchCurrentDebt() {
      if (registration) {
        setDebtLoading(true);
        try {
          const debt = await getCurrentDebtForRegistration(registration.id);
          setCurrentDebt(debt);
        } catch (error) {
          console.error("Error fetching current debt:", error);
          setCurrentDebt(null);
        } finally {
          setDebtLoading(false);
        }
      }
    }

    fetchCurrentDebt();
  }, [registration]);

  if (!registration) return null;

  const initials = registration.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalii Participant</DialogTitle>
          <div className="text-[10px] text-muted-foreground/50 font-mono">
            {registration?.userId}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border">
              {registration.imageUrl && !imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <span className="text-4xl font-semibold text-muted-foreground">
                        {initials}
                      </span>
                    </div>
                  )}
                  <Image
                    src={registration.imageUrl}
                    alt={registration.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    onLoadingComplete={() => setImageLoading(false)}
                    onError={() => setImageError(true)}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-4xl font-semibold text-muted-foreground">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold">{registration.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{registration.phone}</p>

              {/* Messages Section */}
              <div className="text-left border rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold mb-2">Mesaje</h4>
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="text-sm border-b last:border-b-0 pb-2 last:pb-0"
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(message.sentDate),
                              "dd MMM yyyy HH:mm"
                            )}
                          </span>
                          <span
                            className={`text-xs ${
                              message.isRead
                                ? "text-emerald-600"
                                : "text-yellow-500"
                            }`}
                          >
                            {message.isRead ? `Citit ${message.readByUserName ? `de ${message.readByUserName}` : ''}` : "Necitit"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Nu există mesaje
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem
              label="Confirmare"
              value={registration.isConfirmed ? "Aprobat" : "În așteptare"}
              className={
                registration.isConfirmed ? "text-emerald-600" : "text-yellow-500"
              }
            />
            <InfoItem label="Vârstă" value={registration.age?.toString() || "-"} />
            <InfoItem label="Telefon" value={registration.phone || "-"} />
            <InfoItem label="Biserică" value={registration.church || "-"} />
            {registration.church === "alta" && (
              <InfoItem
                label="Numele bisericii"
                value={registration.churchOther || "-"}
              />
            )}
            {registration.churchContact && (
              <InfoItem label="Contact TSO" value={registration.churchContact} />
            )}
            <InfoItem label="Transport" value={registration.transport || "-"} />
            <InfoItem label="Plătește taxa la" value={registration.payTaxTo || "-"} />
            <InfoItem
              label="Sumă plătită"
              value={`${registration.amountPaid || 0} RON`}
              className={
                !registration.amountPaid || registration.amountPaid === 0
                  ? "text-red-500"
                  : (registration.amountPaid || 0) >=
                    (registration.withFamilyMember ? 1000 : 800)
                  ? "text-emerald-600"
                  : "text-yellow-500"
              }
            />
            
            <InfoItem
              label="Datorie Market"
              value={
                debtLoading ? "Se încarcă..." : 
                currentDebt !== null ? (
                  currentDebt === 0 ? "Fără datorii" :
                  currentDebt > 0 ? `${formatAmount(currentDebt)} RON` :
                  `Credit: ${formatAmount(Math.abs(currentDebt))} RON`
                ) : "N/A"
              }
              className={
                currentDebt === null || debtLoading ? "text-muted-foreground" :
                currentDebt === 0 ? "text-emerald-600" :
                currentDebt > 0 ? "text-red-600" :
                "text-blue-600"
              }
            />
            <InfoItem
              label="Perioada"
              value={
                registration.startDate && registration.endDate
                  ? `${format(
                      new Date(registration.startDate),
                      "dd MMM yyyy"
                    )} - ${format(new Date(registration.endDate), "dd MMM yyyy")}`
                  : "-"
              }
            />
            <InfoItem
              label="Preferințe colegi"
              value={registration.preferences || "Fără preferințe"}
            />
            <InfoItem
              label="Are membru de familie"
              value={registration.withFamilyMember ? "Da" : "Nu"}
            />
            <InfoItem
              label="Data înscrierii"
              value={format(new Date(registration.createdAt), "dd MMM yyyy HH:mm")}
            />
            <InfoItem
              label="Ultima modificare"
              value={format(new Date(registration.updatedAt), "dd MMM yyyy HH:mm")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-sm font-medium text-muted-foreground">
        {label}:
      </span>
      <span className={`text-sm font-medium ${className}`}>{value}</span>
    </div>
  );
}
