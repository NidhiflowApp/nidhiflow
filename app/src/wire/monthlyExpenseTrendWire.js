// ======================================================
// 📡 FETCH MONTHLY EXPENSE TREND FROM BACKEND
// ======================================================

export async function getMonthlyExpenseTrend() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/expenses/monthly-trend"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch monthly trend");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Wire Error:", error);
    return {
      labels: [],
      values: []
    };
  }
}
