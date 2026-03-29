import React, { useState } from "react";
import "../../styles/mobileDashboard.css";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

import MobileAddIncomeModal from "../budget/MobileAddIncomeModal";
import AddExpenseModal from "../budget/AddExpenseModal";
import "../../styles/mobileIncomeExpense.css";
import MobileIncomeExpenseDetails from "./MobileIncomeExpenseDetails";
import "../../styles/mobilePageScroll.css";



function MobileDashboard({
  dashboardData,
  monthlyReport,
  planningConfig,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  last6Months,
  onAddIncome,
  onAddExpense,
  onDelete
}) {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [showModal, setShowModal] = useState(false);
  const [entryType, setEntryType] = useState("income");

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const openAddEntry = (type) => {
    setEntryType(type);
    setShowModal(true);
  };
  /* ======================================== */

  if (!monthlyReport) {
    return <div>Loading...</div>;
  }

  const income = monthlyReport.summary.totalIncome || 0;
  const expense = monthlyReport.summary.totalExpense || 0;
  const investment = monthlyReport.summary.totalInvestment || 0;
  const netSavings = monthlyReport.summary.netSavings || 0;

  /* ===== Year Cycle Logic ===== */
  const handleYearChange = () => {
    const years = [...new Set(last6Months.map(m => m.year))];
    const currentIndex = years.indexOf(selectedYear);
    const nextYear = years[(currentIndex + 1) % years.length];
    setSelectedYear(nextYear);
  };

  /* ===== Month Cycle Logic ===== */
  const handleMonthChange = () => {
    const months = last6Months.filter(m => m.year === selectedYear);
    const currentIndex = months.findIndex(m => m.month === selectedMonth);
    const nextMonth = months[(currentIndex + 1) % months.length];
    setSelectedMonth(nextMonth.month);
  };

  const currentMonthLabel =
    last6Months.find(
      m => m.year === selectedYear && m.month === selectedMonth
    )?.label?.substring(0, 3);

  /* ===== CATEGORY SPLIT ===== */
  const pct = val => (income ? Math.round((val / income) * 100) : 0);

  const categorySplit = [
    {
      label: "Fixed Expenses",
      planned: 45,
      actual: pct(expense),
      dot: "expense",
      actualClass: pct(expense) > 45 ? "negative" : "positive"
    },
    {
      label: "Variable Expenses",
      planned: 25,
      actual: pct(expense),
      dot: "expense",
      actualClass: pct(expense) > 25 ? "negative" : "positive"
    },
    {
      label: "Emergency Fund",
      planned: 10,
      actual: 8,
      dot: "emergency",
      actualClass: 8 > 10 ? "negative" : "positive"
    },
    {
      label: "Investments",
      planned: 15,
      actual: pct(investment),
      dot: "investment",
      actualClass: pct(investment) > 15 ? "negative" : "positive"
    },
    {
      label: "Wants / Buffer",
      planned: 5,
      actual: 12,
      dot: "buffer",
      actualClass: 12 > 5 ? "negative" : "positive"
    }
  ];

  return (
    <div className="mobile-dashboard">

      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Dashboard - Personal Budget
        </h2>

        <div className="header-actions">
          <button className="glass-btn active" onClick={() => window.location.reload()}>
            <span className="mobile-icon">🏠</span>
          </button>

          <button className="glass-btn" onClick={handleYearChange}>
            {selectedYear}
          </button>

          <button className="glass-btn" onClick={handleMonthChange}>
            {currentMonthLabel}
          </button>

          <button className="glass-btn" onClick={() => navigate("/financial-insights")}>
            <span className="mobile-icon">⚙️</span>
          </button>

          <button className="glass-btn income" onClick={() => openAddEntry("income")}>
            <span className="mobile-icon">💰</span>
          </button>

          <button className="glass-btn expense" onClick={() => openAddEntry("expense")}>
            <span className="mobile-icon">💳</span>
          </button>

          <button
            className="glass-btn"
            onClick={() => {
              authService.logout();
              navigate("/login");
            }}
          >
            <span className="mobile-icon">🚪</span>
          </button>
        </div>
      </div>

      {/* ===== KPI + CATEGORY SECTION ===== */}
      <div className="mobile-top-section">

        <div className="mobile-kpi-column">
          <div className="mobile-kpi-card">
            <p>Available</p>
            <h4>₹ {netSavings.toLocaleString()}</h4>
          </div>

          <div className="mobile-kpi-card">
            <p>Income</p>
            <h4 className="green">₹ {income.toLocaleString()}</h4>
          </div>

          <div className="mobile-kpi-card">
            <p>Expense</p>
            <h4 className="red">₹ {expense.toLocaleString()}</h4>
          </div>

          <div className="mobile-kpi-card">
            <p>Surplus</p>
            <h4 className="green">₹ {netSavings.toLocaleString()}</h4>
          </div>

          <div className="mobile-kpi-card">
            <p>Invest</p>
            <h4 className="blue">₹ {investment.toLocaleString()}</h4>
          </div>
        </div>

        <div className="mobile-category-column">
          <div className="table-card category-card">
            <h3 className="category-title">Category Split</h3>

            <div className="category-header-row">
              <span></span>
              <span>Planned %</span>
              <span>Actual %</span>
            </div>

            {categorySplit.map(item => (
              <div key={item.label} className="category-row">
                <span className="category-name">
                  <span className={`dot ${item.dot}`} />
                  {item.label}
                </span>

                <span className="category-plan">{item.planned}%</span>
                <span className={`category-actual ${item.actualClass}`}>
                  {item.actual}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== INCOME & EXPENSE GLASS BOX ===== */}
<div className="mobile-income-container">

  {/* Header inside glass */}
  <div className="mobile-income-header">
    <h3 className="section-title">
  Income & Expense Details
</h3>

    <div className="mobile-income-icons">
      <button onClick={() => navigate("/financial-insights")}>📈</button>

      <button
        disabled={!selectedTransactionId}
        onClick={() => {
          if (selectedTransactionId) {
            openAddEntry("income"); // You can modify for edit logic
          }
        }}
      >
        ✏️
      </button>

      <button
        disabled={!selectedTransactionId}
        onClick={() => {
          if (selectedTransactionId && onDelete) {
            onDelete(selectedTransactionId);
          }
        }}
      >
        🗑️
      </button>
    </div>
  </div>

  {/* Scrollable Entries */}
  <MobileIncomeExpenseDetails
    transactions={dashboardData?.transactions || []}
    onSelect={setSelectedTransactionId}
  />

</div>

      {/* ===== MODAL ===== */}
      {/* ===== MODAL ===== */}
{showModal && entryType === "income" && (
  <MobileAddIncomeModal
    onClose={() => setShowModal(false)}
    editData={null}
    onSave={() => window.location.reload()}
  />
)}

{showModal && entryType === "expense" && (
  <AddExpenseModal
    onClose={() => setShowModal(false)}
    onSave={() => window.location.reload()}
  />
)}

    </div>
  );
}

export default MobileDashboard;