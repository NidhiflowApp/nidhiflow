import "../styles/budgetLayout.css";

export default function BudgetLayout({ header, children }) {
  return (
    <>
      {/* Background + Layout */}
      <div className="budget-layout-bg">
        {header}
        <div className="budget-layout-container">
          {children}
        </div>
      </div>
    </>
  );
}