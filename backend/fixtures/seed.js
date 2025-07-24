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

  // --- Création de deux marchands ---
  console.log('🔄 Création des marchands…');
  const [m1, m2] = await Promise.all([
    Merchant.create({type: "merchant", email: 'alex@gmail.com', password: hashedPassword, companyName: 'ACME Corp', kbis: 'KBIS001' }),
    Merchant.create({type: "merchant", email: 'lilian@gmail.com', password: hashedPassword, companyName: 'Globex Inc', kbis: 'KBIS002' }),
  ]);

  // --- Création de trois utilisateurs “clients” ---
  console.log('🔄 Création des clients…');
  const [u1, u2, u3] = await Promise.all([
    User.create({ type: "client", email: 'baptiste@gmail.com', password: hashedPassword, firstName: 'Alice', lastName: 'Liddell' }),
    User.create({ type: "client", email: 'karl@gmail.com', password: hashedPassword, firstName: 'Bob',   lastName: 'Marley'   }),
    User.create({ type: "client", email: 'Pedro@gmail.com', password: hashedPassword, firstName: 'Perdo', lastName: 'Odrep', role: 'ROLE_ADMIN' }),
  ]);

  // --- Création de quelques paiements ---
  console.log('🔄 Création des paiements…');
  await Promise.all([
    Payment.create({ seller_id: m1.id, buyer_id: u1.id, amount: 10.5, currency: 'EUR', stripe_id: 'STRIPE_001' }),
    Payment.create({ seller_id: m1.id, buyer_id: u2.id, amount: 20.0, currency: 'USD', stripe_id: 'STRIPE_002' }),
    Payment.create({ seller_id: m2.id, buyer_id: u1.id, amount: 15.75, currency: 'GBP', stripe_id: 'STRIPE_003' }),
    Payment.create({ seller_id: m2.id, buyer_id: u2.id, amount:  5.0, currency: 'JPY', stripe_id: 'STRIPE_004' }),
  ]);

  console.log('✅ Fixtures appliquées avec succès !');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});