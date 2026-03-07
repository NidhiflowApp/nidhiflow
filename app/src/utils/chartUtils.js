// Normalize any backend response to a safe array
export function normalizeArray(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

// Build basic bar chart data safely
export function buildBarChartData({
  data,
  labelKey = "label",
  valueKey = "value",
  color = "rgba(129, 140, 248, 0.9)"
}) {
  const safeData = normalizeArray(data);

  if (safeData.length === 0) return null;

  return {
    labels: safeData.map(item => item[labelKey] ?? ""),
    datasets: [
      {
        data: safeData.map(item => Number(item[valueKey]) || 0),
        backgroundColor: color,
        borderRadius: 6,
        barThickness: 10
      }
    ]
  };
}
// Build doughnut / pie chart data safely
export function buildDonutChartData({
  data,
  labelKey = "label",
  valueKey = "value",
  colors = []
}) {
  const safeData = normalizeArray(data);

  if (safeData.length === 0) return null;

  return {
    labels: safeData.map(item => item[labelKey] ?? ""),
    datasets: [
      {
        data: safeData.map(item => Number(item[valueKey]) || 0),
        backgroundColor:
          colors.length > 0
            ? colors
            : safeData.map(
                (_, i) =>
                  `hsl(${(i * 360) / safeData.length}, 70%, 60%)`
              ),
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };
}
