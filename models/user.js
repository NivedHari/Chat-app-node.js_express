const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define(process.env.USER_TABLE, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: Sequelize.STRING,
});

module.exports = User;
