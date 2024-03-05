const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);

const PORT = process.env.PORT;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((err) => console.log(err));
