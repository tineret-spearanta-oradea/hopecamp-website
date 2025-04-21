import { useState, useCallback } from "react";
import {RegistrationWithProfile, getRegistrationsByEditionId} from "@/lib/supabase/database/registration";
import {getActiveEdition} from "@/lib/supabase/database/edition";

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
      const registrations=await getRegistrationsByEditionId(currentEdition.id);
      setRegistrations(registrations);
      setError(null);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    registrations,
    isLoading,
    error,
    fetchRegistrations,
  };
}
