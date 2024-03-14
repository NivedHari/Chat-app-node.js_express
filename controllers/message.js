const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");
const { uploadFile } = require("../services/s3");

exports.sendMessage = async (req, res, next) => {
  const { message, groupId, isImg } = req.body;
  const user = req.user;
  const isImage = isImg === "true";
  let messageResponse = null;
  let newMsg = null;

  try {
    if (groupId == 0) {
      if (isImage) {
        const imageFile = req.file;
        const result = await uploadFile(imageFile);
        messageResponse = await user.createMessage({
          text: message,
          isImg: true,
          imgUrl: result.Location,
        });
      } else {
        messageResponse = await user.createMessage({
          text: message,
        });
      }
    } else {
      if (isImage) {
        const imageFile = req.file;
        const result = await uploadFile(imageFile);
        messageResponse = await user.createMessage({
          text: message,
          isImg: true,
          imgUrl: result.Location,
          groupId,
        });
      } else {
        messageResponse = await user.createMessage({
          text: message,
          groupId,
        });
      }
    }
    if (isImage) {
      newMsg = {
        id: messageResponse.id,
        name: user.name,
        message: messageResponse.text,
        isImg: true,
        imgUrl: messageResponse.imgUrl,
      };
    } else {
      newMsg = {
        id: messageResponse.id,
        name: user.name,
        message: messageResponse.text,
      };
    }
    return res
      .status(200)
      .json({ newMsg, message: "Message saved to database succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getMessage = (req, res, next) => {
  const user = req.user;
  const { lastMsgId } = req.query;
  let whereCondition = {};
  if (lastMsgId) {
    whereCondition = {
      groupId: null,
      id: {
        [Op.gt]: lastMsgId,
      },
    };
  } else {
    whereCondition = {
      groupId: null,
    };
  }
  Message.findAll({
    where: whereCondition,
    include: { model: User, attributes: ["name", "id"] },
  })
    .then((data) => {
      console.log(data);
      const messages = data.map((msg) => {
        if (msg.isImg) {
          return {
            id: msg.id,
            name: msg.user.name,
            message: msg.text,
            timestamp: msg.date_time,
            userId: msg.user.id,
            isImg: true,
            imgUrl: msg.imgUrl,
          };
        } else {
          return {
            id: msg.id,
            name: msg.user.name,
            message: msg.text,
            timestamp: msg.date_time,
            userId: msg.user.id,
          };
        }
      });
      return res.json({ messages, user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch messages" });
    });
};
