import apiClient from "../services/apiClient";

/* ======================================================
   🔗 TOP CATEGORIES WIRE (FINAL)
   ------------------------------------------------------
   - Uses correct /api/dashboard endpoint
   - Normalizes month
   - Returns RAW ARRAY ONLY
   - UI builds Chart.js structure
   ====================================================== */

export async function getTopCategories(selectedMonth) {
  if (!selectedMonth) return [];

  try {
    const [year, rawMonth] = selectedMonth.split("-");
    const month = Number(rawMonth); // backend-safe

    const response = await apiClient.get(
      "/api/dashboard/top-categories",
      {
        params: { year, month }
      }
    );

    // 🔐 HARD GUARANTEE: always array
    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    console.error("Top Categories Wire Error:", error);
    return [];
  }
}
