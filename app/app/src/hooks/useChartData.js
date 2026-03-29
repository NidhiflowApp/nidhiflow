import { useEffect, useState } from "react";

/**
 * Generic hook to load and normalize chart data
 *
 * @param {Function} fetchFn - API / wire function
 * @param {Array} deps - dependency array (eg: [selectedMonth])
 * @param {Function} buildChart - function to build Chart.js data
 *
 * @returns {Object} { chartData, loading }
 */
export function useChartData(fetchFn, deps, buildChart) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);

        const result = await fetchFn();

        const chart = buildChart(result);

        if (isMounted) {
          setChartData(chart);
        }
      } catch (err) {
        console.error("useChartData error:", err);
        if (isMounted) {
          setChartData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { chartData, loading };
}
