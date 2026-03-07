import { useState, useEffect } from "react";

const AddTransaction = ({
  setTransactions,
  editingTransaction,
  setEditingTransaction
}) => {
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    notes: ""
  });

  useEffect(() => {
    if (editingTransaction) setForm(editingTransaction);
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) return;

    setTransactions((prev) =>
      editingTransaction
        ? prev.map((t) => (t.id === form.id ? form : t))
        : [...prev, { ...form, id: Date.now() }]
    );

    setForm({
      type: "expense",
      category: "",
      amount: "",
      date: "",
      notes: ""
    });

    setEditingTransaction(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingTransaction ? "Edit" : "Add"} Transaction</h3>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="investment">Investment</option>
      </select>

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button type="submit">
        {editingTransaction ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default AddTransaction;
