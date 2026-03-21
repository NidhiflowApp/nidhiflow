import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../styles/chartsDashboard.css";
import "../styles/personalBudget.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* Charts */
import MonthlyExpenseTrend from "../components/charts/MonthlyExpenseTrend";
import ExpenseCategoryDonut from "../components/charts/ExpenseCategoryDonut";
import InvestmentOverviewDonut from "../components/charts/InvestmentOverviewDonut";
import GroupBudgetVsActual from "../components/charts/GroupBudgetVsActual";
import TopCategories from "../components/charts/TopCategories";
import PaidByPie from "../components/charts/PaidByPie";

export default function ChartsDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  /* ================= MONTH OPTIONS ================= */

  const getLast6Months = () => {
    const months = [];
    const current = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(
        current.getFullYear(),
        current.getMonth() - i,
        1
      );

      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const label = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      months.push({ value, label });
    }

    return months;
  };

  const monthOptions = getLast6Months();

  const [selectedMonth, setSelectedMonth] = useState(
    monthOptions.length > 0 ? monthOptions[0].value : ""
  );

  const [planningData, setPlanningData] = useState([]);
  
  const [insights, setInsights] = useState(null);
  const [investmentSummary, setInvestmentSummary] = useState(null);
  useEffect(() => {
  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/financial-insights?month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setInsights(data);

    } catch (error) {
      console.error("Error fetching financial insights:", error);
    }
  };

  if (selectedMonth) {
    fetchInsights();
  }

}, [selectedMonth]);

useEffect(() => {
  const fetchPlanning = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/budget-planning?month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setPlanningData(data);

    } catch (error) {
      console.error("Error fetching budget planning:", error);
    }
  };

  if (selectedMonth) {
    fetchPlanning();
  }

}, [selectedMonth]);

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const formattedTrend =
  insights?.monthlyTrend?.map(item => ({
    month: monthNames[item.month - 1],
    amount: item.amount
  })) || [];

  useEffect(() => {
  const fetchInvestmentSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/investments/summary-last-6-months`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setInvestmentSummary(data);

    } catch (error) {
      console.error("Error fetching investment summary:", error);
    }
  };

  fetchInvestmentSummary();
}, []);
  /* ================= UI ================= */

  return (
    <div className="app-bg">
      <div className="budget-header">
  <div className="budget-title">
    Financial Insights · Views
  </div>

  <div className="header-pill-group">

    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="header-pill"
    >
      {monthOptions.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>

    <button
      className="header-pill"
      onClick={() => navigate("/personal-budget")}
    >
      Home
    </button>

    <button
      className="header-pill logout"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>
</div>

      <div className="charts-glass-wrapper">
        <div className="charts-grid-compact">

  <div className="chart-card small">
    <div className="chart-header-centered">
      Monthly Expenses Trend
    </div>
    <MonthlyExpenseTrend data={formattedTrend} />
  </div>

  <div className="chart-card small">
    <div className="chart-header-centered">
      Expenses by Category
    </div>
    <ExpenseCategoryDonut data={insights?.categorySplit || []} />
  </div>

  <div className="chart-card small">
    <div className="chart-header-centered">
      Investment Allocation (Last 6 Months)
    </div>
    <InvestmentOverviewDonut
  data={investmentSummary?.categories || []}
  total={investmentSummary?.total || 0}
/>
  </div>

  <div className="chart-card small">
    <div className="chart-header-centered">
      Budget vs Actual
    </div>
    <GroupBudgetVsActual data={planningData} />
  </div>

  <div className="chart-card small">
    <div className="chart-header-centered">
      Paid By
    </div>
    <PaidByPie data={insights?.paidBy || []} />
  </div>

  <div className="chart-card small">
    <div className="chart-header-centered">
      Top Categories
    </div>
    <TopCategories data={insights?.topCategories || []} />
  </div>

</div>
      </div>
    </div>
  );
}
