import { RegistrationWithProfile } from "@/types/registrationWithProfile";
import { Edition } from "@/types/edition";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  CalendarDays,
  Church,
  Bus,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface RegistrationDetailsCardProps {
  registration: RegistrationWithProfile;
  edition: Edition;
}

export default function RegistrationDetailsCard({
  registration,
  edition,
}: RegistrationDetailsCardProps) {
  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: ro });
  };

  const formatDateRange = () => {
    const start = format(registration.startDate, "d", { locale: ro });
    const end = format(registration.endDate, "d MMM yyyy", { locale: ro });
    return `${start} - ${end}`;
  };

  return (
    <Card className="border-hope-lightcyan/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Detalii înregistrare</CardTitle>
          {registration.isConfirmed ? (
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Confirmat
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              <Clock className="h-3 w-3 mr-1" />
              În așteptare
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Edition Info */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">Ediție</p>
          <p className="text-base font-medium">{edition.name}</p>
          {edition.title && (
            <p className="text-sm text-muted-foreground">{edition.title}</p>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-start gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="text-sm font-semibold text-muted-foreground">
              Perioada participare
            </p>
            <p className="text-base">{formatDateRange()}</p>
          </div>
        </div>

        {/* Church */}
        {registration.church && (
          <div className="flex items-start gap-2">
            <Church className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Biserica
              </p>
              <p className="text-base">
                {registration.church === "alta"
                  ? registration.churchOther || "Altă biserică"
                  : registration.church}
              </p>
              {registration.churchContact && (
                <p className="text-sm text-muted-foreground">
                  Contact: {registration.churchContact}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transport */}
        {registration.transport && (
          <div className="flex items-start gap-2">
            <Bus className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Transport
              </p>
              <p className="text-base">{registration.transport}</p>
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="flex items-start gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="text-sm font-semibold text-muted-foreground">
              Plată
            </p>
            <p className="text-base">
              {registration.amountPaid > 0
                ? `${registration.amountPaid} RON plătit`
                : "Neplătit"}
            </p>
            {registration.payTaxTo && (
              <p className="text-sm text-muted-foreground">
                Colector: {registration.payTaxTo}
              </p>
            )}
          </div>
        </div>

        {/* Preferences */}
        {registration.preferences && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Preferințe / Observații
              </p>
              <p className="text-sm text-muted-foreground">
                {registration.preferences}
              </p>
            </div>
          </div>
        )}

        {/* Registration Date */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          Înregistrat la: {formatDate(registration.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
