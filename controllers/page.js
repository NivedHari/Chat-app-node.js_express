const path = require("path");

exports.getStartingPage = (req, res, next) => {
  const filePath = path.join(__dirname, "..", "public", "frontPage.html");
  res.sendFile(filePath);
};
exports.getloginPage = (req, res, next) => {
  const filePath = path.join(__dirname, "..", "public", "signup.html");
  res.sendFile(filePath);
};
exports.getChatPage = (req, res, next) => {
  const filePath = path.join(__dirname, "..", "public", "main.html");
  res.sendFile(filePath);
};

exports.geterrorPage = (request, res, next) => {
  const filePath = path.join(__dirname, "..", "public", "notFound.html");
  res.sendFile(filePath);
};
