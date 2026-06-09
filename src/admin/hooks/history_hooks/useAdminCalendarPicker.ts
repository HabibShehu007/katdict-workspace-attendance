import { useState } from "react";
import { toast } from "sonner";

interface UseCalendarPickerProps {
  onSelectRange: (startDate: string, endDate: string) => void;
}

export function useAdminCalendarPicker({
  onSelectRange,
}: UseCalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayDate);
  const [endDate, setEndDate] = useState(todayDate);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Selection Required", {
        description: "Please select both a start and an end date.",
      });
      return;
    }

    if (startDate > endDate) {
      toast.error("Invalid Date Range", {
        description: "Start date cannot be after the end date.",
      });
      return;
    }

    if (startDate > todayDate || endDate > todayDate) {
      toast.error("Future Date Selected", {
        description: "You cannot select a future date.",
      });
      return;
    }

    onSelectRange(startDate, endDate);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleApply,
  };
}
