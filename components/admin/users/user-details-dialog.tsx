"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
}: UserDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!user) return null;

  const initials = user.name
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
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border">
              {user.imageUrl && !imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <span className="text-4xl font-semibold text-muted-foreground">
                        {initials}
                      </span>
                    </div>
                  )}
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
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
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem label="Vârstă" value={user.age?.toString() || "-"} />
            <InfoItem label="Telefon" value={user.phone || "-"} />
            <InfoItem label="Biserică" value={user.church || "-"} />
            <InfoItem label="Transport" value={user.transport || "-"} />
            <InfoItem label="Plătește taxa la" value={user.payTaxTo || "-"} />
            <InfoItem
              label="Sumă plătită"
              value={`${user.amountPaid || 0} RON`}
              className={
                !user.amountPaid || user.amountPaid === 0
                  ? "text-red-500"
                  : (user.amountPaid || 0) >=
                    (user.withFamilyMember ? 1000 : 800)
                  ? "text-emerald-600"
                  : "text-yellow-500"
              }
            />
            <InfoItem
              label="Perioada"
              value={
                user.startDate && user.endDate
                  ? `${format(
                      new Date(user.startDate),
                      "dd MMM yyyy"
                    )} - ${format(new Date(user.endDate), "dd MMM yyyy")}`
                  : "-"
              }
            />
            <InfoItem
              label="Status"
              value={user.isConfirmed ? "Confirmat" : "În așteptare"}
              className={
                user.isConfirmed ? "text-emerald-600" : "text-yellow-500"
              }
            />
            <InfoItem
              label="Preferințe colegi"
              value={user.preferences || "Fără preferințe"}
            />
            <InfoItem
              label="Are membru de familie"
              value={user.withFamilyMember ? "Da" : "Nu"}
            />
            <InfoItem
              label="Data înscrierii"
              value={format(new Date(user.createdAt), "dd MMM yyyy HH:mm")}
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
