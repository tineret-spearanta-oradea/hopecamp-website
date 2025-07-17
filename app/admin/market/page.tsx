"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Receipt, CreditCard, AlertCircle, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

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

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.registration_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.registration_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered transactions by registration
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const key = transaction.registration_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);
    return acc;
  }, {} as Record<number, TransactionWithRegistration[]>);

  // Pagination logic
  const groupedKeys = Object.keys(groupedTransactions);
  const totalPages = Math.ceil(groupedKeys.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedKeys = groupedKeys.slice(startIndex, endIndex);

  const getTransactionTypeColor = (amount: number) => {
    return amount > 0 ? 'destructive' : 'default';
  };

  const getTransactionTypeText = (amount: number) => {
    return amount > 0 ? 'Datorie' : 'Plată';
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

      {/* Search and Statistics */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Caută participant, telefon sau descriere..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:w-80">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cu Datorii</CardTitle>
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
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {paginatedKeys.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nu s-au găsit tranzacții pentru căutarea curentă" : "Nu există tranzacții înregistrate"}
              </p>
            </CardContent>
          </Card>
        ) : (
          paginatedKeys.map((registrationId) => {
            const regTransactions = groupedTransactions[parseInt(registrationId)];
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
                          <Badge variant={getTransactionTypeColor(transaction.amount)} className={transaction.amount < 0 ? 'bg-green-500 hover:bg-green-600' : ''}>
                            {getTransactionTypeText(transaction.amount)}
                          </Badge>
                          <div>
                            <p className="font-medium">{formatAmount(Math.abs(transaction.amount))} RON</p>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AddMarketTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        registrations={registrations}
        onSave={handleTransactionAdded}
      />
    </div>
  );
}