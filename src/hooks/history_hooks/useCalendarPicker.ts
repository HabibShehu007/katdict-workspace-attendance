// hooks/history_hooks/useCalendarPicker.ts
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

interface UseCalendarPickerProps {
  onSelectRange: (startDate: string, endDate: string) => void;
}

export function useCalendarPicker({ onSelectRange }: UseCalendarPickerProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fallback to project launch date if user context isn't fully loaded yet
  const signupDate = user?.createdAt
    ? user.createdAt.split("T")[0]
    : "2026-06-02";
  const todayDate = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayDate);
  const [endDate, setEndDate] = useState(todayDate);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Guard: Check if fields are empty
    if (!startDate || !endDate) {
      toast.error("Selection Required", {
        description: "Please select both a start and an end date to continue.",
      });
      return;
    }

    // 2. Guard: Check if start date is after end date
    if (startDate > endDate) {
      toast.error("Invalid Date Range", {
        description: "The start date cannot be later than the end date.",
      });
      return;
    }

    // 3. Guard: Check if dates precede account creation
    if (startDate < signupDate || endDate < signupDate) {
      toast.error("Outside Account History", {
        description: `Records are only available from your join date onwards (${signupDate}).`,
      });
      return;
    }

    // 4. Guard: Check if dates are in the future
    if (startDate > todayDate || endDate > todayDate) {
      toast.error("Future Date Selected", {
        description: "You cannot select a date that has not occurred yet.",
      });
      return;
    }

    // Finalize selection
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
