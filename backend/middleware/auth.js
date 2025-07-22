const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token manquant" });
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Format Authorization invalide" });
  }
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.userId = payload.userId;
    req.role   = payload.role;
    next();
  });
}

module.exports = authenticateToken;