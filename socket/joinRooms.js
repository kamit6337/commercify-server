const joinRooms = (socket) => {
  socket.on("joinRooms", (roomIds) => {
    if (!roomIds || roomIds.length === 0) return;
    roomIds.map((roomId) => {
      console.log("room joined", roomId);
      socket.join(roomId);
    });
  });
};

export default joinRooms;
