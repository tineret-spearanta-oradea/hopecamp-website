"use client";

import { useState } from "react";
import { columns } from "@/components/admin/messages/columns";
import { DataTable } from "@/components/admin/messages/data-table";
import { useMessages } from "@/hooks/use-messages";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const { messages, isLoading, error } = useMessages();

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
        Error loading messages: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90vw] mx-auto py-10 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mesaje</h1>
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={messages || []} />
      </div>
    </div>
  );
}
