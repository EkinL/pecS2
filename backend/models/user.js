// models/user.js
const { Model } = require("sequelize");
const UserMongo = require("./user.mongo");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    //   User.hasMany(models.Payment, { foreignKey: "user_id" });
    // }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName:      { type: DataTypes.STRING, allowNull: false },
    lastName:       { type: DataTypes.STRING, allowNull: false },
    email:          {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password:       { type: DataTypes.STRING, allowNull: false },
    role:           {
      type: DataTypes.ENUM("ROLE_USER","ROLE_ADMIN","ROLE_MERCHANT"),
      defaultValue: "ROLE_USER",
    },
    // Merchant
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kbis: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE'),
      allowNull: true,
    },
    app_id:         { type: DataTypes.UUID, allowNull: true, unique: true },
    app_secret:     { type: DataTypes.STRING, allowNull: true },
    refreshTokens:  {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    createdAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    modelName: "User",
    tableName: "Users",
    underscored: true,
  });

  // Réplication en Mongo après création
  User.addHook("afterCreate", async (user) => {
    await UserMongo.create({
      _id:           user.id,
      firstName:     user.firstName,
      lastName:      user.lastName,
      companyName:   user.companyName,
      kbis:          user.kbis,
      status:        user.status,
      email:         user.email,
      password:      user.password,
      role:          user.role,
      app_id:        user.app_id,
      app_secret:    user.app_secret,
      refreshTokens: user.refreshTokens,
      createdAt:     user.createdAt,
      updatedAt:     user.updatedAt,
    });
  });

  // Réplication en Mongo après modification
  User.addHook("afterUpdate", async (user) => {
    await UserMongo.findByIdAndUpdate(
      user.id,
      {
        firstName:     user.firstName,
        lastName:      user.lastName,
        companyName:   user.companyName,
        kbis:          user.kbis,
        status:        user.status,
        email:         user.email,
        password:      user.password,
        role:          user.role,
        app_id:        user.app_id,
        app_secret:    user.app_secret,
        refreshTokens: user.refreshTokens,
      },
      { new: true, runValidators: true }
    );
  });

  // Suppression en Mongo après destruction SQL
  User.addHook("afterDestroy", async (user) => {
    await UserMongo.findByIdAndDelete(user.id);
  });

  return User;
};