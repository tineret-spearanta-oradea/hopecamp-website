"use client";

import { columns } from "@/components/admin/messages/columns";
import { DataTable } from "@/components/admin/messages/data-table";
import { useMessages } from "@/hooks/use-messages";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MessagesPage() {
  const { messages, isLoading, error, fetchMessages } = useMessages();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    // Only show tooltip if there are unread messages
    const unreadMessages = messages?.filter((msg) => !msg.isRead) || [];
    const hasSeenTooltip = localStorage.getItem("hasSeenMessagesStatusTooltip");

    if (!hasSeenTooltip && unreadMessages.length > 0) {
      setShowTooltip(true);
      localStorage.setItem("hasSeenMessagesStatusTooltip", "true");

      // Auto-hide tooltip after 5 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Custom columns with tooltip
  const columnsWithTooltip = columns.map((col) => {
    if (col.header === "Status") {
      return {
        ...col,
        header: () => (
          <TooltipProvider>
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild>
                <div className="cursor-default">Status</div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-background border-2 border-primary p-3"
              >
                <p className="text-sm">
                  Click pentru a marca mesajele ca citite/necitite
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      };
    }
    return col;
  });

  return (
    <div className="w-full max-w-[90vw] mx-auto py-10 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mesaje</h1>
      </div>

      {isLoading ? (
        <div className="flex h-[450px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex h-[450px] items-center justify-center text-red-500">
          Error loading messages: {error.message}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable columns={columnsWithTooltip} data={messages || []} />
        </div>
      )}
    </div>
  );
}
