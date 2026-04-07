const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 Gmail config (ENV से)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// 🧠 OTP store
let otpStore = {};

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

// 🔥 Send OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, error: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    console.log("Sending OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Code",
      text: `Your OTP is: ${otp}`
    });

    res.json({ success: true });

  } catch (err) {
    console.log("ERROR:", err.message);
    res.json({ success: false, error: err.message });
  }
});

// 🔐 Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
