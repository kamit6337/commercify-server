const newConnection = (socket) => {
  socket.on("isConnected", (arg, callback) => {
    console.log(arg);
    callback("Yeah, is connected");
  });
};

export default newConnection;
