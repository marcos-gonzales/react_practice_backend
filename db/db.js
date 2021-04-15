require('dotenv').config();
const Sequelize = require('sequelize');
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // for Heroku
  sequelize = new Sequelize(
    process.env.JAWSDB_DB,
    process.env.JAWSDB_USERNAME,
    process.env.JAWSDB_PASSWORD,
    {
      host: process.env.JAWSDB_HOST,
      dialect: 'mysql',
      logging: true,
    }
  );
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'mysql',
      host: 'localhost',
      define: { freezeTableName: true },
    }
  );
}

module.exports = sequelize;
