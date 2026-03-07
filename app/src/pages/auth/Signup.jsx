import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // 🔒 Disable scroll
    document.body.style.overflow = "hidden";

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



    return () => {
      // 🔓 Restore scroll when leaving page
      document.body.style.overflow = "auto";
      clearInterval(interval);
    };
  }, []);

  const handleSignup = async () => {

  // ✅ ADD THIS BLOCK
  if (password !== confirmPassword) {
    alert("Passwords do not match ❌");
    return;
  }

  try {
    await authService.register(name, email, password);
    alert("Signup successful ✅");
    navigate("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed ❌");
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

        <input
  type="text"
  placeholder="Full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

<div className="password-wrapper">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <span
    className="eye-icon"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </span>
</div>
        <button onClick={handleSignup}>Create Account</button>

        <div className="link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
