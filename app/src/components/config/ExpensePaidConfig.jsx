export default function ExpensePaidConfig() {
  return (
    <div className="config-card">
      <h3>💳 Expenses Paid</h3>
      <p>Configure payment methods</p>

      <button className="btn-outline">➕ Add Payment Mode</button>

      <div className="empty-state">
        No payment methods configured
      </div>
    </div>
  );
}
