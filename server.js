const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "prabhukimar997@gmail.com",
    pass: "naaywhujgkbkmqhk"
  }
});

let otpStore = {};

app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    await transporter.sendMail({
      from: "prabhukimar997@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: "Your OTP is: " + otp
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 🔥 IMPORTANT (Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
