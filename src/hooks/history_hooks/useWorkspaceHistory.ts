// Double check your hook looks like this:
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export function useWorkspaceHistory() {
  const { historyLogs, isHistoryLoading, fetchHistory } = useAuth();

  useEffect(() => {
    fetchHistory("7days"); // Pulls the trailing week automatically on component mount
  }, [fetchHistory]);

  return {
    historyLogs,
    isHistoryLoading,
    changeRange: (newRange: string) => fetchHistory(newRange),
  };
}
