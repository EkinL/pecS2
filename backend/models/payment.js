// models/payment.js
const { Model } = require("sequelize");
const PaymentMongo = require("./payment.mongo");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    // Si besoin, vous pouvez déclarer des associations ici
    // static associate(models) { ... }
  }

  Payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Merchants", key: "id" },
      onDelete: "CASCADE",
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["USD", "EUR", "GBP", "JPY"]],
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    stripe_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9_-]+$/,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  }, {
    sequelize,
    modelName: "Payment",
    tableName: "Payments",
    underscored: true,
  });

  // Réplication dans Mongo après création
  Payment.addHook("afterCreate", async (payment) => {
    await PaymentMongo.create({
      _id:       payment.id,
      seller_id: payment.seller_id,
      buyer_id:  payment.buyer_id,
      amount:    payment.amount,
      currency:  payment.currency,
      status:    payment.status,
      stripe_id: payment.stripe_id,
    });
  });

  // Réplication dans Mongo après modification
  Payment.addHook("afterUpdate", async (payment) => {
    await PaymentMongo.findByIdAndUpdate(
      payment.id,
      {
        seller_id: payment.seller_id,
        buyer_id:  payment.buyer_id,
        amount:    payment.amount,
        currency:  payment.currency,
        status:    payment.status,
        stripe_id: payment.stripe_id,
      },
      { new: true, runValidators: true }
    );
  });

  // Suppression dans Mongo après destruction SQL
  Payment.addHook("afterDestroy", async (payment) => {
    await PaymentMongo.findByIdAndDelete(payment.id);
  });

  return Payment;
};