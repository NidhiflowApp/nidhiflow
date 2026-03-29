const ExcelJS = require("exceljs");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const User = require("../models/User");

exports.generateExcelReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const user = await User.findById(userId).select("name email");

    // ================= CALCULATE TOTALS ONCE =================
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const savings = totalIncome - totalExpense;
    const savingsPercent =
      totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

    const workbook = new ExcelJS.Workbook();

    // =====================================================
    // SHEET 1 - ALL TRANSACTIONS
    // =====================================================
    const sheet1 = workbook.addWorksheet("All Transactions");

    // ----- HEADER SECTION -----
    sheet1.addRow(["Personal Budget Management Tool (NidhiFlow)"]);
    sheet1.getRow(1).font = { size: 16, bold: true };

    sheet1.addRow(['"Track Smart. Save Smart. Grow Smart."']);
    sheet1.getRow(2).font = { italic: true };

    sheet1.addRow([]);
    sheet1.addRow([`Monthly Financial Report - ${month}`]);
    sheet1.getRow(4).font = { bold: true };

    sheet1.addRow([]);
    sheet1.addRow(["User Details"]);
    sheet1.getRow(6).font = { bold: true };

    sheet1.addRow(["Name", user?.name || "N/A"]);
    sheet1.addRow(["Email", user?.email || "N/A"]);
    sheet1.addRow(["Generated On", new Date().toLocaleDateString()]);

    sheet1.addRow([]);

    // ----- FINANCIAL SUMMARY -----
    sheet1.addRow(["Financial Summary"]);
    sheet1.getRow(sheet1.lastRow.number).font = { bold: true };

    sheet1.addRow(["Total Income (₹)", totalIncome]);
    sheet1.addRow(["Total Expense (₹)", totalExpense]);
    sheet1.addRow(["Savings (₹)", savings]);
    sheet1.addRow(["Savings (%)", `${savingsPercent}%`]);

    sheet1.addRow([]);
    sheet1.addRow([]);

    // ----- TRANSACTION TABLE -----
    sheet1.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Type", key: "type", width: 12 },
      { header: "Description", key: "description", width: 25 },
      { header: "Category", key: "category", width: 20 },
      { header: "Paid By", key: "paidBy", width: 15 },
      { header: "Payment Mode", key: "paymentMode", width: 18 },
      { header: "Amount (₹)", key: "amount", width: 15 },
    ];

    // Insert Income Rows
    incomes.forEach((item) => {
      sheet1.addRow({
        date: item.date.toISOString().split("T")[0],
        type: "Income",
        description: item.description,
        category: item.category,
        paidBy: item.paidBy,
        paymentMode: item.paymentMode,
        amount: item.amount,
      });
    });

    // Insert Expense Rows
    expenses.forEach((item) => {
      sheet1.addRow({
        date: item.date.toISOString().split("T")[0],
        type: "Expense",
        description: item.title,
        category: item.category,
        paidBy: item.paidBy,
        paymentMode: item.paymentMode,
        amount: item.amount,
      });
    });

    // Currency Format
    sheet1.getColumn("amount").numFmt = '"₹"#,##0.00';

    // =====================================================
    // SHEET 2 - SUMMARY
    // =====================================================
    const sheet2 = workbook.addWorksheet("Summary");

    sheet2.addRow(["Personal Budget Management Tool (NidhiFlow)"]);
    sheet2.getRow(1).font = { size: 16, bold: true };

    sheet2.addRow(['"Track Smart. Save Smart. Grow Smart."']);
    sheet2.getRow(2).font = { italic: true };

    sheet2.addRow([]);
    sheet2.addRow([`Monthly Financial Report - ${month}`]);
    sheet2.getRow(4).font = { bold: true };

    sheet2.addRow([]);
    sheet2.addRow(["User Details"]);
    sheet2.getRow(6).font = { bold: true };

    sheet2.addRow(["Name", user?.name || "N/A"]);
    sheet2.addRow(["Email", user?.email || "N/A"]);
    sheet2.addRow(["Generated On", new Date().toLocaleDateString()]);

    sheet2.addRow([]);
    sheet2.addRow(["Financial Summary"]);
    sheet2.getRow(sheet2.lastRow.number).font = { bold: true };

    sheet2.addRow(["Total Income (₹)", totalIncome]);
    sheet2.addRow(["Total Expense (₹)", totalExpense]);
    sheet2.addRow(["Savings (₹)", savings]);
    sheet2.addRow(["Savings (%)", `${savingsPercent}%`]);

    sheet2.getColumn(1).width = 30;
    sheet2.getColumn(2).width = 25;

    // =====================================================
    // SEND FILE
    // =====================================================
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=NidhiFlow-${month}-Report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Report generation failed" });
  }
};