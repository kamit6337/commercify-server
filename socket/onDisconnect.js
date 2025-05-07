const onDisconnect = (socket) => {
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  });
};

export default onDisconnect;
