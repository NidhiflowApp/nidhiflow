import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InvestmentOverviewDonut({ data = [], total = 0 }) {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No investment data</div>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
  {
    data: data.map(item => item.value),
    backgroundColor: [
      "#4F46E5",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#F97316"
    ],
    borderColor: "#1F2937",      // better slice separation
    borderWidth: 2,
    hoverOffset: 15,             // stronger hover expansion
    hoverBorderWidth: 3,
    hoverBorderColor: "#FFFFFF"
  }
]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    animation: {
  animateRotate: true,
  animateScale: true,
  duration: 800,
  easing: "easeOutQuart"
},
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 14,
padding: 15,
color: "#FFFFFF",
font: {
  size: 13,
  weight: "500"
},
          generateLabels: chart => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage =
                total > 0
                  ? Math.round((value / total) * 100)
                  : 0;

             return {
  text: `${label} (${percentage}%)`,
  fillStyle: dataset.backgroundColor[i],
  strokeStyle: "transparent",
  fontColor: "#E5E7EB",
  color: "#E5E7EB",
  font: {
    size: 9,        // 🔽 Reduced from 13
    weight: "500"
  },
  index: i
};
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed;
            const percentage =
              total > 0
                ? Math.round((value / total) * 100)
                : 0;
            return `${ctx.label}: ₹${value} (${percentage}%)`;
          }
        }
      },
datalabels: {
  display: false
}
    }
  };

  return (
    <div className="chart-container" style={{ position: "relative" }}>
      <Doughnut
  data={chartData}
  options={options}
  onHover={(event, elements) => {
    if (elements.length > 0) {
      setHoveredIndex(elements[0].index);
    } else {
      setHoveredIndex(null);
    }
  }}
/>

      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-155%, -50%)",
          textAlign: "center",
          color: "#F9FAFB"
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "600" }}>
          {hoveredIndex !== null
  ? `₹${data[hoveredIndex].value.toLocaleString()}`
  : `₹${total.toLocaleString()}`
}
        </div>
        <div style={{ fontSize: "11px", opacity: 0.8 }}>
          {hoveredIndex !== null
  ? `${Math.round(
      (data[hoveredIndex].value / total) * 100
    )}%`
  : "Total Investment"
}
        </div>
      </div>
    </div>
  );
}