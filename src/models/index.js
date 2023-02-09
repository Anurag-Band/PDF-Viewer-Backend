require("dotenv").config({
  path: "../../.env",
});

const { Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  "freedb_pdf-viewer-user", // Hard Coded because it's not taking from .env
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes);
db.file = require("./file.model.js")(sequelize, Sequelize, DataTypes);

// db.user.hasMany(db.file);
// db.file.belongsTo(db.user);

module.exports = db;
