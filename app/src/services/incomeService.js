import axios from "axios";


const API = "https://nidhiflow-backend.onrender.com/api";

/* ===========================
   ADD INCOME (POST)
=========================== */
export const addIncome = async (incomeData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/income`,
    incomeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* ===========================
   UPDATE INCOME (PUT)
=========================== */
export const updateIncome = async (id, incomeData) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${API}/income/${id}`,
    incomeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* ===========================
   DELETE INCOME (DELETE)
=========================== */
export const deleteIncome = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(
    `${API}/income/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};