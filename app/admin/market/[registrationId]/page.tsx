"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Plus, 
  CreditCard, 
  AlertCircle, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { formatAmount } from "@/types/marketTransaction";
import { MarketTransaction } from "@/types/marketTransaction";
import { RegistrationWithProfile } from "@/types/registrationWithProfile";
import { getRegistrationById } from "@/lib/supabase/database/registration";
import { 
  getRegistrationMarketTransactionsDetailed,
  getCurrentDebtForRegistration,
  deleteMarketTransaction
} from "@/lib/supabase/database/marketTransaction";
import { AddMarketTransactionDialog } from "@/components/admin/add-market-transaction-dialog";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Link from "next/link";

export default function RegistrationMarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const registrationId = parseInt(params.registrationId as string);

  const [registration, setRegistration] = useState<RegistrationWithProfile | null>(null);
  const [transactions, setTransactions] = useState<MarketTransaction[]>([]);
  const [currentDebt, setCurrentDebt] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageSize] = useState(20);

  const fetchRegistrationData = useCallback(async () => {
    try {
      setError(null);
      const [regData, debtData] = await Promise.all([
        getRegistrationById(registrationId),
        getCurrentDebtForRegistration(registrationId)
      ]);

      setRegistration(regData);
      setCurrentDebt(debtData);
    } catch (err) {
      console.error("Error fetching registration data:", err);
      setError("A apărut o eroare la încărcarea datelor participantului");
    }
  }, [registrationId]);

  const fetchTransactions = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoadingMore(append);
      if (!append) setIsLoading(true);
      
      const offset = (page - 1) * pageSize;
      const fetchedTransactions = await getRegistrationMarketTransactionsDetailed(
        registrationId, 
        pageSize, 
        offset
      );

      if (append) {
        setTransactions(prev => [...prev, ...fetchedTransactions]);
      } else {
        setTransactions(fetchedTransactions);
      }

      setHasMore(fetchedTransactions.length === pageSize);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("A apărut o eroare la încărcarea tranzacțiilor");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [registrationId, pageSize]);

  useEffect(() => {
    if (isNaN(registrationId)) {
      setError("ID participant invalid");
      setIsLoading(false);
      return;
    }

    fetchRegistrationData();
    fetchTransactions();
  }, [registrationId, fetchRegistrationData, fetchTransactions]);

  const handleTransactionAdded = () => {
    fetchRegistrationData();
    fetchTransactions();
    setIsDialogOpen(false);
    toast.success("Tranzacția a fost adăugată cu succes");
  };

  const loadMoreTransactions = () => {
    if (hasMore && !isLoadingMore) {
      fetchTransactions(currentPage + 1, true);
    }
  };

  const getTransactionTypeColor = (amount: number) => {
    return amount > 0 ? 'destructive' : 'default';
  };

  const getTransactionTypeText = (amount: number) => {
    return amount > 0 ? 'Datorie' : 'Plată';
  };

  const getDebtStatusColor = (debt: number) => {
    if (debt === 0) return 'text-green-600';
    if (debt > 0) return 'text-red-600';
    return 'text-blue-600';
  };

  const getDebtStatusText = (debt: number) => {
    if (debt === 0) return 'Fără datorie';
    if (debt > 0) return `Datorie: ${formatAmount(debt)} RON`;
    return `Plată în plus: ${formatAmount(Math.abs(debt))} RON`;
  };

  const getRunningBalanceColor = (balance: number) => {
    if (balance === 0) return 'text-green-600';
    if (balance > 0) return 'text-red-600';
    return 'text-blue-600';
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/market">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
          </Link>
        </div>
        <div className="flex h-[450px] items-center justify-center text-red-500">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/market">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tranzacții Market</h1>
        </div>
        <div className="sm:ml-auto">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Tranzacție
          </Button>
        </div>
      </div>

      {/* Registration info and debt status */}
      {registration && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl">{registration.name}</CardTitle>
                <p className="text-muted-foreground">{registration.phone}</p>
                {registration.church && (
                  <p className="text-sm text-muted-foreground">{registration.church}</p>
                )}
              </div>
              <div className="lg:text-right">
                <p className={`text-lg font-semibold ${getDebtStatusColor(currentDebt)}`}>
                  {getDebtStatusText(currentDebt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transactions.length} tranzacții totale
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Transactions list */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Nu există tranzacții înregistrate pentru acest participant</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction, index) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Badge 
                      variant={getTransactionTypeColor(transaction.amount)} 
                      className={transaction.amount < 0 ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {getTransactionTypeText(transaction.amount)}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-lg">{formatAmount(Math.abs(transaction.amount))} RON</p>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-medium">{transaction.created_by_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), "dd MMM yyyy HH:mm", { locale: ro })}
                    </p>
                    {transaction.running_balance !== undefined && (
                      <p className={`text-xs font-medium ${getRunningBalanceColor(transaction.running_balance)}`}>
                        Sold: {formatAmount(transaction.running_balance)} RON
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={loadMoreTransactions}
              disabled={isLoadingMore}
              className="flex items-center gap-2"
            >
              {isLoadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {isLoadingMore ? 'Se încarcă...' : 'Încarcă mai multe'}
            </Button>
          </div>
        )}
      </div>

      <AddMarketTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        registrations={registration ? [registration] : []}
        defaultRegistrationId={registrationId}
        onSave={handleTransactionAdded}
      />
    </div>
  );
}