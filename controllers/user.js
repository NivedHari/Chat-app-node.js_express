const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  User.findOne({ where: { email: email } }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      await User.create({
        name,
        email,
        phone,
        password: hash,
      })
        .then((user) => {
          return res.status(201).json({ user, message:"Your account has been created successfully" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Account creation failed" });
        });
    });
  });
};
