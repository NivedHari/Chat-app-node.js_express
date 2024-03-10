const { CronJob } = require("cron");
const { Op } = require("sequelize");
const Message = require("../models/message");
const ArchivedMessage = require("../models/archived-message");

exports.job = new CronJob(
  "0 0 * * *", // cronTime
  function () {
    archiveMessages();
    this.stop();
  }, // onTick
  null, // onComplete
  false, // start
  "Asia/Kolkata"
);

async function archiveMessages() {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oldMessages = await Message.findAll({
      where: {
        date_time: {
          [Op.lt]: oneDayAgo,
        },
      },
    });
    await Promise.all(
      oldMessages.map(async (message) => {
        await ArchivedMessage.create({
          id: message.id,
          message: message.text,
          date_time: message.date_time,
          isImg: message.isImg,
          imgUrl: message.imgUrl,
          userId: message.userId,
          groupId: message.groupId,
        });
        await message.destroy();
      })
    );
    console.log("Old Messages archived");
  } catch (err) {
    console.log("error in archiving the messages", err);
  }
}
