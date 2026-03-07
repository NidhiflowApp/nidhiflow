import apiClient from "../services/apiClient";

/* ======================================================
   🍩 EXPENSE CATEGORY SPLIT WIRE (FINAL)
   ------------------------------------------------------
   - Uses /api/dashboard/category-split
   - Backend already returns percentage values
   - Chart.js SAFE (never crashes)
   ====================================================== */

export async function getExpenseCategorySplit(selectedMonth) {
  if (!selectedMonth) {
    return {
      labels: [],
      datasets: []
    };
  }

  try {
    const [year, rawMonth] = selectedMonth.split("-");
    const month = Number(rawMonth);

    const response = await apiClient.get(
      "/api/dashboard/category-split",
      {
        params: { year, month }
      }
    );

    const data = Array.isArray(response.data)
      ? response.data
      : [];

    return {
      labels: data.map(
        item => `${item.label} (${item.value}%)`
      ),
      datasets: [
        {
          data: data.map(item => Number(item.value) || 0),
          backgroundColor: [
            "rgba(129, 140, 248, 0.95)", // violet
            "rgba(74, 222, 128, 0.95)",  // green
            "rgba(56, 189, 248, 0.95)",  // cyan
            "rgba(248, 113, 113, 0.95)", // red
            "rgba(250, 204, 21, 0.95)"   // yellow
          ],
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    };
  } catch (error) {
    console.error("Expense Category Split Wire Error:", error);

    // ✅ Chart.js safe fallback
    return {
      labels: [],
      datasets: []
    };
  }
}
