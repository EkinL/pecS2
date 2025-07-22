require('dotenv').config();
const express = require('express');
const jwt     = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { User } = require("../models");
const router  = express.Router();

const authenticateToken = require("../middleware/auth");
const authorizeUserAccess = require('../middleware/authorize');


const { JWT_SECRET } = process.env;

/**
 * GET /users
 * Récupère tous les users
 * Prendre le refresh token. Me demandez pas pourquoi ca me soûle
 */
router.get('/',authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('[USERS GET ALL]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /users/:id
 * Récupère un user par son UUID
 */
router.get('/:id',authenticateToken,authorizeUserAccess, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(u);
  } catch (err) {
    console.error('[USERS GET]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /users/:id
 * Met à jour un user : 
 * - merchant prend companyName, kbis, redirect_success, redirect_cancel, currency  
 * - client prend firstName, lastName
 */
router.put('/:id',authenticateToken,authorizeUserAccess, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (u.role === 'ROLE_MERCHANT') {
      const { companyName, kbis, redirect_success, redirect_cancel, currency } = req.body;
      await u.update({ companyName, kbis, redirect_success, redirect_cancel, currency });
    } else {
      const { firstName, lastName } = req.body;
      await u.update({ firstName, lastName });
    }

    res.json(u);
  } catch (err) {
    console.error('[USERS PUT]', err);
    res.status(400).json({ error: 'Données invalides ou opération impossible' });
  }
});

/**
 * GET /users/:id/credentials
 * Récupère app_id / app_secret
 */
router.get('/:id/credentials',authenticateToken,authorizeUserAccess, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ app_id: u.app_id, app_secret: u.app_secret });
  } catch (err) {
    console.error('[USERS GET CRED]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /users/:id/credentials
 * Génère et stocke de nouveaux app_id/app_secret
 */
router.post('/:id/credentials',authenticateToken,authorizeUserAccess, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const app_id     = uuidv4();
    const app_secret = crypto.randomBytes(32).toString('hex');

    await u.update({ app_id, app_secret });
    res.json({ app_id, app_secret });
  } catch (err) {
    console.error('[USERS POST CRED]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /users/:id
 * Supprime un user gneu gneu
 */
router.delete('/:id',authenticateToken, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await u.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('[USERS DELETE]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;