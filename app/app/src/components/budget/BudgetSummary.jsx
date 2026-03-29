import { useState } from "react";
import ConfigurationModal from "./ConfigurationModal";

const BudgetSummary = ({ transactions }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <h3>Monthly Summary</h3>
      <p>Income: ₹ {income}</p>
      <p>Expenses: ₹ {expense}</p>
      <p>Balance: ₹ {income - expense}</p>

      {/* CONFIGURATION BUTTON */}
      <button
        className="btn"
        style={{ marginTop: "12px" }}
        onClick={() => setIsConfigOpen(true)}
      >
        Configuration
      </button>

      {/* CONFIGURATION MODAL */}
      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
};

export default BudgetSummary;
