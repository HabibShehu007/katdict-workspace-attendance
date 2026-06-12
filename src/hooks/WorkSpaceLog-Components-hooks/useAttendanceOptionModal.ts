import { useState, useCallback } from "react";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAttendanceOnlyAction = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    await onAttendanceOnlySelected();

    setIsProcessing(false);
    onClose();
  }, [onAttendanceOnlySelected, onClose, isProcessing]);

  const handleBothAction = useCallback(() => {
    // This doesn't need to be async because it just opens another modal/UI
    onBothSelected();
    onClose();
  }, [onBothSelected, onClose]);

  return {
    handleAttendanceOnlyAction,
    handleBothAction,
    isProcessing,
  };
}
