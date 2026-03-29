import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonalBudget from "./PersonalBudget";

export default function PersonalBudgetBackend() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [year] = useState(currentYear);
  const [month] = useState(currentMonth);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/dashboard?year=${year}&month=${month + 1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setTransactions(res.data.transactions || []);

      } catch (err) {
        console.error("Dashboard API error:", err);
      }
    };

    fetchDashboard();
  }, [year, month]);

  return <PersonalBudget externalTransactions={transactions} />;
}
