import React, { useState, useEffect } from "react";
import { getPersons } from "../../services/personService";

export default function ManagePersonsModal({ onClose }) {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState("");
  const [error, setError] = useState("");

  // Fetch existing persons
  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    const data = await getPersons();
    setPersons(data);
  };

  // Add person (max 6)
  const handleAdd = async () => {
    if (!newPerson.trim()) return;

    if (persons.length >= 6) {
      setError("Maximum 6 persons allowed");
      return;
    }

    const response = await fetch("http://localhost:5000/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPerson })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Error adding person");
      return;
    }

    setNewPerson("");
    setError("");
    fetchPersons();
  };

  // Delete person
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/persons/${id}`, {
      method: "DELETE"
    });

    fetchPersons();
  };

  return (
  <div
  className="modal-overlay"
  onClick={onClose}
  
>
   <div
  className="modal-card add-expense-modal"
  onClick={(e) => e.stopPropagation()}
  style={{
  maxWidth: "420px",
  height: "auto",
  maxHeight: "85vh",
  display: "flex",
  flexDirection: "column"
}}
>
      <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
  Manage Persons (Max 6)
</h3>

      <div
  className="modal-body"
  style={{
    padding: "14px 18px",
    flex: 1,
    overflow: "hidden"
  }}
>
  <div
  style={{
    display: "flex",
    gap: "12px",
    alignItems: "stretch",
    marginBottom: "16px"
  }}
>
  <input
    type="text"
    placeholder="Enter Name"
    value={newPerson}
    onChange={(e) => setNewPerson(e.target.value)}
    style={{
      flex: 1,
      height: "44px"
    }}
  />

  <button
    className="btn primary"
    onClick={handleAdd}
    style={{
      height: "44px",
      padding: "0 22px",
      borderRadius: "12px",
      fontWeight: "600"
    }}
  >
    Add
  </button>
</div>

        {error && (
          <p style={{ color: "#f87171", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "12px" }}>
  {persons.map((person) => (
    <div
      key={person._id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "06px 10px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.04)",
        marginBottom: "5px"
      }}
    >
      <span style={{ fontSize: "14px" }}>
        {person.name}
      </span>

      <span
        style={{
          cursor: "pointer",
          color: "#f87171",
          fontSize: "14px"
        }}
        onClick={() => handleDelete(person._id)}
      >
        Delete
      </span>
    </div>
  ))}
</div>
      </div>

      <div className="modal-footer" style={{ padding: "14px" }}>
        <button className="btn ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
}