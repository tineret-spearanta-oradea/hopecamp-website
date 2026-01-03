"use client";

import { PendingContact } from "@/types/pendingContact";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Phone, Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ro } from "date-fns/locale";

interface PendingContactsTableProps {
  contacts: PendingContact[];
  onViewDetails: (contact: PendingContact) => void;
  canWrite: boolean;
}

const statusColors: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  new: "destructive",
  contacted: "default",
  resolved: "secondary",
  abandoned: "outline",
};

const statusLabels: Record<string, string> = {
  new: "Nou",
  contacted: "Contactat",
  resolved: "Rezolvat",
  abandoned: "Abandonat",
};

export function PendingContactsTable({
  contacts,
  onViewDetails,
}: PendingContactsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Creat</TableHead>
            <TableHead>Contactări</TableHead>
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetails(contact)}
            >
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {contact.phone}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[contact.status]}>
                  {statusLabels[contact.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span title={format(contact.createdAt, "dd MMM yyyy HH:mm", { locale: ro })}>
                    {formatDistanceToNow(contact.createdAt, {
                      addSuffix: true,
                      locale: ro,
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  {contact.contactHistory.length}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(contact);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Detalii
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
