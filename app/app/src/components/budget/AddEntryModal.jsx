import React, { useState } from "react";
import "../../styles/mobileDashboard.css";
import budgetService from "../../services/budgetService";


function AddEntryModal({
  isOpen,
  onClose,
  entryType,
  selectedMonth,
  selectedYear,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!amount || !category) return;

    try {
      setLoading(true);

      await budgetService.addEntry({
        type: entryType,
        amount: Number(amount),
        category,
        note,
        month: selectedMonth,
        year: selectedYear,
      });

      setAmount("");
      setCategory("");
      setNote("");

      onSuccess(); // refresh dashboard
      onClose();
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-modal-overlay">
      <div className="mobile-modal">
        <h3>Add {entryType === "income" ? "Income" : "Expense"}</h3>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEntryModal;