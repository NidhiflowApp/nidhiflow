import React, { useState } from "react";
import "../../styles/mobileIncomeExpense.css";

function MobileIncomeExpenseDetails({ transactions = [], onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    const newSelected = selectedId === id ? null : id;
    setSelectedId(newSelected);

    if (onSelect) {
      onSelect(newSelected);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="mobile-transaction-wrapper">

      {transactions.length === 0 ? (
        <div className="mobile-empty">
          No transactions available
        </div>
      ) : (
        <div className="mobile-transaction-list">

          {transactions.map((item) => {
            const id = item._id || item.id;

            const amountClass =
              item.type === "Income"
                ? "mobile-amount income"
                : item.type === "Expense"
                ? "mobile-amount expense"
                : "mobile-amount investment";

            return (
              <div
                key={id}
                className={`mobile-transaction-card ${
                  selectedId === id ? "selected-row" : ""
                }`}
              >
                <div className="transaction-row">

                  {/* Checkbox */}
                  <div className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedId === id}
                      onChange={() => handleSelect(id)}
                    />
                  </div>

                  {/* Content */}
                  <div className="content-col">

                    {/* Line 1 */}
                    <div className="tx-line1">
                      {formatDate(item.date)} -{" "}
                      <strong>{item.description}</strong> • {item.type}
                    </div>

                    {/* Line 2 */}
                    <div className="tx-line2">
                      {item.category} • {item.paidBy} •{" "}
                      {item.paymentMode || "Not Saved"}
                    </div>

                  </div>

                  {/* Amount */}
                  <div className={amountClass}>
                    ₹ {Number(item.amount || 0).toLocaleString()}
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default MobileIncomeExpenseDetails;