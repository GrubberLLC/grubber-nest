// server.js

const express = require('express');
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to send an email
app.post('/send-email', async (req, res) => {
  const { fromEmail, toEmail, subject, message } = req.body;

  if (!fromEmail || !toEmail || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
