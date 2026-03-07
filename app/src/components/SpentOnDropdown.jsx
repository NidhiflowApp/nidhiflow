import { createPortal } from "react-dom";

export default function SpentOnDropdown({
  anchorRef,
  items,
  onSelect,
  activeIndex,
}) {
  if (!anchorRef?.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  return createPortal(
    <div
      className="portal-dropdown"
      style={{
        position: "absolute",
        top: rect.bottom + 6 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`dropdown-item ${
            idx === activeIndex ? "active" : ""
          }`}
          onMouseDown={() => onSelect(item)}  // ⛔ prevent blur
        >
          <span>{item.label}</span>
          <small>{item.category}</small>
        </div>
      ))}
    </div>,
    document.body
  );
}
