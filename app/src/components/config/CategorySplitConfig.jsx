export default function CategorySplitConfig() {
  return (
    <div className="config-card">
      <h3>🗂️ Category Split</h3>
      <p>Create custom expense categories</p>

      <button className="btn-outline">➕ Add Category</button>

      <div className="empty-state">
        No categories created
      </div>
    </div>
  );
}
