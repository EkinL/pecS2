// middleware/validateCard.js
function luhnCheck(num) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }
  
  module.exports = function validateCard(req, res, next) {
    const { cardNumber, expMonth, expYear, cvc } = req.body;
  
    // 1) Présence
    if (!cardNumber || !expMonth || !expYear || !cvc) {
      return res.status(400).json({ error: 'cardNumber, expMonth, expYear et cvc sont requis' });
    }
  
    // 2) Format
    if (!/^\d{12,19}$/.test(cardNumber)) {
      return res.status(400).json({ error: 'cardNumber doit contenir 12 à 19 chiffres' });
    }
    const month = parseInt(expMonth, 10);
    const year  = parseInt(expYear, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'expMonth invalide (1–12)' });
    }
    const now = new Date();
    const currentYear  = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
      return res.status(400).json({ error: 'Carte expirée' });
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      return res.status(400).json({ error: 'cvc doit faire 3 ou 4 chiffres' });
    }
  
    // 3) Luhn
    if (!luhnCheck(cardNumber)) {
      return res.status(400).json({ error: 'Numéro de carte invalide' });
    }
  
    next();
  };