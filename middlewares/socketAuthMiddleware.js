import Req from "../lib/Req.js";

const socketAuthMiddleware = async (socket, next) => {
  try {
    // const token = socket.handshake.auth.token?.split(" ")[1];

    const findUser = await Req(socket.handshake, true);

    socket.user = findUser;
    socket.userId = findUser._id.toString();

    next();
  } catch (error) {
    return next(error);
  }
};

export default socketAuthMiddleware;
