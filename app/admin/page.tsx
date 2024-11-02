/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUsers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Users as UsersIcon,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { users, isLoading, error } = useUsers();
  const router = useRouter();

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
        Error loading data: {error.message}
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const confirmedUsers = users?.filter((user) => user.isConfirmed).length || 0;
  const unconfirmedUsers = totalUsers - confirmedUsers;
  const totalAmountPaid =
    users?.reduce((sum, user) => sum + (user.amountPaid || 0), 0) || 0;
  const averageAge =
    users?.reduce((sum, user) => sum + (user.age || 0), 0) / totalUsers || 0;

  const UserCard = ({
    title,
    value,
    description,
    icon: Icon,
    iconColor,
    isShiny,
  }: {
    title: string;
    value: number;
    description: string;
    icon: any;
    iconColor?: string;
    isShiny?: boolean;
  }) => (
    <div
      className={cn(
        "rounded-lg",
        isShiny && [
          "bg-gradient-to-r from-hope-darkcyan to-hope-orange p-[1px] rounded-xl",
          "shadow-[0_0_30px_2px_rgba(0,0,0,0.1)]",
          "hover:shadow-[0_0_30px_2px_rgba(0,0,0,0.2)]",
          "transition-all duration-300",
        ]
      )}
    >
      <Card
        onClick={() => router.push("/admin/users")}
        className={cn(
          "h-full",
          "group cursor-pointer transition-all duration-300",
          isShiny && ["border-0", "bg-background", "hover:bg-accent/50"]
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", iconColor)} />
            <ChevronRight
              className={cn(
                "h-4 w-4 opacity-0 -ml-4 transition-all duration-300",
                "group-hover:opacity-100 group-hover:ml-0"
              )}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Statistici</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserCard
          title="Participanți"
          value={totalUsers}
          description="înregistrați"
          icon={UsersIcon}
          iconColor="text-muted-foreground"
          isShiny={true}
        />

        <UserCard
          title="Participanți Confirmați"
          value={confirmedUsers}
          description={`${((confirmedUsers / totalUsers) * 100).toFixed(
            1
          )}% din total`}
          icon={CheckCircle}
          iconColor="text-emerald-600"
        />

        <UserCard
          title="În Așteptare"
          value={unconfirmedUsers}
          description="necesită confirmare"
          icon={AlertCircle}
          iconColor="text-orange-500"
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suma Totală Plătită
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmountPaid} RON</div>
            <p className="text-xs text-muted-foreground">
              Media: {(totalAmountPaid / totalUsers).toFixed(0)} RON per
              participant
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Distribuția Vârstelor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAge.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">
              Vârsta medie a participanților
            </p>
            <div className="mt-4">
              <p className="text-sm">
                Sub 18:{" "}
                {users?.filter((user) => (user.age || 0) < 18).length || 0}{" "}
                participanți
              </p>
              <p className="text-sm">
                18-25:{" "}
                {users?.filter(
                  (user) => (user.age || 0) >= 18 && (user.age || 0) <= 25
                ).length || 0}{" "}
                participanți
              </p>
              <p className="text-sm">
                Peste 25:{" "}
                {users?.filter((user) => (user.age || 0) > 25).length || 0}{" "}
                participanți
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Personal:{" "}
                {users?.filter((user) => user.transport === "personal")
                  .length || 0}
              </p>
              <p className="text-sm">
                Autocar:{" "}
                {users?.filter((user) => user.transport === "bus").length || 0}
              </p>
              <p className="text-sm">
                Altele:{" "}
                {users?.filter(
                  (user) =>
                    user.transport &&
                    user.transport !== "personal" &&
                    user.transport !== "bus"
                ).length || 0}
              </p>
              <p className="text-sm">
                Nespecificat:{" "}
                {users?.filter((user) => !user.transport).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Plată</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Plătit Integral:{" "}
                {users?.filter(
                  (user) =>
                    (user.amountPaid || 0) >=
                    (user.withFamilyMember ? 1000 : 800)
                ).length || 0}
              </p>
              <p className="text-sm">
                Plată Parțială:{" "}
                {users?.filter(
                  (user) =>
                    (user.amountPaid || 0) > 0 &&
                    (user.amountPaid || 0) <
                      (user.withFamilyMember ? 1000 : 800)
                ).length || 0}
              </p>
              <p className="text-sm">
                Neplătit:{" "}
                {users?.filter((user) => !user.amountPaid).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
