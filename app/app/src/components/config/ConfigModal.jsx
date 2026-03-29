import React from "react";
import IncomeReceiverConfig from "./IncomeReceiverConfig";
import ExpensePaidConfig from "./ExpensePaidConfig";
import CategorySplitConfig from "./CategorySplitConfig";
import "../../styles/configModal.css";


export default function ConfigModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* Header */}
        <div className="modal-header">
          <h2>⚙️ Configuration</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Body */}
        <div className="config-grid">
          <IncomeReceiverConfig />
          <ExpensePaidConfig />
          <CategorySplitConfig />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary">Save</button>
        </div>

      </div>
    </div>
  );
}
