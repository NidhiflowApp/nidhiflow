import "../styles/dashboard.css";
import React, { useEffect, useState } from "react";
import ConfigurationModal from "../components/budget/ConfigurationModal";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import IncomeExpenseDetails from "../components/budget/IncomeExpenseDetails";



function AnimatedNumber({ value, className }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(0);
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <h3 className={className}>₹ {count.toLocaleString()}</h3>;
}

function PersonalBudgetDashboard({
  dashboardData,
  monthlyReport,   // 👈 ADD THIS
  planningConfig,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  last6Months,
  onAddIncome,
  onAddExpense,
  onDelete,
  setPlanningConfig
}) {
    const navigate = useNavigate();   // 👈 ADD THIS BACK
    const [selectedIds, setSelectedIds] = useState([]);
    const [showConfigModal, setShowConfigModal] = useState(false);

   useEffect(() => {
  const monthsForYear = last6Months.filter(
    (m) => m.year === selectedYear
  );

  const monthStillValid = monthsForYear.some(
    (m) => m.month === selectedMonth
  );

  if (!monthStillValid && monthsForYear.length > 0) {
    setSelectedMonth(monthsForYear[0].month);
  }
}, [selectedYear, selectedMonth, last6Months, setSelectedMonth]);

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // Blink control (30 seconds)
    const [blinkActive, setBlinkActive] = useState(true);

    useEffect(() => {
  const timer = setTimeout(() => {
    setBlinkActive(false);
  }, 30000);
  return () => clearTimeout(timer);
}, []);

// ✅ PUT SAFE GUARD HERE (AFTER ALL HOOKS)
if (!monthlyReport) {
  return <div>Loading Report...</div>;
}

  const GOLDEN = {
  fixedPercent: 50,
  variablePercent: 20,
  emergencyPercent: 10,
  investmentPercent: 10,
  wantsPercent: 10
};

const planned =
  planningConfig?.planningMode === "custom"
    ? planningConfig
    : GOLDEN;

const income = monthlyReport.summary.totalIncome || 0;
const expense = monthlyReport.summary.totalExpense || 0;
const investment = monthlyReport.summary.totalInvestment || 0;
const netSavings = monthlyReport.summary.netSavings || 0;

const pct = (val) => (income ? Math.round((val / income) * 100) : 0);

// // 👉 Split expense into Fixed & Variable
// let fixedExpense = 0;
// let variableExpense = 0;

// (dashboardData?.transactions || []).forEach((t) => {
//   if (t.type === "Expense") {
//     // 👉 CHANGE THIS BASED ON YOUR CATEGORY
//     const fixedCategories = ["Bills", "Loan/EMI", "Fixed Expense"];

// if (fixedCategories.includes(t.category)) {
//       fixedExpense += t.amount;
//     } else {
//       variableExpense += t.amount;
//     }
//   }
// });

const fixedCategories = ["Bills", "Loan/EMI", "Fixed Expense"];

let fixedExpense = 0;
let variableExpense = 0;

(dashboardData?.transactions || []).forEach((t) => {
  if (t.type === "Expense") {
    if (fixedCategories.includes(t.category)) {
      fixedExpense += t.amount;
    } else {
      variableExpense += t.amount;
    }
  }
});

let emergencyTotal = 0;
let wantsTotal = 0;

(dashboardData?.transactions || []).forEach((t) => {
  if (t.type === "Expense") {
    const name = (t.description || "").toLowerCase();
    const category = (t.category || "").toLowerCase();

    if (
      category.includes("health") ||
      name.includes("hospital") ||
      name.includes("doctor")
    ) {
      emergencyTotal += t.amount;
    }

    if (
      category.includes("shopping") ||
      category.includes("entertainment")
    ) {
      wantsTotal += t.amount;
    }
  }
});

const categories = [
  {
    name: "Fixed Expenses",
    planned: planned.fixedPercent,
    actual: pct(fixedExpense),
    dot: "red-dot"
  },
  {
    name: "Variable Expenses",
    planned: planned.variablePercent,
    actual: pct(variableExpense),
    dot: "orange-dot"
  },
  {
    name: "Emergency Fund",
    planned: planned.emergencyPercent,
    actual: pct(emergencyTotal),
    dot: "blue-dot"
  },
  {
    name: "Investments",
    planned: planned.investmentPercent,
    actual: pct(investment),
    dot: "purple-dot"
  },
  {
    name: "Wants / Buffer",
    planned: planned.wantsPercent,
    actual: pct(wantsTotal),
    dot: "pink-dot"
  }
];

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">

                {/* HEADER */}
                <div className="dashboard-header">
                    <h2 className="dashboard-title">
                        Dashboard - Personal Budget
                    </h2>

                    <div className="header-actions">
                        <button
  className="glass-btn active"
  onClick={() => window.location.reload()}
>
  <span className="desktop-text">Home</span>
  <span className="mobile-icon">🏠</span>
</button>
                        <select
  className="dropdown"
  value={selectedYear}
  onChange={(e) => setSelectedYear(Number(e.target.value))}
>
  {[...new Set(last6Months.map(m => m.year))].map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
                        <select
  className="dropdown"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(Number(e.target.value))}
>
  {last6Months
    .filter(m => m.year === selectedYear)
    .map((m) => (
      <option key={m.month} value={m.month}>
        {m.label.substring(0, 3)}
      </option>
    ))}
</select>
                        <button
  className="glass-btn"
  onClick={() => setShowConfigModal(true)}
>
  <span className="desktop-text">Configuration</span>
  <span className="mobile-icon">⚙️</span>
</button>
                        <button className="glass-btn income" onClick={onAddIncome}>
  <span className="desktop-text">+ Income</span>
  <span className="mobile-icon">💰</span>
</button>
                        <button
  className="glass-btn expense"
  onClick={onAddExpense}
>
  <span className="desktop-text">+ Expense</span>
  <span className="mobile-icon">💳</span>
</button>

                        <button
  className="glass-btn"
  onClick={() => {
    authService.logout();
    navigate("/login");
  }}
>
  <span className="desktop-text">Logout</span>
  <span className="mobile-icon">🚪</span>
</button>
                    </div>
                </div>

                {/* DASHBOARD LAYOUT */}
                <div className="dashboard-layout">




{/* LEFT SIDE */}
<div className="left-panel">

    {/* KPI LEFT */}
    <div className="kpi-left">
        <div className="kpi-card">
            <p>Available Fund</p>
            <AnimatedNumber value={netSavings} />
        </div>

        <div className="kpi-card">
            <p>Income</p>
            <AnimatedNumber value={income} className="green" />
        </div>

        <div className="kpi-card">
            <p>Expenses</p>
            <AnimatedNumber value={expense} className="red" />
        </div>
    </div>

    {/* NEW COMPONENT */}
    <IncomeExpenseDetails
        transactions={dashboardData?.transactions}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        onAddIncome={onAddIncome}
        onAddExpense={onAddExpense}
        onDelete={onDelete}
    />

</div>



                    {/* RIGHT SIDE */}
                    <div className="right-panel">

                        {/* KPI RIGHT */}
                        <div className="kpi-right">
                            <div className="kpi-card">
                                <p>Cash Surplus</p>
                                <AnimatedNumber value={netSavings} className="green" />
                            </div>

                            <div className="kpi-card">
                                <p>Investment</p>
                                <AnimatedNumber value={investment} className="blue" />
                            </div>
                        </div>

                        {/* CATEGORY SPLIT */}
                        <div className="glass-card category-card">
                            <h3>Category Split</h3>

                            <div className="category-header">
                                <span>Category</span>
                                <span>Planned %</span>
                                <span>Actual %</span>
                            </div>

                            {categories.map((item, index) => {
                                const isExceeded = item.actual > item.planned;

                                return (
                                    <div
                                        key={index}
                                        className={`category-row ${isExceeded && blinkActive ? "blink-row" : ""
                                            }`}
                                    >
                                        <div className="category-name">
                                            <span className={`dot ${item.dot}`}></span>
                                            {item.name}
                                        </div>

                                        <span>{item.planned}%</span>

                                        <span className={isExceeded ? "red" : "green"}>
                                            {item.actual}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
                        {showConfigModal && (
  <ConfigurationModal
    onClose={() => setShowConfigModal(false)}
    config={planningConfig}
    onSave={setPlanningConfig}
  />
)}
        </div>
        
    );
}

export default PersonalBudgetDashboard;
