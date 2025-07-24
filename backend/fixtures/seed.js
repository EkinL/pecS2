// fixtures/seed.js
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose       = require('mongoose');
const sequelize      = require('../sequelize');
const { User, Payment } = require('../models');
const UserMongo      = require('../models/user.mongo');
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
    PaymentMongo.deleteMany()
  ]);
  console.log('✅ MongoDB vidé');

  const passwordHash = await bcrypt.hash('secret', 10);

  console.log('🔄 Création des utilisateurs…');
  // Marchands
  const merchantPending = await User.create({
    firstName:    'Marc',
    lastName:     'Dupuis',
    email:        'marc.dupuis@shop.com',
    password:     passwordHash,
    role:         'ROLE_MERCHANT',
    companyName:  'Dupuis SAS',
    kbis:         'KBIS-MARC-001',
    status:       'PENDING'
  });
  const merchantActive = await User.create({
    firstName:    'Julie',
    lastName:     'Martin',
    email:        'julie.martin@ecom.com',
    password:     passwordHash,
    role:         'ROLE_MERCHANT',
    companyName:  'Ecom Solutions',
    kbis:         'KBIS-JUL-002',
    status:       'ACTIVE'
  });

  // Clients
  const clientAlice = await User.create({
    firstName: 'Alice',
    lastName:  'Liddell',
    email:     'alice@example.com',
    password:  passwordHash,
    role:      'ROLE_USER'
  });
  const clientBob = await User.create({
    firstName: 'Bob',
    lastName:  'Marley',
    email:     'bob@example.com',
    password:  passwordHash,
    role:      'ROLE_USER'
  });

  // Admin
  const admin = await User.create({
    firstName: 'Pedro',
    lastName:  'Ordep',
    email:     'pedro.admin@example.com',
    password:  passwordHash,
    role:      'ROLE_ADMIN'
  });

  console.log('✅ Utilisateurs créés :');
  console.log(' • Marchand PENDING:', merchantPending.id);
  console.log(' • Marchand ACTIVE :', merchantActive.id);
  console.log(' • Client Alice   :', clientAlice.id);
  console.log(' • Client Bob     :', clientBob.id);
  console.log(' • Admin Pedro    :', admin.id);

  // payment
  console.log('🔄 Création des paiements…');
  await Promise.all([
    Payment.create({
      seller_id:  merchantActive.id,
      buyer_id:   clientAlice.id,
      amount:     12.34,
      currency:   'EUR',
      stripe_id:  'STRIPE_1001'
    }),
    Payment.create({
      seller_id:  merchantActive.id,
      buyer_id:   clientBob.id,
      amount:     45.00,
      currency:   'USD',
      stripe_id:  'STRIPE_1002'
    })
  ]);
  console.log('✅ Paiements créés');

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});