"use client";

import { Home, Users, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Admin Dashboard</h2>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => {
          if (item.superAdminOnly && !isSuperAdmin) {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 hover:bg-accent",
                "transition-colors",
                pathname === item.href && "bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <p className="text-sm text-muted-foreground">Logged in as:</p>
        <p className="font-medium">{user?.email}</p>
      </div>
    </div>
  );
}
