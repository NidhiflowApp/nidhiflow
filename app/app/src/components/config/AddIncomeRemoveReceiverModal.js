import React from "react";
import "../../styles/addIncomeReceiverModal.css";

export default function RemoveIncomeReceiverModal({
  receivers,
  onClose,
  onRemove
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Remove Receiver</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="modal-body">
          {receivers.length === 0 && <p>No receivers to remove</p>}

          {receivers.map((name) => (
            <div key={name} className="remove-row">
              <span>{name}</span>
              <button
                className="mini-remove"
                onClick={() => onRemove(name)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
