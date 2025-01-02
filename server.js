// server.js

const express = require('express');
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Load environment variables from .env file
dotenv.config();

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

app.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body, imageUrl } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create the notification payload
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
      ...(imageUrl && { image: imageUrl }), // Include image if provided
    },
    data: {
      // Additional data can be added here
      customDataKey: 'customDataValue',
    },
  };

  try {
    // Send the notification
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at Port: ${PORT}`);
});
