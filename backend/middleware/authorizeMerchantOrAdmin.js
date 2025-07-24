function authorizeMerchantOrAdmin(req, res, next) {
  const { role } = req;
  if (role === 'ROLE_MERCHANT' || role === 'ROLE_ADMIN') {
    return next();
  }
  return res.status(403).json({ error: 'Accès refusé' });
}

module.exports = authorizeMerchantOrAdmin;
