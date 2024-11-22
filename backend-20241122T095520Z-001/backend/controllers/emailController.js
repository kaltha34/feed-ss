const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  // Create a transporter using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: 'yasanduyaka2005@gmail.com', // Your email
      pass: 'lfsx bqcf lhmd uaew', // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendEmail };
