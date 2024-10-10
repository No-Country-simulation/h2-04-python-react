/* eslint-disable react/prop-types */
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/common/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";

export function DatePicker({ selectedDate, onDateChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground border-none border-0"
          )}
        >
          <CalendarIcon className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
