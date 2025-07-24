const express = require('express');
const router = express.Router();

let clients = [];

router.get('/payments', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = Date.now();
  clients.push({ id, res });

  req.on('close', () => {
    clients = clients.filter(c => c.id !== id);
  });
});

function broadcastPayment(data) {
  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      // remove errored client
      clients = clients.filter(c => c !== client);
    }
  });
}

module.exports = { router, broadcastPayment };