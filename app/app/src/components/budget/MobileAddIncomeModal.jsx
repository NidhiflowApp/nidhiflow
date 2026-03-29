import React from "react";
import AddIncomeModal from "./AddIncomeModal";
import "../../styles/mobileAddIncomeModal.css";

function MobileAddIncomeModal({ onClose, editData, onSave }) {
  return (
    <div className="mobile-income-modal-wrapper">
      <AddIncomeModal
        onClose={onClose}
        editData={editData}
        onSave={onSave}
      />
    </div>
  );
}

export default MobileAddIncomeModal;