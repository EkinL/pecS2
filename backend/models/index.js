const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User    = require("./user")(sequelize, DataTypes);
db.Payment = require("./payment")(sequelize, DataTypes);

// relation
db.User.hasMany(db.Payment, {
  as: 'purchasedPayments',
  foreignKey: 'buyer_id',
  onDelete: 'CASCADE',
});
db.User.hasMany(db.Payment, {
  as: 'soldPayments',
  foreignKey: 'seller_id',
  onDelete: 'CASCADE',
});
db.Payment.belongsTo(db.User, {
  as: 'buyer',
  foreignKey: 'buyer_id',
});
db.Payment.belongsTo(db.User, {
  as: 'seller',
  foreignKey: 'seller_id',
});

module.exports = db;