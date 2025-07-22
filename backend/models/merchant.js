// models/merchant.js
const { Model } = require("sequelize");
const MerchantMongo = require("./merchant.mongo");

module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    // Vous pouvez déclarer des associations statiques ici si besoin
    // static associate(models) { ... }
  }

  Merchant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kbis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ROLE_MERCHANT"),
      defaultValue: "ROLE_MERCHANT",
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    refreshTokens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    app_id: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
    },
    app_secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  }, {
    sequelize,
    modelName: "Merchant",
    tableName: "Merchants",
    underscored: true,
  });

  // Hook after creation → on réplique dans Mongo
  Merchant.addHook("afterCreate", async (merchant) => {
    await MerchantMongo.create({
      _id:           merchant.id,
      companyName:   merchant.companyName,
      kbis:          merchant.kbis,
      email:         merchant.email,
      password:      merchant.password,
      role:          merchant.role,
      status:        merchant.status,
      refreshTokens: merchant.refreshTokens,
      app_id:        merchant.app_id,
      app_secret:    merchant.app_secret,
      createdAt:     merchant.createdAt,
      updatedAt:     merchant.updatedAt,
    });
  });

  // Hook after update → on met à jour dans Mongo
  Merchant.addHook("afterUpdate", async (merchant) => {
    await MerchantMongo.findByIdAndUpdate(
      merchant.id,
      {
        companyName:   merchant.companyName,
        kbis:          merchant.kbis,
        email:         merchant.email,
        password:      merchant.password,
        role:          merchant.role,
        status:        merchant.status,
        refreshTokens: merchant.refreshTokens,
        app_id:        merchant.app_id,
        app_secret:    merchant.app_secret,
        updatedAt:     merchant.updatedAt,
      },
      { new: true, runValidators: true }
    );
  });

  // Hook after destroy → on supprime dans Mongo
  Merchant.addHook("afterDestroy", async (merchant) => {
    await MerchantMongo.findByIdAndDelete(merchant.id);
  });

  return Merchant;
};