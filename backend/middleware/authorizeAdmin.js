async function authorizeAdmin(req, res, next) {
    const { role, userId } = req;
    const targetId = req.params.id;

    if(role === 'ROLE_ADMIN') {
        return next();
    } else {
        return res.status(403).json({ error: 'Accès refusé' });
    }
}

module.exports = authorizeAdmin;