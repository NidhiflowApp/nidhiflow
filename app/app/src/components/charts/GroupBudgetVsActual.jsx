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

export default function GroupBudgetVsActual({ data }) {

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

 

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Budget",
        data: data.map(item => item.budget),
        backgroundColor: "rgba(99,102,241,0.6)",
        borderRadius: 8,
        barThickness: 12
      },
      {
  label: "Actual",
  data: data.map(item => item.actual),
  backgroundColor: data.map(item =>
    item.actual > item.budget ? "#ef4444" : "#22c55e"
  ),
  borderRadius: 8,
  barThickness: 12
}
    ]
  };

  const options = {
    indexAxis: "y", // 🔥 Horizontal
    responsive: true,
    maintainAspectRatio: false,
layout: {
  padding: {
    left: 10,
    right: 20,
    top: 10,
    bottom: 10
  }
},
    plugins: {
  legend: {
    position: "bottom",
    labels: {
      color: "#ffffff"
    }
  },
  tooltip: {
    callbacks: {
      label: function(context) {
        return context.dataset.label + ": ₹ " +
               Number(context.raw).toLocaleString("en-IN");
      }
    }
  },

  // 🔥 THIS DISABLES GLOBAL DATALABELS
  datalabels: {
    display: false
  }
},

    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
          callback: function(value) {
            return "₹ " + value.toLocaleString("en-IN");
          }
        },
        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      },
      y: {
        ticks: {
          color: "#ffffff"
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}