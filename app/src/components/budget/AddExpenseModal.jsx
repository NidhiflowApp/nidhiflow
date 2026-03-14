import React, { useState, useEffect, useRef } from "react";
import "../../styles/addExpenseModal.css";
import { expenseMaster } from "../../data/expenseMaster";
import { getPersons } from "../../services/personService";
import ManagePersonsModal from "./ManagePersonsModal";



/* ===============================
   DEFAULT VALUES (PROTECTED)
=============================== */
const DEFAULT_PAYMENT_MODES = [
  "UPI",
  "Cash",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Bank Transfer",
  "Cheque",
  "Wallet"
];
export default function AddExpenseModal({ onClose, onSave, editData = null }) {
  const today = new Date().toISOString().split("T")[0];
  const spentOnRef = useRef(null);

  /* ===============================
     STATE
  =============================== */

  const [form, setForm] = useState({
  date: editData?.date?.split("T")[0] || today,
  spentOn: editData?.description || "",
  category: editData?.category || "Auto",
  paidBy: editData?.paidBy || "",
  paymentMode: editData?.paymentMode || "UPI",
  amount: editData?.amount || ""
});
const [persons, setPersons] = useState([]);
const [showManage, setShowManage] = useState(false);
const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
  const fetchPersons = async () => {
    const data = await getPersons();
    setPersons(data);
  };

  fetchPersons();
}, []);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  

  /* =====================
     Spent On handlers
  ====================== */
const handleSpentOnChange = (value) => {
  update("spentOn", value);

  if (!value.trim()) {
    setSuggestions([]);
    return;
  }

  const filtered = expenseMaster.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  );

  setSuggestions(filtered);

  const match = expenseMaster.find(
    item => item.label.toLowerCase() === value.toLowerCase()
  );

  if (match) {
    update("category", match.category);
  }
};

  /* =====================
     Save Expense (BACKEND)
  ====================== */
  const handleSaveExpense = () => {
  if (!form.amount || Number(form.amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (!form.spentOn.trim()) {
    alert("Please enter Spent On");
    return;
  }

  onSave({
  id: editData?.id,
  description: form.spentOn,
  amount: Number(form.amount),
  category: form.category,
  paidBy: form.paidBy,
  paymentMode: form.paymentMode,
  date: form.date
});

  onClose();
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card add-expense-modal"
        onClick={e => e.stopPropagation()}
      >
        <h3>{editData ? "Edit Expense" : "Add Expense"}</h3>

        <div className="modal-body">
          <div className="row two">
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => update("date", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={e => update("amount", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
  <label>Spent On</label>

  <input
    ref={spentOnRef}
    type="text"
    value={form.spentOn}
    onChange={e => handleSpentOnChange(e.target.value)}
  />

  {suggestions.length > 0 && (
    <div>
      {suggestions.map((item, index) => (
        <div
          key={index}
          style={{ padding: "5px", cursor: "pointer" }}
          onClick={() => {
  update("spentOn", item.label);
  update("category", item.category);
  setSuggestions([]);
  spentOnRef.current.blur();
}}
        >
          {item.label}
        </div>
      ))}
    </div>
  )}
</div>

          <div className="field">
            <label>Category</label>
            <input value={form.category} disabled />
          </div>

          <div className="row two">
            <div className="field">
              <label
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  Paid By
  <span
  style={{
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px",
    color: "#4ade80"
  }}
  onClick={() => setShowManage(true)}
>
  +
</span>
</label>
              <select
  value={form.paidBy}
  onChange={e => update("paidBy", e.target.value)}
>
  <option value="">Select Person</option>

  {persons.map(person => (
    <option key={person._id} value={person.name}>
      {person.name}
    </option>
  ))}
</select>

            </div>

<div className="field">
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <label>Payment Mode</label>

    
  </div>

  <select
    value={form.paymentMode}
    onChange={e => update("paymentMode", e.target.value)}
  >
    {DEFAULT_PAYMENT_MODES.map(mode => (
      <option key={mode} value={mode}>
        {mode}
      </option>
    ))}
  </select>
</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>

          <button
  className="btn primary"
  onClick={handleSaveExpense}
>
  {editData ? "Update Expense" : "Save Expense"}
</button>

        </div>

        {showManage && (
  <ManagePersonsModal
    onClose={async () => {
      setShowManage(false);
      const data = await getPersons();
      setPersons(data);
    }}
  />
)}
      </div>
    </div>
  );
}
