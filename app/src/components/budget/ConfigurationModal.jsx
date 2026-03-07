import React, { useState } from "react";
import "../../styles/configModal.css";

export default function ConfigurationModal({
  onClose,
  onSave,
  config,
}) {
  console.log("ConfigurationModal Mounted");
  const [activeTab, setActiveTab] = useState("general");
  const [localConfig, setLocalConfig] = useState(config);
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "planningMode" && value === "custom") {
    setLocalConfig((prev) => ({
      ...prev,
      planningMode: "custom",
      fixedPercent: 0,
      variablePercent: 0,
      emergencyPercent: 0,
      investmentPercent: 0,
      wantsPercent: 0
    }));
    return;
  }

  if (name === "planningMode" && value === "golden") {
    setLocalConfig((prev) => ({
      ...prev,
      planningMode: "golden"
    }));
    return;
  }

  setLocalConfig((prev) => ({
    ...prev,
    [name]: isNaN(value) ? value : Number(value)
  }));
};

  const handleSave = () => {
  const {
    fixedPercent = 0,
    variablePercent = 0,
    emergencyPercent = 0,
    investmentPercent = 0,
    wantsPercent = 0,
  } = localConfig;

  const total =
    Number(fixedPercent) +
    Number(variablePercent) +
    Number(emergencyPercent) +
    Number(investmentPercent) +
    Number(wantsPercent);

  if (total !== 100) {
    alert(`Total percentage must equal 100%. Current total: ${total}%`);
    return;
  }

  onSave(localConfig);
  onClose();
};

  /* CENTER FORM CONTENT */
  const renderRightPanel = () => {

    /* ================= GENERAL ================= */
    if (activeTab === "general") {
      return (
        <>
          <div className="section-title">General Settings</div>

          <div className="form-group">
            <label>Monthly Budget</label>
            <input
              type="number"
              name="monthlyBudget"
              value={localConfig.monthlyBudget || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Savings Goal</label>
            <input
              type="number"
              name="savingsGoal"
              value={localConfig.savingsGoal || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={localConfig.currency || "INR"}
              onChange={handleChange}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </>
      );
    }

    /* ================= INCOME ================= */
    if (activeTab === "income") {
      return (
        <>
          <div className="section-title">Income Details</div>

          <div className="form-group">
            <label>Primary Income</label>
            <input
              type="number"
              name="primaryIncome"
              value={localConfig.primaryIncome || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Other Income</label>
            <input
              type="number"
              name="otherIncome"
              value={localConfig.otherIncome || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Income Frequency</label>
            <select
              name="incomeFrequency"
              value={localConfig.incomeFrequency || "monthly"}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </>
      );
    }

    /* ================= EXPENSE ================= */
    if (activeTab === "expense") {
      return (
        <>
          <div className="section-title">Expense Overview</div>

          <div className="form-group">
            <label>Fixed Expenses</label>
            <input
              type="number"
              name="fixedExpenses"
              value={localConfig.fixedExpenses || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Variable Expenses</label>
            <input
              type="number"
              name="variableExpenses"
              value={localConfig.variableExpenses || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Discretionary Limit</label>
            <input
              type="number"
              name="discretionaryLimit"
              value={localConfig.discretionaryLimit || ""}
              onChange={handleChange}
            />
          </div>
        </>
      );
    }

/* ================= PLANNING TAB ================= */
if (activeTab === "planning") {
  const planningMode = localConfig.planningMode || "golden";
  const isGolden = planningMode === "golden";

  const GOLDEN = {
    fixedPercent: 50,
    variablePercent: 20,
    emergencyPercent: 10,
    investmentPercent: 10,
    wantsPercent: 10,
  };

  const rows = [
    ["Fixed Expenses", "fixedPercent", GOLDEN.fixedPercent],
    ["Variable Expenses", "variablePercent", GOLDEN.variablePercent],
    ["Emergency Fund", "emergencyPercent", GOLDEN.emergencyPercent],
    ["Investments", "investmentPercent", GOLDEN.investmentPercent],
    ["Wants / Buffer", "wantsPercent", GOLDEN.wantsPercent],
  ];

  return (
    <>
      {/* ===== HEADER : SINGLE ROW (FINAL) ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "6px",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#e5e7eb",
          }}
        >
          Category Split (%)
        </span>

        <label className="premium-radio" style={{ fontSize: "12px" }}>
          <input
            type="radio"
            name="planningMode"
            value="golden"
            checked={isGolden}
            onChange={handleChange}
          />
          <span>Golden Rule</span>
        </label>

        <label className="premium-radio" style={{ fontSize: "12px" }}>
          <input
            type="radio"
            name="planningMode"
            value="custom"
            checked={!isGolden}
            onChange={handleChange}
          />
          <span>Custom Rule</span>
        </label>
      </div>

      {/* ===== COMPACT LIST : ALL 5 VISIBLE ===== */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",           // tighter gap so 5th row fits
        }}
      >
        {rows.map(([label, key, goldenValue]) => (
          <div
            key={key}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 70px",
              alignItems: "center",
              height: "34px",    // fixed compact height
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#cbd5e1",
              }}
            >
              {label}
            </span>

            {/* INPUT WITH % PERFECTLY ALIGNED */}
            <div style={{ position: "relative" }}>
              <input
                type="number"
                name={key}
                value={isGolden ? goldenValue : localConfig[key] || ""}
                onChange={handleChange}
                disabled={isGolden}
                style={{
                  width: "70px",
                  height: "26px",
                  paddingRight: "20px",
                  fontSize: "12px",
                  lineHeight: "26px",   // 🔑 aligns % vertically
                  textAlign: "right",
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: "6px",
                }}
              />
              <span
  style={{
    position: "absolute",
    right: "6px",
    top: "35%",
    transform: "translateY(-55%)", // 🔑 slight bias to match number glyph
    fontSize: "12px",
    fontWeight: 500,
    height: "26px",
    display: "flex",
    alignItems: "center",          // 🔑 align to text, not box
    color: "#9ca3af",
    pointerEvents: "none",
  }}
>
  %
</span>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}


    /* ================= ADVANCED ================= */
    if (activeTab === "advanced") {
      return (
        <>
          <div className="section-title">Advanced Settings</div>

          <div className="form-group">
            <label>Overspending Alert</label>
            <select
              name="overspendingAlert"
              value={localConfig.overspendingAlert || "yes"}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Carry Forward Unused Budget</label>
            <select
              name="carryForward"
              value={localConfig.carryForward || "yes"}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Lock Savings First</label>
            <select
              name="lockSavings"
              value={localConfig.lockSavings || "no"}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </>
      );
    }

    return null;
  };

  /* INFO PANEL */
  const infoMap = {
    general: {
      title: "General Settings",
      points: [
        "Define your overall monthly budget",
        "Set savings expectations",
        "Choose default currency",
      ],
    },
    income: {
      title: "Income",
      points: ["Add salary and other income sources"],
    },
    expense: {
      title: "Expense",
      points: ["Track and control monthly expenses"],
    },
    planning: {
      title: "Planning",
      points: [
        "Golden rule uses recommended allocation",
        "Custom rule allows flexibility",
        "Tracking adapts automatically",
      ],
    },
    advanced: {
      title: "Advanced",
      points: ["Automation and alerts"],
    },
  };

  const info = infoMap[activeTab] || infoMap.general;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configuration</h2>
          <div className="config-hint">
  All settings are optional. We’ve already set this up for you — tweak it only if you want.
</div>


        </div>

        <div className="modal-body">
          <div className="config-layout">
            <div className="config-tabs">
              {["general", "income", "expense", "planning", "advanced"].map(tab => (
                <div
                  key={tab}
                  className={`config-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))}
            </div>

            <div className="config-content">{renderRightPanel()}</div>

            <div className="config-info-panel">
              <h3>{info.title}</h3>
              <div className="info-points">
                {info.points.map(p => (
                  <div key={p} className="info-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
