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

async function validateCard(req, res, next) {
  const { cardNumber, expMonth, expYear, cvc } = req.body;

  // 1) Présence
  if (!cardNumber || !expMonth || !expYear || !cvc) {
    return res.status(400).json({ error: 'cardNumber, expMonth, expYear et cvc sont requis' });
  }

  // 2) Format numérique
  if (!/^\d{12,19}$/.test(cardNumber)) {
    return res.status(400).json({ error: 'cardNumber doit contenir entre 12 et 19 chiffres' });
  }

  // Pas tous les mêmes chiffres
  if (/^(\d)\1+$/.test(cardNumber)) {
    return res.status(400).json({ error: 'cardNumber invalide' });
  }

  // Pas de séquence simple (1234... ou 4321...)
  const asc = '01234567890123456789';
  const desc = '98765432109876543210';
  if (asc.includes(cardNumber) || desc.includes(cardNumber)) {
    return res.status(400).json({ error: 'cardNumber invalide' });
  }

  // 3) Date d’expiration
  const month = parseInt(expMonth, 10);
  const year  = parseInt(expYear, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'expMonth invalide (1–12)' });
  }
  if (!/^\d{4}$/.test(String(expYear))) {
    return res.status(400).json({ error: 'expYear doit être sur 4 chiffres' });
  }
  const now = new Date();
  const currentYear  = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return res.status(400).json({ error: 'Carte expirée' });
  }
  if (year > currentYear + 10) {
    return res.status(400).json({ error: 'expYear trop éloigné' });
  }

  // 4) Détection du type de carte
  const cardTypes = [
    { name: 'VISA',       pattern: /^4\d{12}(\d{3})?(\d{3})?$/,                                              cvcLength: [3], lengths: [13, 16, 19] },
    { name: 'MASTERCARD', pattern: /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/,    cvcLength: [3], lengths: [16] },
    { name: 'AMEX',       pattern: /^3[47]\d{13}$/,                                                          cvcLength: [4], lengths: [15] },
    { name: 'DISCOVER',   pattern: /^6(?:011|5\d{2})\d{12}$/,                                                cvcLength: [3], lengths: [16] }
  ];

  const type = cardTypes.find(t => t.pattern.test(cardNumber));
  if (!type) {
    return res.status(400).json({ error: 'Type de carte non supporté' });
  }

  // Vérification de la longueur exacte pour ce type
  if (!type.lengths.includes(cardNumber.length)) {
    return res.status(400).json({ 
      error: `cardNumber doit faire ${type.lengths.join(' ou ')} chiffres pour une carte ${type.name}` 
    });
  }

  // 5) CVC
  if (!/^\d+$/.test(String(cvc))) {
    return res.status(400).json({ error: 'cvc doit contenir uniquement des chiffres' });
  }
  if (!type.cvcLength.includes(String(cvc).length)) {
    return res.status(400).json({ error: `cvc invalide pour une carte ${type.name}` });
  }

  // 6) Luhn
  if (!luhnCheck(cardNumber)) {
    return res.status(400).json({ error: 'Numéro de carte invalide (échec Luhn)' });
  }

  // Si tout est bon, on laisse passer
  next();
}

module.exports = validateCard;