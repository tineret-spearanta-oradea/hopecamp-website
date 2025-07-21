"use client";

import { useRegistrations } from "@/hooks/use-registrations";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payTaxToOptions, sumToPay } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Plus, Filter, Check, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useFinancials } from "@/hooks/use-financials";
import { AddIncomeDialog } from "@/components/admin/add-income-dialog";
import { AddExpenseDialog, ExpenseDialog } from "@/components/admin/add-expense-dialog";
import { cn } from "@/lib/utils";
import { PieChart } from "@/components/ui/pie-chart";
import { ResponsiveContainer } from "recharts";

// Helper function to get collector name
const getCollectorName = (collectorId: string) => {
  return (
    payTaxToOptions.find((c) => c.value === collectorId)?.value || collectorId
  );
};

export default function FinanciarPage() {
  const { registrations, isLoading: usersLoading, fetchRegistrations } = useRegistrations();
  const {
    expenses,
    incomes,
    isLoading: financialsLoading,
    fetchExpenses,
    fetchIncomes,
    updateUserPayment,
    addExpense,
    updateExpense,
  } = useFinancials();
  const { userData:user } = useAuth();
  const [selectedCollector, setSelectedCollector] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("selectedCollector");
        return stored ? stored : null;
      }
      return null;
    }
  );
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "incasari";
    }
    return "incasari";
  });
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<{
    id: number;
    title: string;
    description?: string;
    amount: number;
    category?: string;
  } | null>(null);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "cheltuieli") {
      fetchExpenses();
    } else {
      Promise.all([fetchIncomes(), fetchRegistrations()]);
    }
  }, [activeTab]);

  // Update localStorage when selection changes
  useEffect(() => {
    if (selectedCollector) {
      localStorage.setItem("selectedCollector", selectedCollector);
    } else {
      localStorage.removeItem("selectedCollector");
    }
  }, [selectedCollector]);

  // Update localStorage when tab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (usersLoading || financialsLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <LoadingSpinner transparentBg />
      </div>
    );
  }

  // Filter incomes based on collector
  const filteredIncomes = selectedCollector
    ? incomes.filter((income) => income.collectedBy === selectedCollector)
    : incomes;

  // Calculate statistics based on filtered data
  const totalCollected = filteredIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalParticipants = registrations.length;
  const noDepositCount = registrations.filter((user) => {
    const shouldCount = !user.amountPaid || user.amountPaid < sumToPay.deposit;
    if (selectedCollector) {
      return shouldCount && user.payTaxTo === selectedCollector;
    }
    return shouldCount;
  }).length;
  const noFullPaymentCount = registrations.filter((user) => {
    const shouldCount = !user.amountPaid || user.amountPaid < sumToPay.normal;
    if (selectedCollector) {
      return shouldCount && user.payTaxTo === selectedCollector;
    }
    return shouldCount;
  }).length;

  // Calculate payment statistics
  const noPaymentCount = registrations.filter((user) => {
    const shouldCount = !user.amountPaid || user.amountPaid === 0;
    if (selectedCollector) {
      return shouldCount && user.payTaxTo === selectedCollector;
    }
    return shouldCount;
  }).length;

  const depositOnlyCount = registrations.filter((user) => {
    const shouldCount =
      user.amountPaid &&
      user.amountPaid >= sumToPay.deposit &&
      user.amountPaid < sumToPay.normal;
    if (selectedCollector) {
      return shouldCount && user.payTaxTo === selectedCollector;
    }
    return shouldCount;
  }).length;

  const fullyPaidCount = registrations.filter((user) => {
    const shouldCount = user.amountPaid && user.amountPaid >= sumToPay.normal;
    if (selectedCollector) {
      return shouldCount && user.payTaxTo === selectedCollector;
    }
    return shouldCount;
  }).length;

  const paymentStats = [
    { name: "Nu au plătit", value: noPaymentCount, color: "#ef4444" },
    { name: "Au plătit avansul", value: depositOnlyCount, color: "#f59e0b" },
    { name: "Au plătit integral", value: fullyPaidCount, color: "#22c55e" },
  ];

  const handleAddExpense = async (expense: {
    title: string;
    description?: string;
    amount: number;
    category?: string;
  }) => {
    if (!user) return;
    await addExpense({
      ...expense,
      description: expense.description || "",
      category: expense.category || "",
      createdBy: user.userId,
      creatorName: user.name,
    });
  };

  const handleEditExpense = async (expenseData: {
    title: string;
    description?: string;
    amount: number;
    category?: string;
  }) => {
    if (!editingExpense) return;
    await updateExpense(editingExpense.id, expenseData);
  };

  const openEditDialog = (expense: typeof expenses[0]) => {
    setEditingExpense({
      id: expense.id,
      title: expense.title,
      description: expense.description || "",
      amount: expense.amount,
      category: expense.category || "",
    });
    setIsEditExpenseOpen(true);
  };

  const closeEditDialog = () => {
    setEditingExpense(null);
    setIsEditExpenseOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financiar</h1>
        {activeTab === "incasari" && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2",
                    selectedCollector && "bg-accent text-accent-foreground"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  {selectedCollector
                    ? getCollectorName(selectedCollector)
                    : "Toți casierii"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  {payTaxToOptions.map((collector) => (
                    <Button
                      key={collector.value}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setSelectedCollector(
                          selectedCollector === collector.value
                            ? null
                            : collector.value
                        );
                      }}
                    >
                      {selectedCollector === collector.value && (
                        <Check className="h-4 w-4" />
                      )}
                      <span
                        className={
                          selectedCollector === collector.value
                            ? "ml-0"
                            : "ml-6"
                        }
                      >
                        {collector.value}
                      </span>
                    </Button>
                  ))}
                  {selectedCollector && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedCollector(null)}
                    >
                      Arată toate
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="incasari">Încasări</TabsTrigger>
          <TabsTrigger value="cheltuieli">Cheltuieli</TabsTrigger>
        </TabsList>
        <TabsContent value="incasari" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Încasat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalCollected.toLocaleString()} RON
                </div>
                <p className="text-xs text-muted-foreground">
                  din {totalParticipants} participanți
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plăți Participanți</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={100} className="mb-1">
                  <PieChart data={paymentStats} />
                </ResponsiveContainer>
                <div className="flex flex-col justify-center mt-1">
                  {paymentStats.map((entry, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="w-4 h-4"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="ml-2 text-sm">
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col  justify-between">
              <CardTitle>Actualizări Recente</CardTitle>
              <AddIncomeDialog
                open={isAddIncomeOpen}
                onOpenChange={setIsAddIncomeOpen}
                registration={registrations}
                selectedCollector={selectedCollector}
                onSave={async (data: {
                  userId: string;
                  amount: number;
                  collectedBy: string;
                }) => {
                  const registration = registrations.find((u) => u.userId === data.userId);
                  if (!registration) return;
                  await updateUserPayment({
                    amount: data.amount,
                    collectedBy: data.collectedBy,
                    userName: registration.name,
                    userId: registration.userId,
                    registrationId: registration.id
                  });
                }}
              />
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setIsAddIncomeOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                Editeaza suma particpant
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Sumă</TableHead>
                    <TableHead>Casier</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Actualizat de</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncomes
                    .sort((a, b) => {
                      const dateA = a.paidOn || a.createdAt;
                      const dateB = b.paidOn || b.createdAt;
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((income) => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">
                          {income.userName}
                        </TableCell>
                        <TableCell>{income.amount} RON</TableCell>
                        <TableCell>
                          {getCollectorName(income.collectedBy)}
                        </TableCell>
                        <TableCell>
                          {(income.paidOn || income.createdAt).toLocaleString(
                            "ro-RO",
                            {
                              dateStyle: "short",
                              timeStyle: "short",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {income.updatedByName || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cheltuieli" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cheltuieli</CardTitle>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setIsAddExpenseOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Adaugă Cheltuială
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titlu</TableHead>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Sumă</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Înregistrat de</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[100px]">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.title}
                      </TableCell>
                      <TableCell>{expense.description || "-"}</TableCell>
                      <TableCell>{expense.amount} RON</TableCell>
                      <TableCell>{expense.category || "-"}</TableCell>
                      <TableCell>{expense.creatorName}</TableCell>
                      <TableCell>
                        {expense.createdAt.toLocaleDateString("ro-RO")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        Nu există cheltuieli înregistrate
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <AddExpenseDialog
            open={isAddExpenseOpen}
            onOpenChange={setIsAddExpenseOpen}
            onSave={handleAddExpense}
          />

          <ExpenseDialog
            open={isEditExpenseOpen}
            onOpenChange={closeEditDialog}
            onSave={handleEditExpense}
            initialData={editingExpense}
            mode="edit"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
