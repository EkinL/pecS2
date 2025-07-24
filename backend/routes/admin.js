const express = require('express');
const router = express.Router();

const { User, Payment } = require('../models');

const authenticateToken = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');


router.patch('/:id/activate', authenticateToken, authorizeAdmin, async (req,res) => {
    const merchant = await User.findByPk(req.params.id);
    if (!merchant) return res.status(404).json({ error:'Non trouvé' });
    await merchant.update({ status:'ACTIVE' });
    res.json({ message:'Activé' });
});

router.get('/stats', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const [totalTransactions, totalMerchants, totalClients] = await Promise.all([
      Payment.count(),
      User.count({ where: { role: 'ROLE_MERCHANT' } }),
      User.count({ where: { role: 'ROLE_USER' } }),
    ]);
    const totalAmount = await Payment.sum('amount', { where: { status: 'SUCCESS' } });
    res.json({ totalTransactions, totalMerchants, totalClients, totalAmount });
  } catch (err) {
    console.error('[ADMIN STATS]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/activity', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 10,
    });
    const activity = users.map(u => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      role: u.role,
      action: u.createdAt.getTime() === u.updatedAt.getTime() ? 'CREATED' : 'UPDATED',
      date: u.updatedAt,
    }));
    res.json(activity);
  } catch (err) {
    console.error('[ADMIN ACTIVITY]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;