const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================
// VERIFY EMAIL
// ==========================
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

  const mailOptions = {
  from: `"NidhiFlow" <${process.env.EMAIL_USER}>`,
  to: email,
  replyTo: "nidhiflow.app@gmail.com",
  subject: "Verify Your Email - NidhiFlow",
  text: "Welcome to NidhiFlow. Please verify your email to activate your account.",
html: `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">

  <div style="text-align:center; margin-bottom:20px;">
    <h1 style="color:#2c3e50;">NidhiFlow</h1>
    <p style="color:#888;">Smart Personal Finance Manager</p>
  </div>

  <h2>Welcome to NidhiFlow 🎉</h2>

  <p>Thank you for signing up!</p>
  <p>Please click the button below to verify your email and activate your account.</p>

  <div style="text-align:center; margin:20px 0;">
    <a href="${verificationUrl}" target="_blank"
       style="background:#4CAF50;color:white;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;">
       Verify Email
    </a>
  </div>

  <p>Once your account is activated, you can start managing your finances with ease.</p>

  <h3>With NidhiFlow you can:</h3>

  <ul>
    <li>Track your income and expenses in one place</li>
    <li>Get a clear financial overview with smart dashboards</li>
    <li>Manage budget categories easily</li>
    <li>Monitor your monthly spending patterns</li>
    <li>Receive a monthly financial report with Excel and PDF attachments</li>
    <li>Stay in control of your personal finances</li>
  </ul>

  <p>If you did not create this account, please ignore this email.</p>
  <hr style="margin:25px 0">

<p style="font-size:13px;color:#777;text-align:center;">
<b>We value your feedback.</b><br>
Have questions, feedback, or found something that can be improved?<br>
Contact us at 
<a href="mailto:nidhiflow.app@gmail.com">nidhiflow.app@gmail.com</a>,
and our team will respond within <b>48 hours</b>.
</p>

  <hr style="margin:30px 0">

  <p style="text-align:center;color:#888;font-size:12px;">
    NidhiFlow — Track Smart. Save Smart. Grow Smart.
  </p>
  

</div>
`,
  };

  await transporter.sendMail(mailOptions);
};

// ==========================
// RESET PASSWORD EMAIL
// ==========================
const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"NidhiFlow" <${process.env.EMAIL_USER}>`,
  to: email,
  replyTo: "nidhiflow.app@gmail.com",
  subject: "Reset Your Password - NidhiFlow",
  text: "You requested to reset your NidhiFlow password.",
    html: `
      <h2>Password Reset Request 🔐</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ==========================
// MONTHLY REPORT EMAIL
// ==========================
const sendMonthlyReportEmail = async (
  email,
  month,
  summary,
  attachments
) => {

  const mailOptions = {
    from: `"NidhiFlow" <${process.env.EMAIL_USER}>`,
  to: email,
  replyTo: "nidhiflow.app@gmail.com",
  subject: `Your ${month} Financial Report - NidhiFlow`,
  text: `Your ${month} financial report from NidhiFlow is attached.`,
    html: `
      <h2>📊 ${month} Financial Summary</h2>

  <p><strong>Total Income:</strong> ₹${summary?.totalIncome || 0}</p>
<p><strong>Total Expenses:</strong> ₹${summary?.totalExpenses || 0}</p>
<p><strong>Total Savings:</strong> ₹${summary?.totalSavings || 0}</p>

<p><strong>Top Spending Category:</strong> ${summary?.topCategory || "N/A"}</p>

      <hr>

      <p>Your detailed report is attached:</p>

      <ul>
        <li>Excel detailed statement</li>
        <li>PDF visual report with charts</li>
      </ul>

      <p>Thank you for using <strong>NidhiFlow</strong>.</p>

      <p><em>Track Smart. Save Smart. Grow Smart.</em></p>
    `,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendMonthlyReportEmail,   // 👈 ADD THIS
};