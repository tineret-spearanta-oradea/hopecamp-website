"use client";

import { useState } from "react";
import { UserProfile } from "@/types/userProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { payTaxToOptions, sumToPay } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserProfile[];
  selectedCollector: string | null;
  onSave: (data: {
    userId: string;
    amount: number;
    collectedBy: string;
  }) => Promise<void>;
}

export function AddIncomeDialog({
  open,
  onOpenChange,
  users,
  selectedCollector: defaultCollector,
  onSave,
}: AddIncomeDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCollector, setSelectedCollector] = useState<string | null>(
    defaultCollector
  );
  const [newAmount, setNewAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset states when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedUser(null);
      setNewAmount("");
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedCollector(defaultCollector);
    }
    onOpenChange(open);
  };

  // Get selected user's current amount
  const selectedUserData = users.find((u) => u.userId === selectedUser);
  const currentAmount = selectedUserData?.amountPaid || 0;

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user.userId);
    setSearchQuery(user.name);
    setShowDropdown(false);

    // Update cashier based on user's payTaxTo
    if (user.payTaxTo) {
      if (defaultCollector && user.payTaxTo !== defaultCollector) {
        toast.info(
          `Acest participant aparține de casierul ${user.payTaxTo}, diferit de filtrul selectat (${defaultCollector})`
        );
      }
      setSelectedCollector(user.payTaxTo);
    }
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSave = async () => {
    if (!selectedUser || !newAmount) {
      toast.error("Te rog selectează un participant și introdu suma");
      return;
    }

    const amount = Number(newAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Te rog introdu o sumă validă");
      return;
    }

    const collector = selectedCollector;
    if (!collector) {
      toast.error("Te rog selectează un casier");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        userId: selectedUser,
        amount: amount,
        collectedBy: selectedCollector || payTaxToOptions[0].value,
      });
      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("A apărut o eroare la salvarea plății");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează Suma Participant</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* User Selection */}
          <div className="grid gap-2">
            <Label>Participant</Label>
            <div className="relative">
              <Input
                placeholder="Caută participant..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={handleSearchFocus}
              />
              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto z-50">
                  {filteredUsers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nu am găsit participanți
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.userId}
                        className={cn(
                          "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent",
                          selectedUser === user.userId && "bg-accent"
                        )}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="min-w-[16px]">
                          {selectedUser === user.userId && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                        {user.amountPaid && user.amountPaid > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {user.amountPaid} RON
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="grid gap-2">
            <Label>Suma Totală Plătită</Label>
            <div className="grid gap-1">
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Introdu suma totală plătită"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAmount("0")}
                >
                  0 RON
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAmount(sumToPay.deposit.toString())}
                >
                  {sumToPay.deposit} RON (Avans)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAmount(sumToPay.normal.toString())}
                >
                  {sumToPay.normal} RON (Integral)
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {currentAmount > 0 && (
                  <>
                    Suma inițială: {currentAmount} RON
                    {newAmount && (
                      <>
                        <br />
                        Va fi adăugat: {Number(newAmount) - currentAmount} RON
                        <br />
                        Noua suma totală: {Number(newAmount)} RON
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Cashier Selection */}
          <div className="grid gap-2">
            <Label>Casier</Label>
            <Select
              value={selectedCollector || ""}
              onValueChange={setSelectedCollector}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează casier" />
              </SelectTrigger>
              <SelectContent>
                {payTaxToOptions.map((collector) => (
                  <SelectItem key={collector.value} value={collector.value}>
                    {collector.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
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
