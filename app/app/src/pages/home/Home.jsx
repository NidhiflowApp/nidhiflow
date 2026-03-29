import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DigitalClock from "../../components/DigitalClock";

export default function Home() {
  const navigate = useNavigate();

  // Disable scroll ONLY for home
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-bg">

      {/* TOP RIGHT */}
      <div className="home-topbar">
        <div className="welcome-row">
          <span>Welcome, Venugopal</span>
          <span
            className="logout"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
        <DigitalClock />
      </div>

      {/* BIG GLASS CONTAINER */}
      <div className="home-glass">

        <div className="brand">NidhiFlow</div>

        <div className="quote">
          “Don’t Save what is left after Spending<br />
          Spend what is left after Saving.”
        </div>

        {/* TWO GLASS CARDS */}
        <div className="dashboard-grid">

          {/* PERSONAL BUDGET */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/personal-budget")}
          >
            <div className="icon-animation house-icon">🏠</div>
            <div className="dashboard-title">Personal Budget</div>
            <div className="dashboard-desc">
              Track Income, Expenses & Savings
            </div>
          </div>

          {/* TRIP BUDGET */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/trip-budget")}
          >
            <div className="icon-animation car-icon">🚗</div>
            <div className="dashboard-title">Trip Budget</div>
            <div className="dashboard-desc">
              Track & Split Trip Costs
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
