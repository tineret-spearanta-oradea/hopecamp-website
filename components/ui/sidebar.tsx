"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  children: React.ReactNode;
}

export function Sidebar({ children, className, isCollapsed }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="muted"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden bg-foreground/50 shadow-sm hover:bg-accent"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0 pt-10">
          <ScrollArea className="h-[calc(100vh-40px)]">{children}</ScrollArea>
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
