const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return {
    sendMail: (opts) => {
      console.log('Email contents:', opts);
      return Promise.resolve();
    }
  };
}

const transporter = createTransport();

function sendNotification(subject, text) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_FROM || 'admin@example.com',
    subject,
    text
  };
  return transporter.sendMail(mailOptions);
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message, artwork, artist } = req.body;
  try {
    await sendNotification(
      `Artwork inquiry: ${artwork}`,
      `${name} <${email}> wants to purchase or learn more about "${artwork}" by ${artist}.\n\nMessage:\n${message}`
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/price-watch', async (req, res) => {
  const { name, contact, artwork, artist } = req.body;
  try {
    await sendNotification(
      `Price watch request: ${artwork}`,
      `${name} (${contact}) wants to be notified if the price drops for "${artwork}" by ${artist}.`
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
