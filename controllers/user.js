const User = require("../models/user");
const Group = require("../models/group");
const Message = require("../models/message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

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

exports.getAllUsers = (req, res, next) => {
  const user = req.user;
  User.findAll({
    attributes: ["id", "name"],
    where: {
      id: {
        [Op.not]: user.id,
      },
    },
  })
    .then((users) => {
      return res.status(200).json({ users });
      // console.log(users);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createGroup = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, membersNo, membersIds } = req.body;
    membersIds.push(user.id);
    console.log("Name:", name);
    console.log("members:", membersNo);
    console.log("ids:", membersIds);
    const group = await user.createGroup({
      name,
      members: membersNo,
      AdminId: user.id,
    });
    await group.addUsers(
      membersIds.map((ele) => {
        return Number(ele);
      })
    );
    return res
      .status(200)
      .json({ group, message: "Group is succesfylly created" });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllgroups = async (request, response, next) => {
  try {
    const groups = await Group.findAll();
    return response
      .status(200)
      .json({ groups, message: "All groups succesfully fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getMyGroups = async (req, res, next) => {
  const user = req.user;
  const groups = await user.getGroups();
  return res
    .status(200)
    .json({ groups, message: "All groups succesfully fetched" });
};

exports.getGroup = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    res
      .status(200)
      .json({ group, message: "Group details succesfully fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getGroupMessages = async (req, res, next) => {
  const { groupId } = req.query;
  const groupMessages = await Message.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
    ],
    order: [["date_time", "ASC"]],
    where: {
      GroupId: Number(groupId),
    },
  });
  const messages = groupMessages.map((message) => {
    const user = message.user;
    if (user) {
      return {
        id: message.id,
        name: user.name,
        userId: user.id,
        message: message.text,
      };
    }
  });
  return res
    .status(200)
    .json({ messages, message: "User chat History Fetched" });
};

function generateToken(id, name, email, phone) {
  return jwt.sign(
    { userId: id, name: name, email: email, phone: phone },
    process.env.TOKEN
  );
}

// const newMsg = {
//   id: messageResponse.id,
//   name: user.name,
//   message: messageResponse.text,
// };
