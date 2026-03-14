import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/incomeExpenseDetails.css";

function IncomeExpenseDetails({
  transactions = [],
  selectedIds = [],
  handleSelect = () => {},
  onAddIncome,
  onAddExpense,
  onDelete
}) {
  const navigate = useNavigate();

  const getId = (item) => item._id || item.id;

  return (
    <div className="glass-card table-card full-width-table">
     <div className="table-header income-expense-header">

  <h3 className="section-title">
    Income & Expense Details
  </h3>

  {/* Insights Button */}
  <button
    className="insight-btn"
    onClick={() => navigate("/financial-insights")}
  >
    <span className="desktop-text">View Financial Insights</span>
    <span className="mobile-icon">📈</span>
  </button>

  {/* Edit & Delete */}
  <div className="table-actions income-expense-actions">

    <button
      className="action-btn edit-btn"
      disabled={selectedIds.length !== 1}
      style={{
        opacity: selectedIds.length !== 1 ? 0.5 : 1,
        cursor:
          selectedIds.length !== 1 ? "not-allowed" : "pointer"
      }}
      onClick={() => {
        const selectedItem = transactions.find(
          (item) => getId(item) === selectedIds[0]
        );

        if (!selectedItem) return;

        if (selectedItem.type?.toLowerCase() === "income") {
          onAddIncome(selectedItem);
        } else {
          onAddExpense(selectedItem);
        }
      }}
    >
      <span className="desktop-text">Edit</span>
      <span className="mobile-icon">✏️</span>
    </button>

    <button
      className="action-btn delete-btn"
      disabled={selectedIds.length === 0}
      style={{
        opacity: selectedIds.length === 0 ? 0.5 : 1,
        cursor:
          selectedIds.length === 0
            ? "not-allowed"
            : "pointer"
      }}
      onClick={() => {
        if (!window.confirm("Are you sure you want to delete?"))
          return;

        onDelete(selectedIds);
      }}
    >
      <span className="desktop-text">Delete</span>
      <span className="mobile-icon">🗑️</span>
    </button>

  </div>
</div>

      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th></th>
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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No transactions available
                </td>
              </tr>
            ) : (
              [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => {
                const id = getId(item);

                return (
                  <tr key={id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => handleSelect(id)}
                      />
                    </td>

                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>

                    <td
                      className={
                        item.type === "Income" ? "green" : "red"
                      }
                    >
                      {item.type}
                    </td>

                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{item.paidBy}</td>

                    <td>
                      {item.paymentMode || "Not Saved"}
                    </td>

                    <td
                      className={
                        item.type === "Income" ? "green" : "red"
                      }
                    >
                      ₹ {Number(item.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IncomeExpenseDetails;