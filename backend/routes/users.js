// routes/users.js
require('dotenv').config();
const express   = require('express');
const jwt       = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto    = require('crypto');
const { User }  = require('../models');
const authenticateToken    = require('../middleware/auth');
const authorizeUserAccess  = require('../middleware/authorize');
const authorizeMerchantOrAdmin = require('../middleware/authorizeMerchantOrAdmin');

const router = express.Router();

/**
 * GET /users
 * • Admin ↦ tous les users
 * • Marchand/Client ↦ uniquement soi-même
 */
router.get(
  '/',
  authenticateToken,
  authorizeUserAccess,
  async (req, res) => {
    try {
      const { role, userId } = req;
      if (role === 'ROLE_ADMIN') {
        const all = await User.findAll();
        return res.json(all);
      }
      const me = await User.findByPk(userId);
      return res.json([me]);
    } catch (err) {
      console.error('[USERS GET ALL]', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * GET /users/:id
 * • Admin ↦ n’importe quel user
 * • Marchand/Client ↦ uniquement soi-même
 */
router.get(
  '/:id',
  authenticateToken,
  authorizeUserAccess,
  async (req, res) => {
    try {
      const u = await User.findByPk(req.params.id);
      if (!u) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      return res.json(u);
    } catch (err) {
      console.error('[USERS GET]', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * PUT /users/:id
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeUserAccess,
  async (req, res) => {
    try {
      const u = await User.findByPk(req.params.id);
      if (!u) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const { firstName, lastName, email, companyName, kbis, status, redirect_success, redirect_cancel, currency } = req.body;

      if (email && email !== u.email) {
        const exists = await User.findOne({ where: { email } });
        if (exists && exists.id !== u.id) {
          return res.status(400).json({ error: 'Email déjà utilisé' });
        }
      }

      await u.update({ firstName, lastName, email, companyName, kbis, status, redirect_success, redirect_cancel, currency });

      return res.json(u);
    } catch (err) {
      console.error('[USERS PUT]', err);
      return res.status(400).json({ error: 'Données invalides ou opération impossible' });
    }
  }
);

/**
 * GET /users/:id/credentials
 */
router.get(
  '/:id/credentials',
  authenticateToken,
  authorizeUserAccess,
  authorizeMerchantOrAdmin,
  async (req, res) => {
    try {
      const u = await User.findByPk(req.params.id);
      if (!u) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      return res.json({ app_id: u.app_id, app_secret: u.app_secret });
    } catch (err) {
      console.error('[USERS GET CRED]', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * POST /users/:id/credentials
 */
router.post(
  '/:id/credentials',
  authenticateToken,
  authorizeUserAccess,
  authorizeMerchantOrAdmin,
  async (req, res) => {
    try {
      const u = await User.findByPk(req.params.id);
      if (!u) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const app_id     = uuidv4();
      const app_secret = crypto.randomBytes(32).toString('hex');
      await u.update({ app_id, app_secret });
      return res.json({ app_id, app_secret });
    } catch (err) {
      console.error('[USERS POST CRED]', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * DELETE /users/:id
 * • Admin ↦ peut supprimer n’importe qui
 * • Merchant/Client ↦ uniquement soi-même
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeUserAccess,
  async (req, res) => {
    try {
      const u = await User.findByPk(req.params.id);
      if (!u) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      await u.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error('[USERS DELETE]', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

module.exports = router;