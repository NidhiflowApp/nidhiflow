import { useEffect, useState, useCallback } from "react";
import { getDashboardData } from "../services/dashboardService";

export const useDashboardData = (year, month) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    console.log("🔥 REFETCH CALLED");
    try {
      setLoading(true);
      const result = await getDashboardData(year, month);
      console.log("🔥 NEW DATA:", result);
      setData(result);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};
