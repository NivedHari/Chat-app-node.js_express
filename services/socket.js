const socketService = (socket) => {
  socket.on("new-common-message", () => {
    socket.broadcast.emit("common-message", "new common message recieved");
  });
  socket.on("new-group-message", (groupId) => {
    socket.broadcast.emit("group-message", groupId);
  });
  socket.on("new-group-created", () => {
    socket.broadcast.emit("new-group-created");
  });
};

module.exports = socketService;
