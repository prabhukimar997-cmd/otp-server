const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 ENV check
if (!process.env.EMAIL || !process.env.PASS) {
  console.log("❌ ERROR: EMAIL या PASS missing hai (Railway Variables check karo)");
}

// 📧 Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// 🧠 OTP store
let otpStore = {};

// 🟢 Health check
app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

// 🔥 SEND OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, error: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    console.log("📩 Sending OTP to:", email);
    console.log("🔢 OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: "Your OTP is: " + otp
    });

    console.log("✅ Email sent successfully");

    res.json({ success: true });

  } catch (err) {
    console.log("❌ MAIL ERROR:", err.message);
    res.json({ success: false, error: err.message });
  }
});

// 🔐 VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false });
  }

  if (otpStore[email] == otp) {
    delete otpStore[email];
    console.log("✅ OTP Verified:", email);
    res.json({ success: true });
  } else {
    console.log("❌ Invalid OTP:", email);
    res.json({ success: false });
  }
});

// 🚀 START SERVER (Railway compatible)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
