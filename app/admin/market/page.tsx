"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatAmount } from "@/types/marketTransaction";
import { MarketTransaction } from "@/types/marketTransaction";
import { RegistrationWithProfile } from "@/types/registrationWithProfile";
import { getRegistrationsByEditionId } from "@/lib/supabase/database/registration";
import { 
  getAllMarketTransactions, 
  getCurrentDebtForRegistration, 
  getMarketTransactionSummary 
} from "@/lib/supabase/database/marketTransaction";
import { AddMarketTransactionDialog } from "@/components/admin/add-market-transaction-dialog";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface TransactionWithRegistration extends MarketTransaction {
  registration_name?: string;
  registration_phone?: string;
  current_debt?: number;
}

export default function MarketTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithRegistration[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current active edition (assuming id 1 for now - should be dynamic)
      const [transactionsData, registrationsData] = await Promise.all([
        getAllMarketTransactions(),
        getRegistrationsByEditionId(1)
      ]);

      // Enrich transactions with current debt info
      const enrichedTransactions = await Promise.all(
        transactionsData.map(async (transaction) => {
          const currentDebt = await getCurrentDebtForRegistration(transaction.registration_id);
          return {
            ...transaction,
            current_debt: currentDebt
          };
        })
      );

      setTransactions(enrichedTransactions);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error("Error fetching market transactions:", err);
      setError("A apărut o eroare la încărcarea datelor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
    setIsDialogOpen(false);
    toast.success("Tranzacția a fost adăugată cu succes");
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const key = transaction.registration_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);
    return acc;
  }, {} as Record<number, TransactionWithRegistration[]>);

  const getTransactionTypeColor = (type: string) => {
    return type === 'debt' ? 'destructive' : 'secondary';
  };

  const getTransactionTypeText = (type: string) => {
    return type === 'debt' ? 'Datorie' : 'Plată';
  };

  const getDebtStatusColor = (debt: number) => {
    if (debt === 0) return 'text-green-600';
    if (debt > 0) return 'text-red-600';
    return 'text-blue-600'; // overpaid
  };

  const getDebtStatusText = (debt: number) => {
    if (debt === 0) return 'Fără datorie';
    if (debt > 0) return `Datorie: ${formatAmount(debt)} RON`;
    return `Plată în plus: ${formatAmount(Math.abs(debt))} RON`;
  };

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[450px] items-center justify-center text-red-500">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-[90vw] mx-auto py-2 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Market</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adaugă Tranzacție
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tranzacții</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participanți cu Datorii</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(groupedTransactions).filter(group => {
                const latestTransaction = group[0];
                return latestTransaction?.current_debt && latestTransaction.current_debt > 0;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datorii Totale</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(
                Object.values(groupedTransactions).reduce((sum, group) => {
                  const latestTransaction = group[0];
                  const debt = latestTransaction?.current_debt || 0;
                  return sum + (debt > 0 ? debt : 0);
                }, 0)
              )} RON
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Nu există tranzacții înregistrate</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedTransactions).map(([registrationId, regTransactions]) => {
            const latestTransaction = regTransactions[0];
            const participantName = latestTransaction?.registration_name || 'Necunoscut';
            const participantPhone = latestTransaction?.registration_phone || 'N/A';
            const currentDebt = latestTransaction?.current_debt || 0;

            return (
              <Card key={registrationId} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{participantName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{participantPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getDebtStatusColor(currentDebt)}`}>
                        {getDebtStatusText(currentDebt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {regTransactions.length} tranzacții
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getTransactionTypeColor(transaction.transaction_type)}>
                            {getTransactionTypeText(transaction.transaction_type)}
                          </Badge>
                          <div>
                            <p className="font-medium">{formatAmount(transaction.amount)} RON</p>
                            {transaction.description && (
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{transaction.created_by_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.created_at), "dd MMM yyyy HH:mm", { locale: ro })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AddMarketTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        registrations={registrations}
        onSave={handleTransactionAdded}
      />
    </div>
  );
}