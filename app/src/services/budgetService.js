import apiClient from "./apiClient";

/* ================= ADD ENTRY ================= */
const addEntry = async (data) => {
  const response = await apiClient.post("/budget/add", data);
  return response.data;
};

/* ================= GET ALL INCOMES ================= */
const getIncomes = async () => {
  const response = await apiClient.get("/income");
  return response.data;
};

/* ================= GET ALL EXPENSES ================= */
const getExpenses = async () => {
  const response = await apiClient.get("/expenses"); // plural (matches backend)
  return response.data;
};

const budgetService = {
  addEntry,
  getIncomes,
  getExpenses,
};

export default budgetService;