const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ArchivedMessage = sequelize.define(
  process.env.ARCHIVED_MESSAGE_TABLE,
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
    isImg: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    imgUrl: {
      type: Sequelize.STRING,
    },
    userId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    tableName: "archived-messages",
  }
);

module.exports = ArchivedMessage;
