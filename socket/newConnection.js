const newConnection = (socket) => {
  socket.on("isConnected", (arg) => {
    console.log(arg);
  });
};

export default newConnection;
