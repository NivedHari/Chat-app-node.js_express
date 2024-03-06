const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const GroupMember = sequelize.define(
    process.env.GROUP_MEMBER_TABLE,
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = GroupMember;
