import { useEffect, useState, createContext, useCallback } from "react";
import DigitalClock from "../components/DigitalClock";
import ConfigModal from "../components/config/ConfigModal";

export const ConfigContext = createContext(null);

export default function DashboardLayout({ children }) {
  const [showConfig, setShowConfig] = useState(false);

  const openConfig = useCallback(() => {
    setShowConfig(true);
  }, []);

  const closeConfig = useCallback(() => {
    setShowConfig(false);
  }, []);

  // Disable scroll for dashboard pages
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  return (
    <ConfigContext.Provider value={{ openConfig, closeConfig }}>
      <div className="app-bg">

        {/* TOP RIGHT CLOCK */}
        <div className="digital-clock">
          <DigitalClock />
        </div>

        {/* PAGE CONTENT */}
        {children}

        {/* CONFIG MODAL */}
        {showConfig && (
          <ConfigModal onClose={closeConfig} />
        )}

      </div>
    </ConfigContext.Provider>
  );
}
