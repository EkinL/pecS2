// backend/sequelize.js
const { Sequelize } = require('sequelize');
const dbConfig = require('./src/config/database');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host:      dbConfig.host,
    port:      dbConfig.port,
    dialect:   dbConfig.dialect,
    logging:   dbConfig.logging,
    define: {
      underscored: true,
      freezeTableName: false,
    },
  }
);

console.log('[⚙️ Sequelize]', {
    host: sequelize.config.host,
    port: sequelize.config.port,
    database: sequelize.config.database,
    username: sequelize.config.username
  });

module.exports = sequelize;