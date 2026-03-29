import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function BudgetVsActual({ data }) {

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Budget",
        data: data.map(item => item.budget),
        backgroundColor: "#6366f1"
      },
      {
        label: "Actual",
        data: data.map(item => item.actual),
        backgroundColor: "#22c55e"
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: 0
  },

  plugins: {
    legend: {
      labels: {
        color: "#ffffff",
        padding: 6
      }
    }
  },

  scales: {
    x: {
      ticks: { color: "#ffffff" },
      grid: { display: false }
    },
    y: {
      ticks: {
        color: "#ffffff",
        padding: 4
      },
      grid: {
        color: "rgba(255,255,255,0.05)"
      }
    }
  }
};

 return (
  <div className="chart-container">
    <Bar data={chartData} options={options} />
  </div>
);
}