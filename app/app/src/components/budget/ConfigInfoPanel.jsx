const tabInfo = {
  general: {
    title: "General Settings",
    description: "Basic setup to get started with budgeting.",
    points: [
      "Set monthly budget limit",
      "Define savings goal",
      "Choose preferred currency"
    ]
  },
  income: {
    title: "Income",
    description: "Add all income sources for accurate planning.",
    points: [
      "Salary and side income",
      "Used for monthly planning",
      "Helps calculate savings %"
    ]
  },
  expense: {
    title: "Expense",
    description: "Organize and control your spending.",
    points: [
      "Category-wise expense limits",
      "Overspend alerts",
      "Better spending insights"
    ]
  },
  planning: {
    title: "Planning",
    description: "Plan before the month starts.",
    points: [
      "Allocate budget in advance",
      "Lock savings first",
      "Avoid last-minute shortfall"
    ]
  },
  advanced: {
    title: "Advanced",
    description: "Automation and smart rules.",
    points: [
      "Carry forward logic",
      "Alerts & restrictions",
      "Future-ready controls"
    ]
  }
};

export function ConfigInfoPanel({ activeTab }) {
  const info = tabInfo[activeTab];

  return (
    <div className="config-info-panel">
      <h3>{info.title}</h3>
      <p className="info-desc">{info.description}</p>

      <ul>
        {info.points.map(point => (
          <li key={point}>• {point}</li>
        ))}
      </ul>
    </div>
  );
}
