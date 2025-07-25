"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Settings,
  TrendingUp,
  User,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { formatAmount } from "@/types/marketTransaction";
import { RegistrationWithProfile } from "@/types/registrationWithProfile";
import { getRegistrationsByEditionId } from "@/lib/supabase/database/registration";
import { getMarketTransactionSummaries } from "@/lib/supabase/database/marketTransaction";
import { AddMarketTransactionDialog } from "@/components/admin/add-market-transaction-dialog";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Link from "next/link";
import AdminProtected from "@/components/auth/AdminProtected";
import { PERMISSIONS } from "@/types/permissions";

interface MarketSummary {
  registration_id: number;
  registration_name: string;
  registration_phone: string;
  current_debt: number;
  total_transactions: number;
  latest_transaction_date?: string;
  recent_transactions: any[];
}

export default function MarketTransactionsPage() {
  const [summaries, setSummaries] = useState<MarketSummary[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize] = useState(10);
  const [debtThreshold, setDebtThreshold] = useState("50");
  const [showDebtList, setShowDebtList] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const offset = (currentPage - 1) * pageSize;
      
      const [summariesResult, registrationsData] = await Promise.all([
        getMarketTransactionSummaries(1, debouncedSearchQuery, pageSize, offset),
        getRegistrationsByEditionId(1)
      ]);

      setSummaries(summariesResult.data);
      setTotalCount(summariesResult.count);
      setTotalPages(Math.ceil(summariesResult.count / pageSize));
      setRegistrations(registrationsData);
    } catch (err) {
      console.error("Error fetching market data:", err);
      setError("A apărut o eroare la încărcarea datelor");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTransactionAdded = () => {
    fetchData();
    setIsDialogOpen(false);
    toast.success("Tranzacția a fost adăugată cu succes");
  };

  const toggleCardExpansion = (registrationId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(registrationId)) {
      newExpanded.delete(registrationId);
    } else {
      newExpanded.add(registrationId);
    }
    setExpandedCards(newExpanded);
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
    return 'text-blue-600'; // overpaid
  };

  const getDebtStatusText = (debt: number) => {
    if (debt === 0) return 'Fără datorie';
    if (debt > 0) return `Datorie: ${formatAmount(debt)} RON`;
    return `Plată în plus: ${formatAmount(Math.abs(debt))} RON`;
  };

  const calculateStats = () => {
    const withDebt = summaries.filter(s => s.current_debt > 0).length;
    const totalDebt = summaries.reduce((sum, s) => sum + (s.current_debt > 0 ? s.current_debt : 0), 0);
    const thresholdInCents = parseFloat(debtThreshold || "0") * 100; // Convert RON to cents
    const withDebtAboveThreshold = summaries.filter(s => s.current_debt >= thresholdInCents);
    return { withDebt, totalDebt, withDebtAboveThreshold };
  };

  const stats = calculateStats();

  if (isLoading && summaries.length === 0) {
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
    <AdminProtected requiredPermissions={[PERMISSIONS.MARKET_READ]}>
      <div className="w-full max-w-[90vw] mx-auto py-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Market</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Tranzacție
          </Button>
        </div>

      {/* Search and Statistics */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Caută participant, telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Card className="flex-1 min-w-[280px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">Cu Datorii</CardTitle>
                </div>
                <div className="hidden sm:flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Prag:</span>
                  <Input
                    type="text"
                    value={debtThreshold}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string, digits, and one decimal point
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setDebtThreshold(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '.') {
                        setDebtThreshold('0');
                      } else {
                        // Ensure it's a valid number
                        const num = parseFloat(value);
                        if (!isNaN(num) && num >= 0) {
                          setDebtThreshold(num.toString());
                        } else {
                          setDebtThreshold('0');
                        }
                      }
                    }}
                    className="h-8 w-16 text-xs"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">RON</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toggle Button with Threshold Controls */}
              <div className="space-y-2">
                {/* Desktop: Threshold controls above button */}
               
                <Button
                  variant={showDebtList ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowDebtList(!showDebtList)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{stats.withDebtAboveThreshold.length} cu datorii ≥ {debtThreshold || '0'} RON</span>
                  </div>
                  {showDebtList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {/* Mobile: Threshold controls below button, only when expanded */}
                {showDebtList && (
                  <div className="sm:hidden flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Prag:</span>
                    <Input
                      type="text"
                      value={debtThreshold}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow empty string, digits, and one decimal point
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setDebtThreshold(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '.') {
                          setDebtThreshold('0');
                        } else {
                          // Ensure it's a valid number
                          const num = parseFloat(value);
                          if (!isNaN(num) && num >= 0) {
                            setDebtThreshold(num.toString());
                          } else {
                            setDebtThreshold('0');
                          }
                        }
                      }}
                      className="h-8 w-16 text-xs"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">RON</span>
                  </div>
                )}
              </div>

              {/* Debt List */}
              {showDebtList && (
                <div className="space-y-2 border rounded-lg p-2 bg-red-50/50 max-h-60 overflow-y-auto">
                  {stats.withDebtAboveThreshold.length > 0 ? (
                    stats.withDebtAboveThreshold.map((summary) => (
                      <div 
                        key={summary.registration_id} 
                        className="flex items-center gap-3 p-3 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <div className="p-2 bg-red-100 rounded-full">
                          <User className="h-3 w-3 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{summary.registration_name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{summary.registration_phone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-red-600">
                            {formatAmount(summary.current_debt)} RON
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nu există datorii ≥ {debtThreshold || '0'} RON</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[180px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Datorii Totale</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.totalDebt)} RON</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Se încarcă...</span>
          </div>
        )}
        
        {!isLoading && summaries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nu s-au găsit tranzacții pentru căutarea curentă" : "Nu există tranzacții înregistrate"}
              </p>
            </CardContent>
          </Card>
        ) : (
          summaries.map((summary) => {
            const isExpanded = expandedCards.has(summary.registration_id);
            const recentTransactions = summary.recent_transactions.slice(0, 5);

            return (
              <Card key={summary.registration_id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{summary.registration_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{summary.registration_phone}</p>
                    </div>
                    <div className="lg:text-right">
                      <p className={`font-semibold ${getDebtStatusColor(summary.current_debt)}`}>
                        {getDebtStatusText(summary.current_debt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {summary.total_transactions} tranzacții
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardExpansion(summary.registration_id)}
                      className="flex items-center gap-2"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isExpanded ? 'Ascunde tranzacțiile' : 'Arată tranzacțiile'}
                    </Button>
                    
                    <Link href={`/admin/market/${summary.registration_id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ExternalLink className="h-3 w-3" />
                        Vezi toate
                      </Button>
                    </Link>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <Badge 
                              variant={getTransactionTypeColor(transaction.amount)} 
                              className={transaction.amount < 0 ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                              {getTransactionTypeText(transaction.amount)}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{formatAmount(Math.abs(transaction.amount))} RON</p>
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
                          </div>
                        </div>
                      ))}
                      
                      {summary.total_transactions > 5 && (
                        <div className="text-center py-2">
                          <p className="text-sm text-muted-foreground">
                            ... și încă {summary.total_transactions - 5} tranzacții
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <p className="text-sm text-muted-foreground">
            Afișând {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} din {totalCount} rezultate
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    page = currentPage - 2 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    page = totalPages - 4 + i;
                  }
                }
                
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className="w-8"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AddMarketTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        registrations={registrations}
        onSave={handleTransactionAdded}
      />
      </div>
    </AdminProtected>
  );
}