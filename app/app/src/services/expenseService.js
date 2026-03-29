import axios from "axios";

const API = "https://nidhiflow-backend.onrender.com/api";

/* =========================
   ADD EXPENSE
========================= */
export const addExpense = async (expenseData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/expenses`,
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   UPDATE EXPENSE
========================= */
export const updateExpense = async (id, expenseData) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${API}/expenses/${id}`,
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   DELETE EXPENSE
========================= */
export const deleteExpense = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(
    `${API}/expenses/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};