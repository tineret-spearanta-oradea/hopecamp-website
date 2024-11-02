"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Home, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    href: "/admin",
    superAdminOnly: false,
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    superAdminOnly: false,
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
    superAdminOnly: false,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    superAdminOnly: true,
  },
];

export function AdminNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isSuperAdmin = user?.isSuperAdmin;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold">Admin Dashboard</h2>
      </div>
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.superAdminOnly && !isSuperAdmin) return null;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-accent"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
