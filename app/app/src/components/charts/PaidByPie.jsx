import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaidByPie({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

  if (data.length === 1) {
    return (
      <div className="chart-empty">
        Only {data[0].label} contributed this month.
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4"
        ]
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,

  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1200,
    easing: "easeOutQuart"
  },

  hover: {
    mode: "nearest",
    intersect: true
  },

  elements: {
    arc: {
      borderWidth: 2,
      borderColor: "#1f2937",
      hoverOffset: 20   // 🔥 Zoom effect on hover
    }
  },

  plugins: {
  legend: {
    position: "right",   // we’ll move legend also
    labels: {
      color: "#ffffff",
      padding: 20,
      usePointStyle: true,
      boxWidth: 14
    }
  },

  datalabels: {
    display: false   // 🔥 THIS removes numbers inside pie
  },

  tooltip: {
    callbacks: {
      label: function(context) {
        const value = context.raw;
        const total = context.dataset.data.reduce((a, b) => a + b, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return `${context.label}: ₹${value.toLocaleString()} (${percentage}%)`;
      }
    }
  }
}
};

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
}