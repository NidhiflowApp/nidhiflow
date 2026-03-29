import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/personalBudget.css";
import AddExpenseModal from "../components/budget/AddExpenseModal";
import AddIncomeModal from "../components/budget/AddIncomeModal";
import ConfigurationModal from "../components/budget/ConfigurationModal";
import apiClient from "../services/apiClient";
import BudgetLayout from "../layouts/BudgetLayout";

/* -------- Animated Number Hook -------- */
function useAnimatedNumber(value, duration = 600) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

export default function PersonalBudget({ enableActions = false }) {
  
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  /* -------- Date Setup -------- */
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  /* -------- Modals -------- */
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);

  /* -------- Configuration -------- */
  const [config, setConfig] = useState(null);


  /* -------- Stop Animation After 20s -------- */
  const [stopCategoryAnimation, setStopCategoryAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStopCategoryAnimation(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  /* -------- Transactions -------- */
  const [transactions, setTransactions] = useState([]);
  /* -------- Selection Logic (For Edit/Delete) -------- */
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };


  const fetchDashboard = useCallback(async () => {
    try {
      

      const res = await apiClient.get(
  `/dashboard?year=${year}&month=${month + 1}`
);

      setTransactions(res.data.transactions || []);
      setPreviousClosing(res.data.previousClosing || 0);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, [year, month]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);



  /* -------- Add Handlers -------- */
  const handleAddIncome = async (income) => {
    try {
      
      await apiClient.post("/income", income);

      fetchDashboard();

    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  /* -------- Add Expense -------- */
const handleAddExpense = async (expense) => {
  try {
    await apiClient.post("/expense", expense);
    fetchDashboard();
  } catch (error) {
    console.error("Error saving expense:", error);
  }
};
/* -------- FETCH CONFIG -------- */
  const fetchConfig = async () => {
  try {
    

    const res = await apiClient.get("/config");

    setConfig(res.data);
  } catch (error) {
    console.error("Config fetch error:", error);
  }
};
useEffect(() => {
  fetchConfig();
}, []);

  /* -------- KPI Logic -------- */
  const [previousClosing, setPreviousClosing] = useState(0);


  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0);

  const investment = transactions
    .filter(t => t.type === "Investment")
    .reduce((s, t) => s + t.amount, 0);

  const variation = income - expense;
  const availableFund = previousClosing + income - expense - investment;

  /* -------- Animated Values -------- */
  const aAvailable = useAnimatedNumber(availableFund);
  const aIncome = useAnimatedNumber(income);
  const aExpense = useAnimatedNumber(expense);
  const aVariation = useAnimatedNumber(variation);
  const aInvestment = useAnimatedNumber(investment);

  /* -------- Category Split -------- */
 const safePct = (val) =>
  income ? Math.round((val / income) * 100) : 0;

const categorySplit = [
  {
    label: "Fixed Expenses",
    planned: 45,
    actual: safePct(
      transactions
        .filter(t => t.nature === "fixed")
        .reduce((s, t) => s + t.amount, 0)
    ),
    dot: "expense",
    actualClass:
      safePct(
        transactions
          .filter(t => t.nature === "fixed")
          .reduce((s, t) => s + t.amount, 0)
      ) > 45
        ? "negative"
        : "positive"
  },
  {
    label: "Variable Expenses",
    planned: 25,
    actual: safePct(
      transactions
        .filter(t => !t.nature || t.nature === "variable")
        .reduce((s, t) => s + t.amount, 0)
    ),
    dot: "expense",
    actualClass:
      safePct(
        transactions
          .filter(t => !t.nature || t.nature === "variable")
          .reduce((s, t) => s + t.amount, 0)
      ) > 25
        ? "negative"
        : "positive"
  },
  {
    label: "Emergency Fund",
    planned: 10,
    actual: safePct(
      transactions
        .filter(t => t.nature === "emergency")
        .reduce((s, t) => s + t.amount, 0)
    ),
    dot: "emergency",
    actualClass:
      safePct(
        transactions
          .filter(t => t.nature === "emergency")
          .reduce((s, t) => s + t.amount, 0)
      ) > 10
        ? "negative"
        : "positive"
  },
  {
    label: "Investments",
    planned: 10,
    actual: safePct(
      transactions
        .filter(t => t.nature === "investment")
        .reduce((s, t) => s + t.amount, 0)
    ),
    dot: "investment",
    actualClass:
      safePct(
        transactions
          .filter(t => t.nature === "investment")
          .reduce((s, t) => s + t.amount, 0)
      ) > 10
        ? "negative"
        : "positive"
  }
];

  /* -------- Date Formatter -------- */
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

return (
  <BudgetLayout
    header={
      <div className="budget-header">
        <div className="budget-title">
  Hi {userName} 👋 · Dashboard · Personal Budget
</div>
<div className="budget-subtitle">
  Personal Budget Dashboard
</div>
        <div className="budget-actions">

          <button
            className="budget-control home"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <select
            className="budget-control"
            value={year}
            onChange={e => setYear(+e.target.value)}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            className="budget-control"
            value={month}
            onChange={e => setMonth(+e.target.value)}
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <button
            className="budget-control config"
            onClick={() => setShowConfiguration(true)}
          >
            Configuration
          </button>

          <button
            className="budget-control income"
            onClick={() => setShowAddIncome(true)}
          >
            + Income
          </button>

          <button
  type="button"
  className="budget-control expense"
  onClick={() => setShowAddExpense(true)}
>
  + Expense
</button>

          <button
            className="budget-control logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>
      </div>
    }
  >


      {/* MAIN GRID */}
      <div className="budget-main-grid">

        {/* LEFT */}
        <div className="left-layout">

          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-label">Available Fund</div>
              <div className="kpi-value">₹ {aAvailable}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Income</div>
              <div className="kpi-value income">₹ {aIncome}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Expenses</div>
              <div className="kpi-value expense">₹ {aExpense}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Variation</div>
              <div className={`kpi-value ${variation >= 0 ? "positive" : "negative"}`}>
                ₹ {aVariation}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Investment</div>
              <div className="kpi-value investment">₹ {aInvestment}</div>
            </div>
          </div>

            <div className="table-card">

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}
              >
                <h3 style={{ margin: 0 }}>Income & Expense Details</h3>

                {enableActions && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="budget-control income"
                      disabled={selectedIds.length !== 1}
                      style={{ opacity: selectedIds.length !== 1 ? 0.5 : 1 }}
                    >
                      Edit
                    </button>

                    <button
                      className="budget-control expense"
                      disabled={selectedIds.length === 0}
                      style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                <table className="budget-table">
                  <thead>
                    <tr>
                      {enableActions && <th></th>}
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Paid By</th>
                      <th>Payment Mode</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t._id}>
                        {enableActions && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(t._id)}
                              onChange={() => handleSelect(t._id)}
                            />
                          </td>
                        )}
                        <td>{formatDate(t.date)}</td>
                        <td className={t.type.toLowerCase()}>{t.type}</td>
                        <td>{t.description}</td>
                        <td>{t.category}</td>
                        <td>{t.paidBy}</td>
                        <td>{t.paymentMode}</td>
                        <td className={t.type.toLowerCase()}>{t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>


          </div>

          {/* RIGHT */}
          <div className="right-panel">

            <div className="table-card category-card">
              <h3 className="category-title">Category Split</h3>

              <div className="category-header-row">
                <span>Category</span>
                <span>Planned %</span>
                <span>Actual %</span>
              </div>

              {categorySplit.map(item => (
                <div
                  key={item.label}
                  className={`category-row ${item.actualClass === "negative" && !stopCategoryAnimation
                    ? "over-limit-animate"
                    : ""
                    }`}
                >
                  <span className="category-name">
                    <span className={`dot ${item.dot}`} />
                    {item.label}
                  </span>

                  <span className="category-plan">
                    {item.planned}%
                  </span>

                  <span className={`category-actual ${item.actualClass}`}>
                    {item.actual}%
                  </span>
                </div>
              ))}
            </div>

            <div
              className="charts-nav-card"
              style={{
                marginTop: "16px",
                padding: "22px 20px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.05))",
                border: "1px solid rgba(34,197,94,0.35)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                cursor: "pointer",
                textAlign: "center"
              }}
              onClick={() => navigate("/dashboard/charts")}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80" }}>
                📊 View Financial Charts
              </div>

              <div style={{ marginTop: "8px", fontSize: "13px", color: "#d1fae5" }}>
                Expenses · Income · Investments · Trends
              </div>
            </div>

          </div>
        </div>

        {/* MODALS */}
        {showAddIncome && (
  <AddIncomeModal
    onClose={() => setShowAddIncome(false)}
    onSave={handleAddIncome}
    receivedByOptions={config?.incomeReceivedBy || ["Self"]}
  />
)}
        {showAddExpense && (
  <AddExpenseModal
    onClose={() => setShowAddExpense(false)}
    onSave={handleAddExpense}
  />
)}


        {
          showConfiguration && (
            <ConfigurationModal
              onClose={() => setShowConfiguration(false)}
              config={config}
              onSave={setConfig}
            />
          )
        }
      </BudgetLayout >
      );

      


}
