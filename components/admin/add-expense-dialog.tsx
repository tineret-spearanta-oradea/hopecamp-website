"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Textarea } from "@/components/ui/textarea";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: {
    title: string;
    description?: string;
    amount: number;
    category?: string;
  }) => Promise<void>;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onSave,
}: AddExpenseDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset states when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setDescription("");
      setAmount("");
      setCategory("");
    }
    onOpenChange(open);
  };

  const handleSave = async () => {
    if (!title || !amount) {
      toast.error("Te rog completează titlul și suma");
      return;
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Te rog introdu o sumă validă");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title,
        description: description || "",
        amount: amountNumber,
        category: category || "",
      });
      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("A apărut o eroare la salvarea cheltuielii");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă Cheltuială</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Titlu</Label>
            <Input
              placeholder="Ex: Transport autocar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Sumă (RON)</Label>
            <Input
              type="number"
              placeholder="Ex: 1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Categorie (opțional)</Label>
            <Input
              placeholder="Ex: Transport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Descriere (opțional)</Label>
            <Textarea
              placeholder="Adaugă detalii despre cheltuială..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Anulează
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <>Se salvează...</> : "Salvează"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
