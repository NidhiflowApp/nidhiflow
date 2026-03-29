import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function MonthlyExpenseTrend({ data }) {

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }
// ===== Trend Line Calculation =====
const amounts = data.map(item => item.amount);
const n = amounts.length;

const xValues = Array.from({ length: n }, (_, i) => i);
const xMean = xValues.reduce((a, b) => a + b, 0) / n;
const yMean = amounts.reduce((a, b) => a + b, 0) / n;

let numerator = 0;
let denominator = 0;

for (let i = 0; i < n; i++) {
  numerator += (xValues[i] - xMean) * (amounts[i] - yMean);
  denominator += (xValues[i] - xMean) ** 2;
}

const slope = denominator !== 0 ? numerator / denominator : 0;
const intercept = yMean - slope * xMean;

const trendLineData = xValues.map(x => intercept + slope * x);
const threshold = 0.5; // small tolerance

let trendColor;

if (slope > threshold) {
  trendColor = "#ef4444"; // Red → increasing expense
} else if (slope < -threshold) {
  trendColor = "#22c55e"; // Green → decreasing expense
} else {
  trendColor = "#9ca3af"; // Gray → neutral
}

// ===== End Trend Calculation =====
  const chartData = {
  labels: data.map(item => item.month),
  datasets: [
    {
      label: "Expenses",
      data: amounts,
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.2)",
      tension: 0.4,
      pointRadius: 5,
      hoverRadius: 6,
      pointBackgroundColor: "#6366f1"
    },
    {
  label: "Trend",
  data: trendLineData,
  borderColor: trendColor,
  borderDash: [6, 6],
  borderWidth: 2,
  pointRadius: 0,
  tension: 0,
}
  ]
};

 const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
  padding: {
    left: 20,
    right: 20,
    top: 10,
    bottom: 10
  }
},
  plugins: {
  datalabels: {
    display: false
  },
  legend: {
    labels: { color: "#ffffff", padding: 6 }
  },
  tooltip: {
    callbacks: {
      label: function(context) {
        return `₹ ${context.parsed.y.toLocaleString()}`;
      }
    }
  }
},
  scales: {
    x: {
  offset: true,
  ticks: {
    color: "#ffffff"
  },
  grid: {
    color: "rgba(255,255,255,0.05)"
  }
},
    y: {
      ticks: {
        color: "#ffffff",
        callback: function(value) {
          return "₹ " + value.toLocaleString();
        }
      }
    }
  }
};

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}