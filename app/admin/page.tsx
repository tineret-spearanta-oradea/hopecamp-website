/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegistrations } from "@/hooks/use-registrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Users as UsersIcon,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Timer,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { dateRange } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { ro } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMessages } from "@/hooks/use-messages";
import { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export default function AdminDashboardPage() {
  const {
    registrations,
    isLoading: usersLoading,
    error: usersError,
    fetchRegistrations,
  } = useRegistrations();
  const {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    fetchMessages,
  } = useMessages();
  const router = useRouter();

  useEffect(() => {
    fetchRegistrations();
    fetchMessages();
  }, [fetchRegistrations, fetchMessages]);

  if (usersLoading || messagesLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (usersError || messagesError) {
    return (
      <div className="flex h-[450px] items-center justify-center text-red-500">
        Error loading data: {(usersError || messagesError)?.message}
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = registrations?.length || 0;
  const confirmedUsers = registrations?.filter((user) => user.isConfirmed).length || 0;
  const unconfirmedUsers = totalUsers - confirmedUsers;
  const totalAmountPaid =
    registrations?.reduce((sum, user) => sum + (user.amountPaid || 0), 0) || 0;
  const averageAge =
    registrations?.reduce((sum, user) => sum + (user.age || 0), 0) / totalUsers || 0;

  // Calculate days distribution
  const campDays = Array.from(
    { length: differenceInDays(dateRange.endDate, dateRange.startDate) + 1 },
    (_, i) => {
      const date = new Date(dateRange.startDate);
      date.setDate(date.getDate() + i);
      return date;
    }
  );

  const usersByDay = campDays.map((day) => {
    return {
      date: day,
      count:
        registrations?.filter((registration) => {
          if (!registration.startDate || !registration.endDate) return false;
          const start = new Date(registration.startDate);
          const end = new Date(registration.endDate);
          return start <= day && end >= day;
        }).length || 0,
    };
  });

  // Calculate time remaining
  const now = new Date();
  const daysUntilCamp = differenceInDays(dateRange.startDate, now);
  const isBeforeCamp = now < dateRange.startDate;
  const isCampOngoing = now >= dateRange.startDate && now <= dateRange.endDate;
  const isAfterCamp = now > dateRange.endDate;

  let timeRemainingText = "";
  if (isBeforeCamp) {
    timeRemainingText = `${daysUntilCamp} zile până la tabără`;
  } else if (isCampOngoing) {
    timeRemainingText = "Tabăra este în desfășurare";
  } else if (isAfterCamp) {
    timeRemainingText = "Tabăra s-a încheiat";
  }

  // Calculate registrations per day
  const registrationsByDay =
    registrations?.reduce((acc: { date: Date; count: number }[], user) => {
      const userDate = startOfDay(new Date(user.createdAt));
      const existingDay = acc.find((item) => isSameDay(item.date, userDate));

      if (existingDay) {
        existingDay.count++;
      } else {
        acc.push({ date: userDate, count: 1 });
      }

      return acc.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, []) || [];

  const maxRegistrations = Math.max(...registrationsByDay.map((d) => d.count));

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const data = [
    {
      name: "Vin cu mașina personală",
      value: registrations.filter((user) => user.transport === "personal").length,
    },
    {
      name: "Vin cu un prieten cu mașina",
      value: registrations.filter((user) => user.transport === "prieten").length,
    },
    {
      name: "Autocar de la biserică",
      value: registrations.filter((user) => user.transport === "autocar").length,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-1">Statistici</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserCard
          title="Participanți"
          value={totalUsers}
          description="înregistrați"
          icon={UsersIcon}
          iconColor="text-muted-foreground"
          isShiny={true}
        />

        <div
          className="rounded-lg cursor-pointer"
          onClick={() => router.push("/admin/messages")}
        >
          <Card className="group transition-all duration-300 hover:bg-accent/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mesaje necitite
              </CardTitle>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <ChevronRight
                  className={cn(
                    "h-4 w-4 opacity-0 -ml-4 transition-all duration-300",
                    "group-hover:opacity-100 group-hover:ml-0"
                  )}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages?.filter((msg) => !msg.isRead).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                din {messages?.length || 0} mesaje totale
              </p>
            </CardContent>
          </Card>
        </div>

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
                {registrations?.filter((user) => (user.age || 0) < 18).length || 0}{" "}
                participanți
              </p>
              <p className="text-sm">
                18-25:{" "}
                {registrations?.filter(
                  (user) => (user.age || 0) >= 18 && (user.age || 0) <= 25
                ).length || 0}{" "}
                participanți
              </p>
              <p className="text-sm">
                Peste 25:{" "}
                {registrations?.filter((user) => (user.age || 0) > 25).length || 0}{" "}
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
            <ResponsiveContainer width="100%" height={100} className="mb-1">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center mt-1">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="ml-2 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Plată</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmountPaid.toLocaleString()} RON
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Suma totală încasată
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Plătit Integral (
                  {registrations?.filter(
                    (user) =>
                      (user.amountPaid || 0) >=
                      (user.withFamilyMember ? 1000 : 800)
                  ).length || 0}{" "}
                  persoane)
                </p>
                <p className="text-xs text-muted-foreground">
                  Au achitat suma completă
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Plată Parțială (
                  {registrations?.filter(
                    (user) =>
                      (user.amountPaid || 0) > 0 &&
                      (user.amountPaid || 0) <
                        (user.withFamilyMember ? 1000 : 800)
                  ).length || 0}{" "}
                  persoane)
                </p>
                <p className="text-xs text-muted-foreground">
                  Au achitat o parte din sumă
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Neplătit (
                  {registrations?.filter((user) => !user.amountPaid).length || 0}{" "}
                  persoane)
                </p>
                <p className="text-xs text-muted-foreground">
                  Nu au efectuat nicio plată
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Distribuția pe Zile</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usersByDay.map(({ date, count }) => {
                const maxUsers = Math.max(...usersByDay.map((d) => d.count));
                const percentage = maxUsers > 0 ? (count / maxUsers) * 100 : 0;

                return (
                  <div key={date.toISOString()} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">
                        {date.toLocaleDateString("ro", {
                          weekday: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-muted-foreground">
                        {count} participanți
                      </span>
                    </div>
                    <div className="relative h-2 w-full bg-muted rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.max(percentage, 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Timp Rămas</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBeforeCamp ? daysUntilCamp : "-"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {timeRemainingText}
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                Data început:{" "}
                {dateRange.startDate.toLocaleDateString("ro", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm">
                Data sfârșit:{" "}
                {dateRange.endDate.toLocaleDateString("ro", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm">
                Durata:{" "}
                {differenceInDays(dateRange.endDate, dateRange.startDate) + 1}{" "}
                zile
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Înscrieri pe Zile</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={registrationsByDay.map(({ date, count }) => ({
                    date: format(date, "d MMM", { locale: ro }),
                    count,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-sm text-muted-foreground"
                  />
                  <YAxis className="text-sm text-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="font-medium">{label}</div>
                              <div className="font-medium text-right">
                                {payload[0].value}{" "}
                                {payload[0].value === 1
                                  ? "înscriere"
                                  : "înscrieri"}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
