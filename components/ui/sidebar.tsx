"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  children: React.ReactNode;
}

export function Sidebar({ children, className, isCollapsed }: SidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <ScrollArea className="h-full">{children}</ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "sticky top-0 h-screen border-r bg-background",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <ScrollArea className="h-full w-full">{children}</ScrollArea>
    </div>
  );
}
