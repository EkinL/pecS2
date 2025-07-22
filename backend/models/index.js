const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../sequelize"); // ← notre unique source de vérité

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Tables
db.User    = require("./user")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment")(sequelize, Sequelize.DataTypes);
db.Merchant = require("./merchant")(sequelize, Sequelize.DataTypes);

// Relations
db.Merchant.hasMany(db.Payment, {
  as:         'soldPayments',
  foreignKey: 'seller_id',
  onDelete:   'CASCADE',
});

// Un User (buyer) fait plusieurs achats
db.User.hasMany(db.Payment, {
  as:         'purchasedPayments',
  foreignKey: 'buyer_id',
  onDelete:   'CASCADE',
});

// Chaque paiement appartient à un Merchant (seller)
db.Payment.belongsTo(db.Merchant, {
  as:         'seller',
  foreignKey: 'seller_id',
});

// … et à un User (buyer)
db.Payment.belongsTo(db.User, {
  as:         'buyer',
  foreignKey: 'buyer_id',
});

module.exports = db;