"use client";

import { useState, useEffect } from "react";
import { getUserRegistrationHistory } from "@/lib/supabase/database/registration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface RegistrationHistoryProps {
  userId: string;
  currentEditionId: number;
}

export default function RegistrationHistory({
  userId,
  currentEditionId,
}: RegistrationHistoryProps) {
  const [history, setHistory] = useState<Array<{
    id: number;
    editionId: number;
    editionName: string;
    editionTitle?: string;
    startDate: Date;
    endDate: Date;
  }>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getUserRegistrationHistory(userId, currentEditionId);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching registration history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [userId, currentEditionId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Istoric înregistrări</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Se încarcă...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return null; // Don't show the card if there's no history
  }

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = format(start, "d", { locale: ro });
    const endStr = format(end, "d MMM yyyy", { locale: ro });
    return `${startStr} - ${endStr}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Istoric înregistrări</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            {isExpanded ? (
              <>
                Ascunde <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Arată {history.length} {history.length === 1 ? "ediție" : "ediții"}{" "}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors"
              >
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.editionName}</p>
                  {item.editionTitle && (
                    <p className="text-sm text-muted-foreground truncate">
                      {item.editionTitle}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDateRange(item.startDate, item.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
