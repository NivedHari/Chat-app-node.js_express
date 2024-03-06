const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Group = sequelize.define(
    process.env.GROUP_TABLE,
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(50),
      unique: true,
      notEmpty: true,
    },
    members: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Group;
