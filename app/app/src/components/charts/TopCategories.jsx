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

export default function TopCategories({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Amount",
        data: data.map(item => item.value),
        backgroundColor: "#f59e0b"
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
    display: false
  },
  tooltip: {
    callbacks: {
      label: function(context) {
        return "₹" + context.raw.toLocaleString();
      }
    }
  },
  datalabels: {
    display: false
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
    padding: 4,
    callback: function(value) {
      return "₹" + value.toLocaleString();
    }
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