"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
    setDate(selectedDate);
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
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd.MM.yyyy")} -{" "}
                  {format(date.to, "dd.MM.yyyy")}
                </>
              ) : (
                format(date.from, "dd.MM.yyyy")
              )
            ) : (
              <span>Alege perioada</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <Calendar
            mode="range"
            defaultMonth={dateRange.startDate}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => {
              const startDate = new Date(dateRange.startDate);
              startDate.setHours(0, 0, 0, 0);
              return date < startDate || date > dateRange.endDate;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
