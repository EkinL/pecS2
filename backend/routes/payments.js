// routes/payments.js
const express                = require('express');
const router                 = express.Router();
const { Payment }            = require('../models');
const PaymentMongo           = require('../models/payment.mongo');
const authenticateToken      = require('../middleware/auth');
const authorizePaymentAccess = require('../middleware/authorizePaymentAccess');
const valideCard             = require('../middleware/valideCard');

const {
  ADMIN,
  MERCHANT,
  USER
} = require('../middleware/authorizePaymentAccess');

/**
 * GET /payments
 */
router.get(
  '/',
  authenticateToken,
  authorizePaymentAccess,
  async (req, res) => {
    const { role, scope } = req;

    try {
      const all = role === ADMIN ? await Payment.findAll() : await Payment.findAll(scope);
      return res.json(all);
    } catch (err) {
      console.warn('[PAYMENTS GET ALL] SQL error, fallback Mongo', err);
    }

    const filter   = scope?.where || {};
    const allMongo = await PaymentMongo.find(filter).exec();
    return res.json(allMongo);
  }
);

/**
 * GET /payments/:id
 */
router.get(
  '/:id',
  authenticateToken,
  authorizePaymentAccess,
  async (req, res) => {
    const { id }         = req.params;
    const { role, userId } = req;

    try {
      const p = await Payment.findByPk(id);
      if (p) {
        const ok = role === ADMIN
          || (role === MERCHANT && p.seller_id === userId)
          || (role === USER     && p.buyer_id  === userId);
        if (!ok) return res.status(403).json({ error: 'Accès refusé' });
        return res.json(p);
      }
    } catch {}

    try {
      const pMongo = await PaymentMongo.findById(id).exec();
      if (!pMongo) return res.status(404).json({ error: 'Paiement non trouvé' });

      const okMongo = role === ADMIN
        || (role === MERCHANT && pMongo.seller_id === userId)
        || (role === USER     && pMongo.buyer_id  === userId);
      if (!okMongo) return res.status(403).json({ error: 'Accès refusé' });
      return res.json(pMongo);
    } catch {
      return res.status(400).json({ error: 'ID invalide' });
    }
  }
);

/**
 * POST /payments
 * Seul le marchand (ou admin) peut créer
 */
router.post(
  '/',
  authenticateToken,
  valideCard,
  async (req, res) => {
    const { role, userId } = req;
    if (![MERCHANT, ADMIN].includes(role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { buyer_id, amount, currency, stripe_id } = req.body;
    if (!buyer_id || amount == null || !currency || !stripe_id) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const payload = { seller_id: userId, buyer_id, amount, currency, stripe_id };

    try {
      const p = await Payment.create(payload);
      return res.status(201).json(p);
    } catch (err) {
      const isUUIDError = err.name === 'SequelizeDatabaseError' && err.parent?.code === '22P02';
      if (!isUUIDError) {
        console.error('❌ [PAYMENTS POST] SQL Error:', err);
        return res.status(500).json({ error: 'Erreur SQL', detail: err.message });
      }
      console.warn('[PAYMENTS POST] SQL UUID error, fallback Mongo');
    }

    try {
      const pMongo = await PaymentMongo.create(payload);
      return res.status(201).json(pMongo);
    } catch (mErr) {
      console.error('❌ [PAYMENTS POST] Mongo Error:', mErr);
      return res.status(500).json({ error: 'Erreur création', detail: mErr.message });
    }
  }
);

/**
 * PUT /payments/:id
 * Seul le marchand (sur sa vente) ou admin peut mettre à jour le status
 */
router.put(
  '/:id',
  authenticateToken,
  async (req, res) => {
    const { id }         = req.params;
    const { role, userId } = req;
    const { status }     = req.body;

    if (![MERCHANT, ADMIN].includes(role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    try {
      const p = await Payment.findByPk(id);
      if (p && (role === ADMIN || p.seller_id === userId)) {
        await p.update({ status });
        return res.json(p);
      }
    } catch {}

    try {
      const filter = { _id: id, ...(role === MERCHANT ? { seller_id: userId } : {}) };
      const pMongo = await PaymentMongo.findOneAndUpdate(
        filter,
        { status },
        { new: true, runValidators: true }
      ).exec();
      if (!pMongo) {
        return res.status(404).json({ error: 'Paiement non trouvé ou accès refusé' });
      }
      return res.json(pMongo);
    } catch (mErr) {
      return res.status(400).json({ error: 'ID invalide', detail: mErr.message });
    }
  }
);

/**
 * DELETE /payments/:id
 * Seul l’admin peut supprimer
 */
router.delete(
  '/:id',
  authenticateToken,
  (req, res, next) => {
    if (req.role !== ADMIN) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    try {
      const p = await Payment.findByPk(id);
      if (p) {
        await p.destroy();
        return res.status(204).send();
      }
    } catch {
    }
    try {
      const pMongo = await PaymentMongo.findByIdAndDelete(id).exec();
      if (pMongo) return res.status(204).send();
      return res.status(404).json({ error: 'Paiement non trouvé' });
    } catch {
      return res.status(400).json({ error: 'ID invalide' });
    }
  }
);

/**
 * POST /payments/psp
 * Webhook PSP
 */
router.post(
  '/psp',
  async (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: 'id et status sont requis' });
    }

    try {
      const p = await Payment.findByPk(id);
      if (p) {
        await p.update({ status });
        return res.json(p);
      }
    } catch (err) {
      console.warn('[WEBHOOK PSP] SQL error, fallback Mongo', err);
    }

    try {
      const pMongo = await PaymentMongo.findOneAndUpdate(
        { _id: id },
        { status },
        { new: true, runValidators: true }
      ).exec();
      if (pMongo) {
        return res.json(pMongo);
      }
    } catch (err) {
      console.error('[WEBHOOK PSP] Mongo Error', err);
      return res.status(500).json({ error: 'Erreur MongoDB', detail: err.message });
    }

    return res.status(404).json({ error: 'Paiement non trouvé' });
  }
);

module.exports = router;