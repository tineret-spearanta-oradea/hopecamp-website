import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  addDoc,
  serverTimestamp,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  description?: string;
  createdBy: string;
  creatorName: string;
  createdAt: Date;
  category?: string;
  receipt?: string;
}

export interface Income {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  collectedBy: string;
  collectorName: string;
  createdAt: Date;
  paidOn?: Date;
}

export function useFinancials() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncomes = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersQuery = query(
        collection(db, "users"),
        where("amountPaid", ">", 0),
        orderBy("amountPaid", "desc")
      );
      const snapshot = await getDocs(usersQuery);

      const incomesData = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Helper function to safely convert Firestore timestamps to Date objects
        const convertTimestamp = (timestamp: unknown) => {
          if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
          }
          if (timestamp instanceof Date) {
            return timestamp;
          }
          return new Date();
        };

        return {
          id: doc.id,
          userId: doc.id,
          userName: data.name || "",
          amount: Number(data.amountPaid) || 0,
          collectedBy: data.payTaxTo || "",
          collectorName: data.payTaxTo || "",
          createdAt: convertTimestamp(data.createdAt),
          paidOn: data.paidOn ? convertTimestamp(data.paidOn) : undefined,
        } as Income;
      });

      setIncomes(incomesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const expensesQuery = query(
        collection(db, "expenses"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(expensesQuery);

      const expensesData = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Helper function to safely convert Firestore timestamps to Date objects
        const convertTimestamp = (timestamp: unknown) => {
          if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
          }
          if (timestamp instanceof Date) {
            return timestamp;
          }
          return new Date();
        };

        return {
          id: doc.id,
          title: data.title || "",
          amount: Number(data.amount) || 0,
          description: data.description || "",
          createdBy: data.createdBy || "",
          creatorName: data.creatorName || "",
          createdAt: convertTimestamp(data.createdAt),
          category: data.category,
          receipt: data.receipt,
        } as Expense;
      });

      setExpenses(expensesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserPayment = async (data: {
    userId: string;
    amount: number;
    collectedBy: string;
    userName: string;
  }) => {
    const userRef = doc(db, "users", data.userId);
    await updateDoc(userRef, {
      amountPaid: data.amount,
      payTaxTo: data.collectedBy,
      paidOn: serverTimestamp(),
    });

    // Update local state instead of refetching
    setIncomes((prev) => {
      const existingIndex = prev.findIndex(
        (income) => income.id === data.userId
      );
      const newIncome: Income = {
        id: data.userId,
        userId: data.userId,
        userName: data.userName,
        amount: data.amount,
        collectedBy: data.collectedBy,
        collectorName: data.collectedBy,
        paidOn: new Date(),
        createdAt: new Date(),
      };

      if (existingIndex !== -1) {
        const newIncomes = [...prev];
        newIncomes[existingIndex] = { ...prev[existingIndex], ...newIncome };
        return newIncomes;
      }

      return [newIncome, ...prev];
    });
  };

  const addExpense = async (data: {
    title: string;
    description: string;
    amount: number;
    category: string;
    createdBy: string;
    creatorName: string;
  }) => {
    const expenseRef = await addDoc(collection(db, "expenses"), {
      ...data,
      createdAt: serverTimestamp(),
    });

    // Update local state instead of refetching
    const newExpense = {
      id: expenseRef.id,
      ...data,
      createdAt: new Date(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  return {
    expenses,
    incomes,
    isLoading,
    error,
    fetchExpenses,
    fetchIncomes,
    addExpense,
    updateUserPayment,
    refetch: fetchExpenses,
  };
}
