const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.sendMessage = (req, res, next) => {
  const { message } = req.body;
  const user = req.user;
  user
    .createMessage({
      text: message,
    })
    .then((message) => {
      const newMsg = {
        id: message.id,
        name: user.name,
        message: message.text,
      };
      res.status(200).json({ newMsg });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to send message" });
    });
};

exports.getMessage = (req, res, next) => {
  const { lastMsgId } = req.query;
  let whereCondition = {};
  if (lastMsgId) {
    whereCondition = {
      id: {
        [Op.lt]: lastMsgId,
      },
    };
  }
  Message.findAll({
    where: whereCondition,
    include: { model: User, attributes: ["name"] },
  })
    .then((data) => {
      const messages = data.map((msg) => ({
        id: msg.id,
        name: msg.user.name,
        message: msg.text,
      }));
      // console.log(messages);
      return res.json({ messages });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch messages" });
    });
};
