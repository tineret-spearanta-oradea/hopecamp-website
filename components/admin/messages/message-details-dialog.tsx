import { AdminMessage } from "@/types/message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, User, Phone, MessageSquare } from "lucide-react";

interface MessageDetailsDialogProps {
  message: AdminMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDetailsDialog({
  message,
  isOpen,
  onClose,
}: MessageDetailsDialogProps) {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Detalii Mesaj
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <Badge variant={message.isRead ? "default" : "destructive"}>
              {message.isRead ? "Citit" : "Necitit"}
            </Badge>
            <div className="text-sm text-muted-foreground">
              ID: {message.id}
            </div>
          </div>

          {/* Sender Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              Expeditor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Nume
                </div>
                <div className="text-lg">{message.userName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Telefon
                </div>
                <div className="text-lg flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-blue-500">{message.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Mesaj</h3>
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Trimis la:</span>
                <span className="text-sm">
                  {format(message.sentDate, "dd/MM/yyyy HH:mm:ss")}
                </span>
              </div>

              {message.isRead && message.readAt && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-sm font-medium">Citit la:</span>
                  <span className="text-sm">
                    {format(message.readAt, "dd/MM/yyyy HH:mm:ss")}
                  </span>
                </div>
              )}

              {message.readByUserName && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-sm font-medium">Citit de:</span>
                  <span className="text-sm font-medium">
                    {message.readByUserName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
