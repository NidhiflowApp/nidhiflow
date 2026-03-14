const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const investmentRoutes = require("./routes/investmentRoutes");
const configRoutes = require("./routes/configRoutes");
const paymentModeRoutes = require("./routes/paymentModeRoutes");
const personRoutes = require("./routes/personRoutes");


// Route Imports
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const planningConfigRoutes = require("./routes/planningConfigRoutes");
const budgetPlanningRoutes = require("./routes/budgetPlanningRoutes");



// Connect Database
connectDB();
require("./jobs/monthlyReportJob");
const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "https://nidhiflow-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://192.168.0.102:3000",
//       "https://nidhiflow-frontend.onrender.com"
//     ],
//     credentials: true,
//   })
// );
app.use(express.json());

// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/config", configRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/payment-modes", paymentModeRoutes);
app.use("/api/planning-config", planningConfigRoutes);
app.use("/api", require("./routes/financialInsightsRoutes"));
app.use("/api/reports", reportRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/budget-planning", budgetPlanningRoutes);

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
