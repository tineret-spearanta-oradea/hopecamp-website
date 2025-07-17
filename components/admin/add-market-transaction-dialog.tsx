"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatAmount, parseAmount } from "@/types/marketTransaction";
import { RegistrationWithProfile } from "@/types/registrationWithProfile";
import { addMarketTransaction, getCurrentDebtForRegistration } from "@/lib/supabase/database/marketTransaction";
import { useState as useReactState } from "react";

interface AddMarketTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrations: RegistrationWithProfile[];
  onSave: () => void;
}

export function AddMarketTransactionDialog({
  open,
  onOpenChange,
  registrations,
  onSave,
}: AddMarketTransactionDialogProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<'debt' | 'payment'>('debt');
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDebt, setCurrentDebt] = useState<number | null>(null);
  const [loadingDebt, setLoadingDebt] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Reset states when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedRegistration(null);
      setTransactionType('debt');
      setAmount("");
      setDescription("");
      setSearchQuery("");
      setShowDropdown(false);
      setCurrentDebt(null);
      setIsStatusOpen(false);
    }
    onOpenChange(open);
  };

  // Load current debt when registration is selected
  useEffect(() => {
    if (selectedRegistration) {
      setLoadingDebt(true);
      getCurrentDebtForRegistration(selectedRegistration)
        .then(debt => setCurrentDebt(debt))
        .catch(err => {
          console.error("Error loading current debt:", err);
          setCurrentDebt(null);
        })
        .finally(() => setLoadingDebt(false));
    } else {
      setCurrentDebt(null);
    }
  }, [selectedRegistration]);

  // Get selected registration data
  const selectedRegistrationData = registrations.find(
    (reg) => reg.id === selectedRegistration
  );

  // Filter registrations based on search query
  const filteredRegistrations = registrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegistrationSelect = (registration: RegistrationWithProfile) => {
    setSelectedRegistration(registration.id);
    setSearchQuery(registration.name);
    setShowDropdown(false);
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSave = async () => {
    if (!selectedRegistration || !amount || !transactionType) {
      toast.error("Te rog completează toate câmpurile obligatorii");
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Te rog introdu o sumă validă mai mare decât 0");
      return;
    }

    // Convert to cents for storage and make negative for payments
    const amountInCents = parseAmount(amountNumber);
    const finalAmount = transactionType === 'payment' ? -amountInCents : amountInCents;

    try {
      setIsSubmitting(true);
      
      await addMarketTransaction({
        registration_id: selectedRegistration,
        amount: finalAmount,
        description: description.trim() || null,
        created_by: "", // Will be set by the database function
      });

      onSave();
      toast.success("Tranzacția a fost adăugată cu succes");
    } catch (error) {
      console.error("Error adding market transaction:", error);
      toast.error("A apărut o eroare la salvarea tranzacției");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDebtStatusColor = (debt: number) => {
    if (debt === 0) return 'text-green-600';
    if (debt > 0) return 'text-red-600';
    return 'text-blue-600'; // overpaid
  };

  const getDebtStatusText = (debt: number) => {
    if (debt === 0) return 'Fără datorie';
    if (debt > 0) return `Datorie actuală: ${formatAmount(debt)} RON`;
    return `Plată în plus: ${formatAmount(Math.abs(debt))} RON`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adaugă Tranzacție Market</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Registration Selection */}
          <div className="grid gap-2">
            <Label>Participant *</Label>
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
                  {filteredRegistrations.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nu am găsit participanți
                    </div>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className={cn(
                          "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent",
                          selectedRegistration === registration.id && "bg-accent"
                        )}
                        onClick={() => handleRegistrationSelect(registration)}
                      >
                        <div className="min-w-[16px]">
                          {selectedRegistration === registration.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span>{registration.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {registration.phone}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>


          {/* Transaction Type Selection */}
          <div className="grid gap-2">
            <Label>Tip Tranzacție *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={transactionType === 'debt' ? 'default' : 'outline'}
                className={transactionType === 'debt' ? 'bg-red-500 hover:bg-red-600' : ''}
                onClick={() => setTransactionType('debt')}
              >
                Datorie
              </Button>
              <Button
                type="button"
                variant={transactionType === 'payment' ? 'default' : 'outline'}
                className={transactionType === 'payment' ? 'bg-green-500 hover:bg-green-600' : ''}
                onClick={() => setTransactionType('payment')}
              >
                Plată
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {transactionType === 'debt' 
                ? 'Participantul datorește bani (se adaugă la datorie)'
                : 'Participantul plătește datoria (se scade din datorie)'
              }
            </p>
          </div>

          {/* Amount Input */}
          <div className="grid gap-2">
            <Label>Sumă (RON) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Introdu suma în RON"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("5")}
              >
                5 RON
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("10")}
              >
                10 RON
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("20")}
              >
                20 RON
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("50")}
              >
                50 RON
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label>Descriere (opțional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Market, coffee, lemo, etc..."
              rows={2}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDescription("Market")}
              >
                Market
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDescription("Coffee")}
              >
                Coffee
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDescription("Lemo")}
              >
                Lemo
              </Button>
            </div>
          </div>

          {/* Status and Preview Section */}
          {selectedRegistration && (
            <div className="border rounded-lg">
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status și Previzualizare</span>
                </div>
                {isStatusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {isStatusOpen && (
                <div className="p-3 bg-muted/50 rounded-lg mt-2 mx-3 mb-3">
                  {loadingDebt ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm text-muted-foreground">Se încarcă...</span>
                    </div>
                  ) : currentDebt !== null ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Datorie actuală:</span>
                        <span className={getDebtStatusColor(currentDebt)}>
                          {formatAmount(currentDebt)} RON
                        </span>
                      </div>
                      {amount && (
                        <>
                          <div className="flex justify-between">
                            <span>
                              {transactionType === 'debt' ? 'Se adaugă datorie:' : 'Se plătește:'}
                            </span>
                            <span className={transactionType === 'debt' ? 'text-red-600' : 'text-green-600'}>
                              {transactionType === 'debt' ? '+' : '-'}{amount} RON
                            </span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Datorie după tranzacție:</span>
                            <span className={getDebtStatusColor(
                              currentDebt + (transactionType === 'debt' ? parseAmount(amount || "0") : -parseAmount(amount || "0"))
                            )}>
                              {formatAmount(
                                currentDebt + (transactionType === 'debt' ? parseAmount(amount || "0") : -parseAmount(amount || "0"))
                              )} RON
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nu s-a putut încărca statusul
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
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
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Se salvează...
              </>
            ) : (
              "Salvează"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}