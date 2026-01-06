"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getActiveEdition } from "@/lib/supabase/database/edition";
import {
  getPendingContactsByEdition,
  getPendingContactsCount,
  updatePendingContact,
  addContactHistoryEntry,
  abandonPendingContact,
} from "@/lib/supabase/database/pendingContact";
import {
  PendingContact,
  UpdatePendingContactInput,
  ContactHistoryEntry,
} from "@/types/pendingContact";

export function usePendingContacts() {
  const [pendingContacts, setPendingContacts] = useState<PendingContact[]>([]);
  const [counts, setCounts] = useState<{
    new: number;
    contacted: number;
    total: number;
  }>({ new: 0, contacted: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPendingContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentEdition = await getActiveEdition();
      const [contacts, countsData] = await Promise.all([
        getPendingContactsByEdition(currentEdition.id),
        getPendingContactsCount(currentEdition.id),
      ]);
      setPendingContacts(contacts);
      setCounts(countsData);
    } catch (err) {
      console.error("Error fetching pending contacts:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContact = useCallback(
    async (id: number, updates: UpdatePendingContactInput) => {
      try {
        const updated = await updatePendingContact(id, updates);
        setPendingContacts((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        toast.success("Contact actualizat cu succes");
        return updated;
      } catch (err) {
        console.error("Error updating contact:", err);
        toast.error("Nu am putut actualiza contactul");
        throw err;
      }
    },
    []
  );

  const addHistoryEntry = useCallback(
    async (id: number, entry: ContactHistoryEntry) => {
      try {
        const updated = await addContactHistoryEntry(id, entry);
        setPendingContacts((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        // Update counts - move from 'new' to 'contacted' if applicable
        setCounts((prev) => {
          const contact = pendingContacts.find((c) => c.id === id);
          if (contact?.status === "new") {
            return {
              ...prev,
              new: prev.new - 1,
              contacted: prev.contacted + 1,
            };
          }
          return prev;
        });
        toast.success("Notă adăugată cu succes");
        return updated;
      } catch (err) {
        console.error("Error adding history entry:", err);
        toast.error("Nu am putut adăuga nota");
        throw err;
      }
    },
    [pendingContacts]
  );

  const createRegistration = useCallback(
    async (id: number, _adminUserId: string) => {
      try {
        setIsLoading(true);

        // Use API route which has service role access
        const response = await fetch('/api/admin/pending-contacts/create-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pendingContactId: id }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          toast.error("Nu am putut crea înregistrarea", {
            description: result.error,
          });
          return { success: false, error: result.error };
        }

        // Update local state - mark as resolved
        setPendingContacts((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "resolved" as const,
                  resolvedRegistrationId: result.registrationId || null,
                }
              : c
          )
        );

        // Update counts
        setCounts((prev) => {
          const contact = pendingContacts.find((c) => c.id === id);
          if (contact?.status === "new") {
            return { ...prev, new: prev.new - 1, total: prev.total - 1 };
          } else if (contact?.status === "contacted") {
            return {
              ...prev,
              contacted: prev.contacted - 1,
              total: prev.total - 1,
            };
          }
          return prev;
        });

        toast.success("Înregistrare creată cu succes!");
        return result;
      } catch (err) {
        console.error("Error creating registration:", err);
        toast.error("Nu am putut crea înregistrarea");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pendingContacts]
  );

  const abandonContact = useCallback(
    async (id: number) => {
      try {
        const updated = await abandonPendingContact(id);
        setPendingContacts((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );

        // Update counts
        setCounts((prev) => {
          const contact = pendingContacts.find((c) => c.id === id);
          if (contact?.status === "new") {
            return { ...prev, new: prev.new - 1, total: prev.total - 1 };
          } else if (contact?.status === "contacted") {
            return {
              ...prev,
              contacted: prev.contacted - 1,
              total: prev.total - 1,
            };
          }
          return prev;
        });

        toast.success("Contact marcat ca abandonat");
        return updated;
      } catch (err) {
        console.error("Error abandoning contact:", err);
        toast.error("Nu am putut actualiza contactul");
        throw err;
      }
    },
    [pendingContacts]
  );

  return {
    pendingContacts,
    counts,
    isLoading,
    error,
    fetchPendingContacts,
    updateContact,
    addHistoryEntry,
    createRegistration,
    abandonContact,
    refetch: fetchPendingContacts,
  };
}
