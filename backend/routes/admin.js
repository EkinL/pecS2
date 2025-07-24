const express = require('express');
const router = express.Router();

const { User } = require('../models');

const authenticateToken = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');


router.patch('/:id/activate', authenticateToken, authorizeAdmin, async (req,res) => {
    const merchant = await User.findByPk(req.params.id);
    if (!merchant) return res.status(404).json({ error:'Non trouvé' });
    await merchant.update({ status:'ACTIVE' });
    res.json({ message:'Activé' });
});

module.exports = router;