import apiClient from "../services/apiClient";

/* ======================================================
   👤 PAID BY SUMMARY (₹)
   ------------------------------------------------------
   - Fetches who paid how much in a month
   - Returns ARRAY (UI decides chart format)
   - BULLETPROOF & CONSISTENT
   ====================================================== */
export async function getPaidBySummary(selectedMonth) {
  if (!selectedMonth) return [];

  try {
    const [year, month] = selectedMonth.split("-");

    const response = await apiClient.get(
      "/api/dashboard/paid-by",
      {
        params: {
          year,
          month: Number(month) // backend-safe (1 or 01 both ok)
        }
      }
    );

    // 🔐 HARD GUARANTEE: always return array
    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    console.error("Paid By Wire Error:", error);
    return [];
  }
}
