const express = require('express');
const fetch = require('node-fetch'); // Make sure this is installed if you're using fetch
const app = express();
app.use(express.json());

// Function to send push notification
async function sendPushNotification(expoPushToken, title, message) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: message,
      data: { extraData: 'User has logged in' },
    }),
  });

  const responseData = await response.json();
  console.log('Notification Response: ', responseData);
}

// Route for user login (where you send the notification after successful login)
app.post('/login', async (req, res) => {
  const { username, password, expoPushToken } = req.body; // Assume you pass the Expo push token from the frontend

  if (!expoPushToken) {
    return res.status(400).json({ error: 'Expo push token is required' });
  }

  // Simulate login process (replace with actual authentication logic)
  if (username === 'correctUser' && password === 'correctPassword') {
    try {
      // Send notification when the user logs in successfully
      await sendPushNotification(expoPushToken, 'Login Successful', 'Welcome back, you have successfully logged in!');
      res.status(200).json({ success: true, message: 'Login successful and notification sent' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error sending notification' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
