const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Message = sequelize.define(process.env.MESSAGE_TABLE, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: Sequelize.STRING,
});

module.exports = Message;
