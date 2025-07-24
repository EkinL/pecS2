// psp-emulator/index.js
const express = require('express');
const axios   = require('axios');
const app     = express();
app.use(express.json());

const MIN_DELAY = 3000;
const MAX_DELAY = 7000;

app.post('/pay', (req, res) => {
  const { id } = req.body;
  res.status(202).json({ message: 'Payment received', id });

  const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  setTimeout(async () => {
    try {
      await axios.post(`${process.env.PLATFORM_URL}/payments/psp`, {
        id,
        status: 'SUCCESS'
      });
      console.log(`↪ PSP → plateforme: payment ${id} SUCCESS`);
    } catch (err) {
      console.error('❌ PSP webhook error:', err.message);
    }
  }, delay);
});

app.listen(process.env.PORT||4000, ()=>console.log('🚀 PSP emulator listening'));