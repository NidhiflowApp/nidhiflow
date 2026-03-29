import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function SpentOnDropdown({
  anchorRef,
  items,
  onSelect,
  activeIndex,
}) {


 const [rect, setRect] = useState(null);

useEffect(() => {
  if (anchorRef?.current) {
    const r = anchorRef.current.getBoundingClientRect();
    setRect(r);
  }
}, [anchorRef, items]);

if (!rect) return null;

  return createPortal(
    <div
      className="portal-dropdown"
      style={{
  position: "fixed",
  top: rect.bottom + 6,
  left: Math.max(rect.left, 20),
  width: rect.width,
  zIndex: 999999999,
  pointerEvents: "auto",
  
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
