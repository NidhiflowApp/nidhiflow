import apiClient from "../services/apiClient";

/* ======================================================
   🔗 BUDGET VS ACTUAL WIRE (FINAL)
   ------------------------------------------------------
   - Uses correct /api/dashboard endpoint
   - Returns RAW ARRAY ONLY
   - Component builds Chart.js data
   ====================================================== */

export async function getBudgetVsActual(selectedMonth) {
  if (!selectedMonth) return [];

  try {
    const [year, rawMonth] = selectedMonth.split("-");
    const month = Number(rawMonth); // backend-safe

    const response = await apiClient.get(
      "/api/dashboard/budget-vs-actual",
      {
        params: { year, month }
      }
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    console.error("Budget Vs Actual Wire Error:", error);
    return [];
  }
}
