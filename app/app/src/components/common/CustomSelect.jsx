import React, { useState, useRef, useEffect } from "react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select"
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
    setOpen(!open);
  };

  return (
    <>
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%"
        }}
      >
        <div
          onClick={toggleDropdown}
          style={{
            height: "42px",
            padding: "0 12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            color: "#fff"
          }}
        >
          {value || placeholder}
          <span style={{ fontSize: "12px" }}>▼</span>
        </div>
      </div>

      {open && position && (
        <div
          style={{
            position: "fixed",   // 🔥 KEY FIX
            top: position.top,
            left: position.left,
            width: position.width,
            background: "linear-gradient(180deg,#0f172a,#020617)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            maxHeight: "180px",   // 🔥 only 4 items visible
            overflowY: "auto",    // 🔥 scroll inside dropdown
            zIndex: 999999,
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                color: "#e5e7eb"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(34,197,94,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </>
  );
}