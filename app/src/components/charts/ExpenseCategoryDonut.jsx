import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function ExpenseCategoryDonut({ data }) {

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          "#5B3CC4", // Fixed
          "#1E88E5", // Variable
          "#FB8C00", // Wants
          "#E53935", // Emergency
          "#43A047"  // Savings
        ],
        borderColor: "#111827",
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#ffffff",
          padding: 16,
          boxWidth: 14,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: "#ffffff",
        font: {
          weight: "bold",
          size: 13
        },
        formatter: (value) => {
          const percentage = ((value / total) * 100).toFixed(0);
          return percentage > 0 ? `${percentage}%` : "";
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}