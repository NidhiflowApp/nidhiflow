const express = require("express");
const router = express.Router();

const { generateExcelReport } = require("../controllers/reportController");
const generateMonthlyPDF = require("../services/pdfService");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

// ==========================
// EXCEL REPORT ROUTE
// ==========================
router.get("/excel", protect, generateExcelReport);

// ==========================
// TEST PDF ROUTE
// ==========================
router.get("/test-pdf", async (req, res) => {
  try {
    const user = {
      name: "Test User",
      email: "test@example.com",
    };

    const totals = {
      totalIncome: 50000,
      totalExpense: 30000,
      savings: 20000,
      savingsPercent: 40,
    };

    const filePath = await generateMonthlyPDF({
      user,
      month: "January 2026",
      totals,
    });

    res.send("PDF generated successfully at: " + filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("PDF generation failed");
  }
});

// ======================================================
// MONTHLY HTML REPORT (For Puppeteer PDF Rendering)
// ======================================================
router.get("/monthly-html/:userId/:month", async (req, res) => {
  try {
    const { userId, month } = req.params;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const user = await User.findById(userId);

    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savings = totalIncome - totalExpense;
    const savingsPercent =
      totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

    // Category Split Data
    const categoryMap = {};
    expenses.forEach((exp) => {
      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + exp.amount;
    });

    const categoryLabels = Object.keys(categoryMap);
    const categoryValues = Object.values(categoryMap);

    res.send(`
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #fff;
        }

        .header {
          background: #1F4E78;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .info {
          margin-top: 15px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 14px;
        }

        .kpi-container {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }

        .kpi {
  width: 23%;
  padding: 15px;
  color: white;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);   /* ✅ Professional Shadow */
}

        .income { background: #2E7D32; }
        .expense { background: #C62828; }
        .saving { background: #1565C0; }
        .percent { background: #6A1B9A; }

        .charts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .chart-box {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 6px;
        }
        .chart-box canvas {
  max-height: 220px !important;
}

        footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: gray;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <h2>Personal Budget Management Tool (NidhiFlow)</h2>
        <p>"Track Smart. Save Smart. Grow Smart."</p>
      </div>

      <div class="info">
        <p><strong>Month:</strong> ${month}</p>
        <p><strong>Name:</strong> ${user?.name}</p>
        <p><strong>Email:</strong> ${user?.email}</p>
        <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="kpi-container">
        <div class="kpi income">
          <h4>Total Income</h4>
          <h3>₹ ${totalIncome}</h3>
        </div>
        <div class="kpi expense">
          <h4>Total Expense</h4>
          <h3>₹ ${totalExpense}</h3>
        </div>
        <div class="kpi saving">
          <h4>Savings</h4>
          <h3>₹ ${savings}</h3>
        </div>
        <div class="kpi percent">
          <h4>Savings %</h4>
          <h3>${savingsPercent}%</h3>
        </div>
      </div>
<h3 style="margin-top:20px;">Visual Insights</h3>
      <div class="charts">
        <div class="chart-box">
          <canvas id="categoryChart"></canvas>
        </div>
        <div class="chart-box">
          <canvas id="incomeExpenseChart"></canvas>
        </div>
      </div>

      <footer>
        Generated by NidhiFlow | Confidential Financial Report
      </footer>

      <script>
        new Chart(document.getElementById('categoryChart'), {
  type: 'pie',
  data: {
    labels: ${JSON.stringify(categoryLabels)},
    datasets: [{
      data: ${JSON.stringify(categoryValues)},
      backgroundColor: ['#1565C0','#2E7D32','#C62828','#6A1B9A','#F9A825']
    }]
  },
  options: {
    animation: false,
    maintainAspectRatio: false
  }
});

        new Chart(document.getElementById('incomeExpenseChart'), {
  type: 'bar',
  data: {
    labels: ['Income','Expense'],
    datasets: [{
      data: [${totalIncome}, ${totalExpense}],
      backgroundColor: ['#2E7D32','#C62828']
    }]
  },
  options: {
    animation: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
      </script>

    </body>
    </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("HTML generation failed");
  }
});

module.exports = router;