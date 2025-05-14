"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/userProfile";

interface DeleteUserDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: UserProfile) => Promise<void>;
}

export function DeleteUserDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!user || !reason.trim()) return;

    setIsDeleting(true);
    try {
      await onConfirm(user);
      setReason("");
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Șterge participant</DialogTitle>
          <DialogDescription>
            Ești sigur că vrei să ștergi acest participant? Această acțiune nu
            poate fi anulată.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Participant</Label>
            <p className="text-sm font-medium">{user?.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivul ștergerii</Label>
            <Input
              id="reason"
              placeholder="Te rugăm să specifici motivul ștergerii"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isDeleting}
          >
            {isDeleting ? "Se șterge..." : "Șterge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
