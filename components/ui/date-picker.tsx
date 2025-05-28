"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, HelpCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateRange } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DatePickerWithRangeProps {
  from: Date | null;
  to: Date | null;
  onChange: (dates: { from: Date; to: Date }) => void;
  className?: string;
}

export function DatePickerWithRange({
  className,
  from,
  to,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from || undefined,
    to: to || undefined,
  });

  const handleSelect = (selectedDate: DateRange | undefined) => {
    // Always update the internal state
    setDate(selectedDate);

    // Only call onChange when we have both dates
    if (selectedDate?.from && selectedDate?.to) {
      onChange({ from: selectedDate.from, to: selectedDate.to });
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className={cn(
              "w-full justify-start text-left font-normal border-2",
              !date?.from && "text-muted-foreground",
              date?.from && date?.to && "bg-primary/5 border-primary/30",
              "hover:bg-accent/10 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
          >
            <CalendarIcon
              className={cn(
                "mr-2 h-4 w-4",
                date?.from && date?.to && "text-primary"
              )}
            />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="font-medium text-primary">
                    {format(date.from, "dd.MM.yyyy")} -{" "}
                    {format(date.to, "dd.MM.yyyy")}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-medium">
                    {format(date.from, "dd.MM.yyyy")}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    {" "}
                    (selectează data de sfârșit)
                  </span>
                </>
              )
            ) : (
              <span>Alege perioada</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-card shadow-lg border-2"
          align="start"
          side="bottom"
        >
          <Calendar
            mode="range"
            defaultMonth={dateRange.startDate}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            disabled={(date) => {
              const startDate = new Date(dateRange.startDate);
              startDate.setHours(0, 0, 0, 0);
              return date < startDate || date > dateRange.endDate;
            }}
            className="rounded-md bg-card"
          />
          <div className="p-3 border-t border-border bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span>Start/Sfârșit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-accent"></div>
              <span>Zile intermediare</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
