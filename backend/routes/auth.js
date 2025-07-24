const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = jwt;
const authorizeAdmin = require("../middleware/authorizeAdmin");
const authenticateToken = require("../middleware/auth");

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

router.post("/register", async (req, res) => {
  // Vérif champ rempli 
  const { email, firstName, lastName, password, type, companyName, kbis } = req.body;
  if (!email || !password || !req.body.type) {
    return res.status(400).json({ error: "Tout les champs sont requis" });
  }
  if (type === 'merchant' && (!companyName || !kbis)) {
    return res.status(400).json({ error: 'companyName et kbis requis pour un marchand.' });
  }
  if (type === 'client'   && (!firstName  || !lastName)) {
    return res.status(400).json({ error: 'firstName et lastName requis pour un client.' });
  }
  // Vérif si mail existe
  try {
    const exists =  User.findOne({ where:{ email } });
    if (exists) {
      return res.status(400).json({ error: 'Email déjà utilisé' })
    }
  } catch (err) {
    console.error('[auth][register] erreur vérif email :', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
  
  try {
    const hash = await bcrypt.hash(password, 10);
    if (type === 'merchant') {
      const merchant = await User.create({
        email,
        password:   hash,
        companyName,
        kbis,
        role: 'ROLE_MERCHANT'
      });

      return res.status(201).json({
        id: merchant.id,
        role: merchant.role
      });
    } else if( type === 'client') {
      const user = await User.create({
        email,
        password: hash,
        firstName,
        lastName,
        role: 'ROLE_USER',
      });

      return res.status(201).json({
        id: user.id,
        role: user.role
      });

    } else {
      return res.status(400).json({ error: 'type doit être "merchant" ou "client".' })
    }
  } catch (err) {
    console.error('❌ Error in /user/new:', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail et mot de passe requis' })
  }

  try {
    let user
    // recherche client
    user = await User.findOne({ where:{ email } })
    if (user && await bcrypt.compare(password, user.password)) {
      return _issueTokens(user, res);
    }

    return res.status(401).json({ error: 'Identifiants invalides' })
  } catch (err) {
    console.error('[auth][login] erreur :', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken manquant" });
  }
  try {
    const { userId } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    let user = await User.findByPk(userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new Error("Token non reconnu");
    }

    const newAccess  = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const newRefresh = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshTokens = user.refreshTokens
      .filter(t => t !== refreshToken)
      .concat(newRefresh)
      .slice(-5);

    await user.save();
    return res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    console.error("[auth][refresh] erreur :", err);
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const data = user.toJSON();
    delete data.password;

    res.json(data);
  } catch (err) {
    console.error('[auth][me] erreur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/activate', authorizeAdmin, async (req,res) => {
  try {
    const { merchantId } = jwt.verify(req.query.token, process.env.JWT_SECRET);
    const merchant = await User.findByPk(merchantId);
    if (!merchant) return res.status(404).send('Compte non trouvé');
    await merchant.update({ status:'ACTIVE' });
    res.send('Compte activé !');
  } catch {
    res.status(400).send('Token invalide ou expiré.');
  }
});

// Retourne un token JWT et les infos utilisateur
async function _issueTokens(entity, res) {
  const payload = { userId: entity.id, role: entity.role };

  const accessToken  = jwt.sign(payload, JWT_SECRET,         { expiresIn: '30d' });
  const refreshToken = jwt.sign({ userId: entity.id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

  entity.refreshTokens = [...(entity.refreshTokens||[]), refreshToken];
  if (entity.refreshTokens.length > 1) entity.refreshTokens.shift();
  await entity.save();

  const userData = entity.toJSON();
  delete userData.password;

  return res.json({
    accessToken,
    refreshToken,
    user: userData
  });
}

module.exports = router;