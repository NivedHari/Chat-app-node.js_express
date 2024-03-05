const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const sequelize = require("./util/database");

const User = require("./models/user");
const Message = require("./models/message");

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/message", messageRoutes);

User.hasMany(Message);
Message.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

const PORT = process.env.PORT;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((err) => console.log(err));
