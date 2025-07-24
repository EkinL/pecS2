const express = require('express');
const { User, Payment } = require('./models');
const router = express.Router();

let paymentClients = [];
let statsClients = [];
let activityClients = [];

router.get('/payments', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = Date.now();
  paymentClients.push({ id, res });

  req.on('close', () => {
    paymentClients = paymentClients.filter(c => c.id !== id);
  });
});

router.get('/stats', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = Date.now();
  statsClients.push({ id, res });

  try {
    const stats = await computeStats();
    res.write(`data: ${JSON.stringify(stats)}\n\n`);
  } catch (err) {
    console.error('[SSE] Initial stats error', err);
  }

  req.on('close', () => {
    statsClients = statsClients.filter(c => c.id !== id);
  });
});

router.get('/activity', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = Date.now();
  activityClients.push({ id, res });

  try {
    const events = await getRecentActivity();
    res.write(`data: ${JSON.stringify(events)}\n\n`);
  } catch (err) {
    console.error('[SSE] Initial activity error', err);
  }

  req.on('close', () => {
    activityClients = activityClients.filter(c => c.id !== id);
  });
});

function broadcastPayment(data) {
  paymentClients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      paymentClients = paymentClients.filter(c => c !== client);
    }
  });
}

async function getRecentActivity(limit = 5) {
  const users = await User.findAll({
    order: [['updatedAt', 'DESC']],
    limit,
  });
  return users.map(u => ({
    id: u.id,
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    role: u.role,
    action: u.createdAt.getTime() === u.updatedAt.getTime() ? 'CREATED' : 'UPDATED',
    date: u.updatedAt,
  }));
}

function broadcastActivity(event) {
  activityClients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(event)}\n\n`);
    } catch (err) {
      activityClients = activityClients.filter(c => c !== client);
    }
  });
}

async function computeStats() {
  const [totalTransactions, totalMerchants, totalClients] = await Promise.all([
    Payment.count(),
    User.count({ where: { role: 'ROLE_MERCHANT' } }),
    User.count({ where: { role: 'ROLE_USER' } }),
  ]);
  const totalAmount = await Payment.sum('amount', { where: { status: 'SUCCESS' } });
  return { totalTransactions, totalMerchants, totalClients, totalAmount };
}

async function broadcastStats(data) {
  if (!data) data = await computeStats();
  statsClients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      statsClients = statsClients.filter(c => c !== client);
    }
  });
}

module.exports = {
  router,
  broadcastPayment,
  broadcastStats,
  computeStats,
  broadcastActivity,
  getRecentActivity,
};
