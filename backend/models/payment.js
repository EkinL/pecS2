// models/payment.js
const { Model } = require("sequelize");
const PaymentMongo = require("./payment.mongo");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {}

  Payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
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
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED", "REFUNDED"),
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
  }, {
    sequelize,
    modelName: "Payment",
    tableName: "Payments",
    underscored: true,
    timestamps: true,
  });

  // Mongo après création
  Payment.addHook("afterCreate", async payment => {
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

  // Mongo après update
  Payment.addHook("afterUpdate", async payment => {
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

  // Mongo après suppression
  Payment.addHook("afterDestroy", async payment => {
    await PaymentMongo.findByIdAndDelete(payment.id);
  });

  return Payment;
};