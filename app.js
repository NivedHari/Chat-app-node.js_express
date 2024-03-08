const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");

const sequelize = require("./util/database");

const User = require("./models/user");
const Message = require("./models/message");
const Group = require("./models/group");
const GroupMember = require("./models/group-member");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const pageRoutes = require("./routes/page");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use(pageRoutes);

User.hasMany(Message);
Message.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
});

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });
Group.belongsTo(User, {
  foreignKey: "AdminId",
  constraints: true,
  onDelete: "CASCADE",
});
Group.hasMany(Message);
Message.belongsTo(Group);

const PORT = process.env.PORT;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((err) => console.log(err));
