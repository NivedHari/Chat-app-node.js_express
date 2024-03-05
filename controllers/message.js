const Message = require("../models/message");

exports.sendMessage = (req, res, next) => {
  const { message } = req.body;
  const user = req.user;
  user
    .createMessage({
      text: message,
    })
    .then(() => {
      res.status(200).json({ message: "Message sent successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to send message" });
    });
};
