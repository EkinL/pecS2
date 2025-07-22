// middleware/authorizePayment.js

const { Payment }      = require('../models');
const PaymentMongo     = require('../models/payment.mongo');

const ADMIN    = 'ROLE_ADMIN';
const MERCHANT = 'ROLE_MERCHANT';
const USER     = 'ROLE_USER';

/**
 * middleware pour autoriser l'accès des gens qui becte
 */
async function authorizePaymentAccess(req, res, next) {
  const { role, userId, method, params, body } = req;

  if (role === ADMIN) {
    return next();
  }

  if (method === 'POST') {
    if (role !== MERCHANT) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    req.body.seller_id = userId;
    return next();
  }

  if (method === 'GET' && !params.id) {
    if (role === MERCHANT) {
      req.scope = { where: { seller_id: userId } };
      return next();
    }
    if (role === USER) {
      req.scope = { where: { buyer_id: userId } };
      return next();
    }
    return res.status(403).json({ error: 'Accès refusé' });
  }

  const id = params.id;
  let rec;

  try {
    rec = await Payment.findByPk(id);
    if (rec) {
      const ok = (
        (role === MERCHANT && rec.seller_id === userId) ||
        (role === USER     && rec.buyer_id  === userId)
      );
      if (!ok) return res.status(403).json({ error: 'Accès refusé' });

      if (method === 'DELETE') {
        return res.status(403).json({ error: 'Accès refusé' });
      }
      return next();
    }
  } catch {}

  try {
    rec = await PaymentMongo.findById(id).exec();
    if (!rec) return res.status(404).json({ error: 'Paiement non trouvé' });
    const ok = (
      (role === MERCHANT && rec.seller_id === userId) ||
      (role === USER     && rec.buyer_id  === userId)
    );
    if (!ok) return res.status(403).json({ error: 'Accès refusé' });
    if (method === 'DELETE') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    return next();
  } catch {
    return res.status(400).json({ error: 'ID invalide' });
  }
}

module.exports = authorizePaymentAccess;