app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, error: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    console.log("Sending OTP:", otp);

    // 🔥 transporter yaha banao
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: `"OTP Server" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`
    });

    res.json({ success: true });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});
