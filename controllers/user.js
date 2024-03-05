const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  User.findOne({ where: { email: email } }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
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
          return res.status(201).json({
            user,
            message: "Your account has been created successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Account creation failed" });
        });
    });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!response) {
          return res.status(401).json({ message: "Incorrect password" });
        }
        res.status(200).json({
          message: "Login successful",
          token: generateToken(user.id, user.name, user.email, user.phone),
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
};

function generateToken(id, name, email, phone) {
  return jwt.sign(
    { userId: id, name: name, email: email, phone: phone },
    process.env.TOKEN
  );
}
