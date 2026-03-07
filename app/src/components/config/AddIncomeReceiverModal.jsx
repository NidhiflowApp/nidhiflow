import { useState } from "react";
import "../../styles/addIncomeReceiverModal.css";

export default function AddIncomeReceiverModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Primary");
  const [active, setActive] = useState(true);

  const handleSave = () => {
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      type,
      active,
      isDefault: false
    };

    onSave(payload);
    onClose();
  };

  return (
     <div
    className="modal-overlay"
    onClick={onClose}
  >
    <div
      className="modal-container small"
      onClick={(e) => e.stopPropagation()}
    >

        <div className="modal-header">
          <h3>Add Income Receiver</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">

          <label>Receiver Name</label>
          <input
            type="text"
            placeholder="Salary / Freelance / Business"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Receiver Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
          </select>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={active}
              onChange={() => setActive(!active)}
            />
            Active
          </label>

        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
