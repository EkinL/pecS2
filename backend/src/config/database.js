require('dotenv').config();

module.exports = {
    host:     process.env.PG_HOST,
    port:     process.env.PG_PORT,
    database: process.env.PG_DB,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    dialect:  'postgres',
    logging:  false,
}