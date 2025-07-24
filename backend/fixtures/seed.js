// fixtures/seed.js
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose       = require('mongoose');
const sequelize      = require('../sequelize');
const { User, Merchant, Payment } = require('../models');
const UserMongo      = require('../models/user.mongo');
const MerchantMongo  = require('../models/merchant.mongo');
const PaymentMongo   = require('../models/payment.mongo');
const bcrypt         = require('bcrypt');

async function main() {
  console.log('🔄 Connexion à MongoDB…');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connecté');

  console.log('🔄 Sync PostgreSQL (force)…');
  await sequelize.sync({ force: true });
  console.log('✅ PostgreSQL synchronisé (tables recréées)');

  console.log('🔄 Purge des collections Mongo…');
  await Promise.all([
    UserMongo.deleteMany(),
    MerchantMongo.deleteMany(),
    PaymentMongo.deleteMany()
  ]);
  console.log('✅ MongoDB vidé');

  // --- Hash du mot de passe ---
  const plainPassword = 'secret';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // --- Création de 3 marchands ---
  console.log('🔄 Création des marchands…');
  const [m1, m2, m3] = await Promise.all([
    Merchant.create({type: "merchant", email: 'alex@gmail.com',   password: hashedPassword, companyName: 'ACME Corp',  kbis: 'KBIS001' }),
    Merchant.create({type: "merchant", email: 'lilian@gmail.com', password: hashedPassword, companyName: 'Globex Inc', kbis: 'KBIS002' }),
    Merchant.create({type: "merchant", email: 'emma@gmail.com',   password: hashedPassword, companyName: 'Initech',    kbis: 'KBIS003' }),
  ]);

  // --- Création de 3 utilisateurs clients ---
  console.log('🔄 Création des clients…');
  const [u1, u2, u3] = await Promise.all([
    User.create({ type: "client", email: 'baptiste@gmail.com', password: hashedPassword, firstName: 'Alice', lastName: 'Liddell' }),
    User.create({ type: "client", email: 'karl@gmail.com',     password: hashedPassword, firstName: 'Bob',   lastName: 'Marley'   }),
    User.create({ type: "client", email: 'pedro@gmail.com',    password: hashedPassword, firstName: 'Pedro', lastName: 'Odrep', role: 'ROLE_ADMIN' }),
  ]);

  // --- Création de paiements (10+ répartis) ---
  console.log('🔄 Création des paiements…');
  const paymentsData = [
    { seller_id: m1.id, buyer_id: u1.id, amount: 12.5, currency: 'EUR', stripe_id: 'STRIPE_001' },
    { seller_id: m1.id, buyer_id: u2.id, amount: 23.0, currency: 'USD', stripe_id: 'STRIPE_002' },
    { seller_id: m1.id, buyer_id: u3.id, amount: 8.75, currency: 'EUR', stripe_id: 'STRIPE_003' },
    { seller_id: m2.id, buyer_id: u1.id, amount: 15.0, currency: 'USD', stripe_id: 'STRIPE_004' },
    { seller_id: m2.id, buyer_id: u2.id, amount: 30.0, currency: 'GBP', stripe_id: 'STRIPE_005' },
    { seller_id: m2.id, buyer_id: u3.id, amount: 17.25, currency: 'JPY', stripe_id: 'STRIPE_006' },
    { seller_id: m3.id, buyer_id: u1.id, amount: 9.99, currency: 'CAD', stripe_id: 'STRIPE_007' },
    { seller_id: m3.id, buyer_id: u2.id, amount: 42.0, currency: 'EUR', stripe_id: 'STRIPE_008' },
    { seller_id: m3.id, buyer_id: u3.id, amount: 18.3, currency: 'USD', stripe_id: 'STRIPE_009' },
    { seller_id: m1.id, buyer_id: u1.id, amount: 11.0, currency: 'EUR', stripe_id: 'STRIPE_010' },
    { seller_id: m2.id, buyer_id: u2.id, amount: 25.5, currency: 'GBP', stripe_id: 'STRIPE_011' },
    { seller_id: m3.id, buyer_id: u3.id, amount: 6.6,  currency: 'USD', stripe_id: 'STRIPE_012' },
  ];

  await Payment.bulkCreate(paymentsData);

  console.log('✅ Fixtures appliquées avec succès !');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});