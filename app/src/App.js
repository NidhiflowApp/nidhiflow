import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardContainer from "./pages/DashboardContainer"; // ✅ Backend Version
import ChartsDashboard from "./pages/ChartsDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED ROUTE */}
      <Route
        path="/personal-budget"
        element={
          <PrivateRoute>
            <DashboardContainer /> {/* ✅ Now using backend version */}
          </PrivateRoute>
        }
      />
      <Route
  path="/financial-insights"
  element={
    <PrivateRoute>
      <ChartsDashboard />
    </PrivateRoute>
  }
/>

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

    </Routes>
  );
}

export default App;
