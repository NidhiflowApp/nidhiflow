import React, { useState, useEffect, useRef } from "react";
import "../../styles/addIncomeModal.css";
import { incomeMaster } from "../../data/incomeMaster";
import SpentOnDropdown from "../SpentOnDropdown";
import { getPersons } from "../../services/personService";
import ManagePersonsModal from "./ManagePersonsModal";

/* ===============================
   DEFAULT PAYMENT MODES
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

export default function AddIncomeModal({
  onClose,
  onSave,
  editData = null,
  receivedByOptions = ["Self"],
  
})
 {
  const today = new Date().toISOString().split("T")[0];
  const receivedFromRef = useRef(null);

  /* ===============================
     STATE
  =============================== */
 

  const paymentModes = DEFAULT_PAYMENT_MODES;
  const [persons, setPersons] = useState([]);
  const [showManage, setShowManage] = useState(false);
  useEffect(() => {
  const fetchPersons = async () => {
    const data = await getPersons();
    console.log("Persons loaded:", data); // 👈 add this line
    setPersons(data);
  };

  fetchPersons();
}, []);


 const [form, setForm] = useState({
  date: editData?.date?.split("T")[0] || today,
  receivedFrom: editData?.description || "",
  category: editData?.category || "Income",
  receivedBy: editData?.paidBy || "",
  paymentMode: editData?.paymentMode || "UPI",
  amount: editData?.amount || ""
});


  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ===============================
     AUTOCOMPLETE
  =============================== */
  const handleReceivedFromChange = (value) => {
    update("receivedFrom", value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      update("category", "Income");
      return;
    }

    const filtered = incomeMaster.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
    setShowDropdown(true);
    setActiveIndex(0);
  };

  const selectSuggestion = (item) => {
    update("receivedFrom", item.label);
    update("category", item.category);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }

    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };


  
  /* ===============================
     SAVE
  =============================== */
  const handleSaveIncome = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter valid amount");
      return;
    }

    if (!form.receivedFrom.trim()) {
      alert("Please enter Received From");
      return;
    }

   onSave({
  id: editData?._id, // important for update
  type: "Income",
  date: form.date,
  description: form.receivedFrom,
  category: form.category,
  paidBy: form.receivedBy,
  paymentMode: form.paymentMode,
  amount: Number(form.amount)
});

    onClose();
  };

  /* ===============================
     UI
  =============================== */
  return (
  <>
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{editData ? "Edit Income" : "Add Income"}</h3>

        <div className="modal-body">

          {/* DATE + AMOUNT */}
          <div className="row two">
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  update("date", e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  update("amount", e.target.value)
                }
              />
            </div>
          </div>

          {/* RECEIVED FROM */}
          <div className="field">
            <label>Received From</label>
            <input
              ref={receivedFromRef}
              type="text"
              value={form.receivedFrom}
              onChange={(e) =>
                handleReceivedFromChange(e.target.value)
              }
              onKeyDown={handleKeyDown}
              onFocus={() =>
                form.receivedFrom && setShowDropdown(true)
              }
            />
          </div>

          {/* CATEGORY */}
          <div className="field">
            <label>Category</label>
            <input value={form.category} disabled />
          </div>

          {/* RECEIVED BY + PAYMENT MODE SIDE BY SIDE */}
<div className="row two">

  {/* RECEIVED BY */}
  <div className="field">
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      Received By
      <span
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "18px"
        }}
        onClick={() => setShowManage(true)}
      >
        +
      </span>
    </label>

    <select
      value={form.receivedBy}
      onChange={(e) => update("receivedBy", e.target.value)}
    >
      <option value="">Select Person</option>
      {persons.map((person) => (
        <option key={person._id} value={person.name}>
          {person.name}
        </option>
      ))}
    </select>
  </div>

  {/* PAYMENT MODE */}
  <div className="field">
  <label>Payment Mode</label>

  <select
    value={form.paymentMode}
    onChange={(e) =>
      update("paymentMode", e.target.value)
    }
  >
    {paymentModes.map((mode) => (
      <option key={mode} value={mode}>
        {mode}
      </option>
    ))}
  </select>
</div>

</div>

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button
            className="btn ghost"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={handleSaveIncome}
          >
            {editData ? "Update Income" : "Save Income"}
          </button>
        </div>

      </div>
    </div>

    {/* AUTOCOMPLETE */}
    {showDropdown && suggestions.length > 0 && (
      <SpentOnDropdown
        anchorRef={receivedFromRef}
        items={suggestions}
        activeIndex={activeIndex}
        onSelect={selectSuggestion}
      />
    )}
{showManage && (
  <ManagePersonsModal
    onClose={async () => {
      setShowManage(false);
      const data = await getPersons();
      setPersons(data);
    }}
  />
)}
    </>
);


}
