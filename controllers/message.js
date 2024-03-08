const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.sendMessage = async (req, res, next) => {
  const { message, groupId } = req.body;
  const user = req.user;
  let messageResponse;
  try {
    if (groupId == 0) {
      messageResponse = await user.createMessage({
        text: message,
      });
    } else {
      messageResponse = await user.createMessage({
        text: message,
        groupId,
      });
    }
    const newMsg = {
      id: messageResponse.id,
      name: user.name,
      message: messageResponse.text,
    };
    console.log(newMsg);

    return res
      .status(200)
      .json({ newMsg, message: "Message saved to database succesfully" });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server error!" });
  }

};

exports.getMessage = (req, res, next) => {
  const user = req.user;
  const { lastMsgId } = req.query;
  let whereCondition = {};
  if (lastMsgId) {
    whereCondition = {
      id: {
        [Op.gt]: lastMsgId,
      },
    };
  }
  Message.findAll({
    where: whereCondition,
    include: { model: User, attributes: ["name", "id"] },
  })
    .then((data) => {
      const messages = data.map((msg) => ({
        id: msg.id,
        name: msg.user.name,
        message: msg.text,
        timestamp: msg.date_time,
        userId: msg.user.id,
      }));
      return res.json({ messages, user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch messages" });
    });
};
