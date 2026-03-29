import { useState, useEffect } from "react";
import PersonalBudgetDashboard from "./PersonalBudgetDashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import AddIncomeModal from "../components/budget/AddIncomeModal";
import { addIncome, updateIncome, deleteIncome } from "../services/incomeService";
import AddExpenseModal from "../components/budget/AddExpenseModal";
import { addExpense, updateExpense, deleteExpense } from "../services/expenseService";
import { getPlanningConfig, savePlanningConfig } from "../services/planningConfigService";
import useLastSixMonths from "../hooks/useLastSixMonths";
import { generateMonthlyReport } from "../services/reportService";
import MobileDashboard from "../components/dashboard/MobileDashboard";


function DashboardContainer() {
  const last6Months = useLastSixMonths();

  const [selectedYear, setSelectedYear] = useState(last6Months[0].year);
  const [selectedMonth, setSelectedMonth] = useState(last6Months[0].month);

  const { data, loading, refetch } = useDashboardData(selectedYear, selectedMonth);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [planningConfig, setPlanningConfig] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  useEffect(() => {
  if (!data || !data.transactions) return;

  const incomes = data.transactions.filter(t => t.type === "Income");
  const expenses = data.transactions.filter(t => t.type === "Expense");
  const investments = data.transactions.filter(t => t.type === "Investment");

  const report = generateMonthlyReport(
    incomes,
    expenses,
    investments,
    selectedMonth,
    selectedYear
  );

  setMonthlyReport(report);

}, [data, selectedMonth, selectedYear]);
  

useEffect(() => {
  const fetchPlanning = async () => {
    try {
      const data = await getPlanningConfig();
      setPlanningConfig(data);
    } catch (error) {
      console.error("Failed to load planning config:", error);
    }
  };

  fetchPlanning();
}, []);
  const [editingData, setEditingData] = useState(null);

  /* =========================
     SAVE INCOME
  ========================== */
  const handleSaveIncome = async (incomeData) => {
    try {
      if (incomeData.id) {
        await updateIncome(incomeData.id, incomeData);
      } else {
        await addIncome(incomeData);
      }

      setShowIncomeModal(false);
      setEditingData(null);
      refetch();
    } catch (error) {
      console.error("Income save failed:", error);
    }
  };

  /* =========================
     SAVE EXPENSE
  ========================== */
  const handleSaveExpense = async (expenseData) => {
    try {
      if (expenseData.id) {
        await updateExpense(expenseData.id, expenseData);
      } else {
        await addExpense(expenseData);
      }

      setShowExpenseModal(false);
      setEditingData(null);
      refetch();
    } catch (error) {
      console.error("Expense save failed:", error);
    }
  };

  /* =========================
     DELETE (Income + Expense)
  ========================== */
  const handleDelete = async (ids) => {
    try {
      for (let id of ids) {
        const selectedItem = data.transactions.find(
          (item) => item._id === id || item.id === id
        );

        if (!selectedItem) continue;

        if (selectedItem.type === "Income") {
          await deleteIncome(id);
        } else {
          await deleteExpense(id);
        }
      }

      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  if (loading || !planningConfig) return <div>Loading...</div>;

  return (
    <>
      {isMobile ? (
  <MobileDashboard
    dashboardData={data}
    monthlyReport={monthlyReport}
    planningConfig={planningConfig}
    selectedYear={selectedYear}
    selectedMonth={selectedMonth}
    setSelectedYear={setSelectedYear}
    setSelectedMonth={setSelectedMonth}
    last6Months={last6Months}
    setPlanningConfig={async (newConfig) => {
      try {
        const updated = await savePlanningConfig(newConfig);
        setPlanningConfig(updated);
      } catch (error) {
        console.error("Failed to save planning config:", error);
      }
    }}
    onAddIncome={(editData) => {
      setEditingData(editData || null);
      setShowIncomeModal(true);
    }}
    onAddExpense={(editData) => {
      setEditingData(editData || null);
      setShowExpenseModal(true);
    }}
    onDelete={handleDelete}
  />
) : (
  <PersonalBudgetDashboard
    dashboardData={data}
    monthlyReport={monthlyReport}
    planningConfig={planningConfig}
    selectedYear={selectedYear}
    selectedMonth={selectedMonth}
    setSelectedYear={setSelectedYear}
    setSelectedMonth={setSelectedMonth}
    last6Months={last6Months}
    setPlanningConfig={async (newConfig) => {
      try {
        const updated = await savePlanningConfig(newConfig);
        setPlanningConfig(updated);
      } catch (error) {
        console.error("Failed to save planning config:", error);
      }
    }}
    onAddIncome={(editData) => {
      setEditingData(editData || null);
      setShowIncomeModal(true);
    }}
    onAddExpense={(editData) => {
      setEditingData(editData || null);
      setShowExpenseModal(true);
    }}
    onDelete={handleDelete}
  />
)}

      {showIncomeModal && (
        <AddIncomeModal
          onClose={() => {
            setShowIncomeModal(false);
            setEditingData(null);
          }}
          onSave={handleSaveIncome}
          editData={editingData}
        />
      )}

      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => {
            setShowExpenseModal(false);
            setEditingData(null);
          }}
          onSave={handleSaveExpense}
          editData={editingData}
        />
      )}
    </>
  );
}

export default DashboardContainer;