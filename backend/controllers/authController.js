const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/emailService");

// ==========================
// REGISTER USER
// ==========================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
if (password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters"
  });
}
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
const newUser = await User.create({
  name,
  email,
  password: hashedPassword,
  verificationToken,
  isVerified: false,
});

// Send verification email
try {
  await sendVerificationEmail(email, verificationToken);
} catch (emailError) {
  console.error("EMAIL ERROR:", emailError);
}

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
  console.error("REGISTER ERROR:", error);

  // Mongoose Validation Error (invalid email, weak password etc)
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)[0].message
    });
  }

  // Duplicate email (unique constraint)
  if (error.code === 11000) {
    return res.status(400).json({
      message: "Email already exists"
    });
  }

  res.status(500).json({
    message: "Something went wrong"
  });
}
};

// ==========================
// LOGIN USER
// ==========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
// Check if email is verified
if (!user.isVerified) {
  return res.status(401).json({
    message: "Please verify your email before logging in."
  });
}
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
  console.error("LOGIN ERROR:", error);

  res.status(500).json({
    message: "Something went wrong"
  });
}
};

// ==========================
// VERIFY EMAIL
// ==========================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token ❌");
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Email Verified - NidhiFlow</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      width: 420px;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    p {
      color: #555;
      margin-bottom: 20px;
    }

    .btn {
      background: #4CAF50;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }

    .btn:hover {
      background: #43a047;
    }
  </style>

  <script>
    setTimeout(function() {
      window.location.href = "${process.env.FRONTEND_URL}/login";
    }, 5000);
  </script>

</head>

<body>

  <div class="card">

  <h1 style="color:#2c3e50;margin-bottom:8px;">NidhiFlow</h1>
<p style="color:#888;margin-bottom:20px;">Smart Personal Finance Manager</p>

  <h2>✅ Email Verified Successfully</h2>
<p style="font-size:14px;color:#777;">Welcome to NidhiFlow</p>

    <p>Your NidhiFlow account has been activated.</p>

    <p>You will be redirected to the login page in <strong>5 seconds</strong>.</p>

    <a class="btn" href="${process.env.FRONTEND_URL}/login">
  Go to Login
</a>
  </div>

</body>
</html>
`);
    
  } catch (error) {
    return res.status(500).send("Verification failed ❌");
  }
};

// ==========================
// FORGOT PASSWORD
// ==========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Security: Always send same message
    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

// Send reset email
try {
  await sendResetPasswordEmail(email, resetToken);
} catch (emailError) {
  console.error("RESET EMAIL ERROR:", emailError);
}

res.json({
  message: "If this email exists, a reset link has been sent."
});

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};
// ==========================
// RESET PASSWORD
// ==========================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    // Hash token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful ✅"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};