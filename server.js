// Import required modules
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware\
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://grubber.github.io', 
}));

app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(require('./etc/secrets/serviceAccountKey.json')),
});

app.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body, imageUrl } = req.body;
  console.log(fcmToken)
  console.log(title)
  console.log(body)
  console.log(imageUrl)
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
    setTimeout(async () => {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    }, 2000);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Notification server is running on http://localhost:${PORT}`);
});
