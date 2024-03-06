const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Message = sequelize.define(
  process.env.MESSAGE_TABLE,
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    text: Sequelize.STRING,
    date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    tableName: 'messages' 
  }
);


module.exports = Message;
