// src/data/incomeMaster.js

export const incomeMaster = [

  /* =========================
     REGULAR INCOME
  ========================= */
  { label: "Salary", category: "Income", type: "regular" },
  { label: "Bonus", category: "Income", type: "regular" },
  { label: "Incentive", category: "Income", type: "regular" },
  { label: "Overtime Pay", category: "Income", type: "regular" },

  /* =========================
     FREELANCE / SIDE INCOME
  ========================= */
  { label: "Freelance Payment", category: "Income", type: "regular" },
  { label: "Consulting Fees", category: "Income", type: "regular" },
  { label: "Part-time Job", category: "Income", type: "regular" },
  { label: "Online Gigs", category: "Income", type: "regular" },

  /* =========================
     TEMPORARY / ADJUSTABLE
  ========================= */
  { label: "Advance", category: "Income", type: "temporary" },      // ⭐ salary advance
  { label: "Refund", category: "Income", type: "temporary" },       // Amazon, Flipkart etc
  { label: "Reimbursement", category: "Income", type: "temporary" },// office claim
  { label: "Loan Received", category: "Income", type: "temporary" },// informal loans

  /* =========================
     INVESTMENT & INTEREST
  ========================= */
  { label: "Bank Interest", category: "Income", type: "regular" },
  { label: "FD Interest", category: "Income", type: "regular" },
  { label: "Dividend", category: "Income", type: "regular" },
  { label: "Capital Gains", category: "Income", type: "regular" },

  /* =========================
     RENTAL & PASSIVE
  ========================= */
  { label: "House Rent Received", category: "Income", type: "regular" },
  { label: "Room Rent", category: "Income", type: "regular" },
  { label: "Asset Lease Income", category: "Income", type: "regular" },

  /* =========================
     FAMILY / MISC
  ========================= */
  { label: "Family Support", category: "Income", type: "temporary" },
  { label: "Gift Received", category: "Income", type: "temporary" },
  { label: "Prize / Award", category: "Income", type: "temporary" },

  /* =========================
     OTHER
  ========================= */
  { label: "Cashback", category: "Income", type: "temporary" },
  { label: "Incentive Refund", category: "Income", type: "temporary" },
  { label: "Other Income", category: "Income", type: "regular" }
];
