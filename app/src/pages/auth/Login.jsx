import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     Prevent Logged-in Users
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // navigate("/personal-budget", { replace: true });
    }
  }, [navigate]);

  /* =========================
     Digital Clock
     ========================= */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  /* =========================
     Handle Login
     ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await authService.login(email, password);

      // 🔑 Adjust if backend response structure differs
      const token = response?.token || response?.data?.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      console.log("Stored token:", localStorage.getItem("token"));
      navigate("/personal-budget", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg">

      {/* DIGITAL CLOCK */}
      <div className="digital-clock">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>

      <div className="app-card">
        <h1 className="brand">NidhiFlow</h1>

        <p className="quote">
          “Don’t Save what is left after Spending.
          <br />
          Spend what is left after Saving.”
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ textAlign: "right", marginTop: "6px" }}>
  <Link to="/forgot-password" style={{ fontSize: "14px" }}>
    Forgot Password?
  </Link>
</div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="link">
          Don&apos;t have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
