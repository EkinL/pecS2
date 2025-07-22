const { Payment } = require('../models');

/**
 * Autorisation d'accès aux ressources users
 * - ROLE_ADMIN : accès total
 * - ROLE_USER : accès uniquement à son propre id
 * - ROLE_MERCHANT : accès à son propre id + aux users avec qui il a fait au moins 1 paiement en tant que seller
 */
async function authorizeUserAccess(req, res, next) {
    const { role, userId } = req;
    const targetId = req.params.id;

    // Admin → accès total
    if (role === 'ROLE_ADMIN') {
        return next();
    }

    // Self → user ou merchant accède à son propre profil
    if (targetId === userId) {
        return next();
    }

    // ROLE_USER ne peut pas accéder aux autres
    if (role === 'ROLE_USER') {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    // ROLE_MERCHANT peut accéder aux acheteurs avec lesquels il a une transaction
    if (role === 'ROLE_MERCHANT') {
        const payment = await Payment.findOne({
        where: {
            seller_id: userId,
            buyer_id:  targetId
        }
        });
        if (payment) {
        return next();
        }
        return res.status(403).json({ error: 'Accès refusé' });
    }

    // Par défaut
    return res.status(403).json({ error: 'Accès refusé' });
}

module.exports = authorizeUserAccess;