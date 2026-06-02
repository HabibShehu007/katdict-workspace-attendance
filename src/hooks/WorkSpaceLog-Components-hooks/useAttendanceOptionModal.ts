import { useCallback } from "react";

interface UseAttendanceOptionModalProps {
  onClose: () => void;
  onAttendanceOnlySelected: () => void;
  onBothSelected: () => void;
}

export function useAttendanceOptionModal({
  onClose,
  onAttendanceOnlySelected,
  onBothSelected,
}: UseAttendanceOptionModalProps) {
  const handleAttendanceOnlyAction = useCallback(() => {
    onAttendanceOnlySelected(); // Triggers the backend save
    onClose(); // Shuts down the modal overlay
  }, [onAttendanceOnlySelected, onClose]);

  const handleBothAction = useCallback(() => {
    onBothSelected(); // Directs the UI to pop up the log form details
    onClose(); // Shuts down the option modal overlay
  }, [onBothSelected, onClose]);

  return {
    handleAttendanceOnlyAction,
    handleBothAction,
  };
}
