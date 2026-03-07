import { useState } from "react";
import AddIncomeReceiverModal from "./AddIncomeReceiverModal";

export default function IncomeReceiverConfig() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="config-card">
      <h3>💰 Income Receiver</h3>
      <p>Manage sources receiving income</p>

      <button
        className="btn-outline"
        onClick={() => setShowAddModal(true)}
      >
        ➕ Add Receiver
      </button>

      <div className="empty-state">
        No income receivers added yet
      </div>

      {showAddModal && (
        <AddIncomeReceiverModal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
