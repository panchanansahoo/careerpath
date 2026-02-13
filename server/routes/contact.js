import express from 'express';
const router = express.Router();

// POST /api/contact - Store contact form submissions
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Configure Nodemailer
    const nodemailer = await import('nodemailer');
    
    // Create a transporter using Gmail (or other service)
    // NOTE: User needs to provide EMAIL_USER and EMAIL_PASS in .env
    // For Gmail, use an App Password, not your login password!
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.EMAIL_PASS  // e.g., 'your-app-password'
      }
    });

    // 2. Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: 'careerloop.me@gmail.com',  // Receiver address (your email)
      subject: `CareerLoop Contact: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      replyTo: email // Allow replying directly to the user
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to careerloop.me@gmail.com from ${email}`);
    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
