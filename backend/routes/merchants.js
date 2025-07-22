require('dotenv').config();
const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto   = require('crypto');
const jwt      = require('jsonwebtoken');
const { Merchant } = require('../models');
const authenticateToken   = require('../middleware/auth');
const authorizeUserAccess = require('../middleware/authorize');
const router = express.Router();

// GET /merchants
// Admin peut lister tous les merchants
router.get('/', authenticateToken, authorizeUserAccess, async (req, res) => {
    try {
      const list = await Merchant.findAll();
      res.json(list);
    } catch (err) {
      console.error('[MERCHANTS GET ALL]', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// GET /merchants/:id
// Merchant peut voir son propre profil, admin peut voir n’importe lequel
router.get('/:id', authenticateToken, authorizeUserAccess,
  async (req, res) => {
    try {
      const m = await Merchant.findByPk(req.params.id);
      if (!m) return res.status(404).json({ error: 'Merchant non trouvé' });
      res.json(m);
    } catch (err) {
      console.error('[MERCHANTS GET]', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// PUT /merchants/:id
// Merchant peut mettre à jour ses infos (companyName, kbis, redirect, currency...), admin idem
router.put('/:id', authenticateToken, authorizeUserAccess,
  async (req, res) => {
    try {
      const m = await Merchant.findByPk(req.params.id);
      if (!m) return res.status(404).json({ error: 'Merchant non trouvé' });

      const {
        companyName,
        kbis,
        redirect_success,
        redirect_cancel,
        currency
      } = req.body;

      await m.update({ companyName, kbis, redirect_success, redirect_cancel, currency });
      res.json(m);
    } catch (err) {
      console.error('[MERCHANTS PUT]', err);
      res.status(400).json({ error: 'Données invalides ou opération impossible' });
    }
  }
);

// GET /merchants/:id/credentials
// Récupère app_id / app_secret
router.get('/:id/credentials', authenticateToken, authorizeUserAccess,
  async (req, res) => {
    try {
      const m = await Merchant.findByPk(req.params.id);
      if (!m) return res.status(404).json({ error: 'Merchant non trouvé' });
      res.json({ app_id: m.app_id, app_secret: m.app_secret });
    } catch (err) {
      console.error('[MERCHANTS GET CRED]', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// POST /merchants/:id/credentials
// Génère et stocke de nouveaux app_id/app_secret
router.post('/:id/credentials', authenticateToken, authorizeUserAccess,
  async (req, res) => {
    try {
      const m = await Merchant.findByPk(req.params.id);
      if (!m) return res.status(404).json({ error: 'Merchant non trouvé' });

      const app_id     = uuidv4();
      const app_secret = crypto.randomBytes(32).toString('hex');
      await m.update({ app_id, app_secret });

      res.json({ app_id, app_secret });
    } catch (err) {
      console.error('[MERCHANTS POST CRED]', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// DELETE /merchants/:id
// Supprime un merchant (cascade sur ses paiements grâce à onDelete: 'CASCADE')
router.delete('/:id', authenticateToken, authorizeUserAccess,
  async (req, res) => {
    try {
      const m = await Merchant.findByPk(req.params.id);
      if (!m) return res.status(404).json({ error: 'Merchant non trouvé' });

      await m.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('[MERCHANTS DELETE]', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

module.exports = router;