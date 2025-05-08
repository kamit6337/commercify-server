import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { environment } from "../utils/environment.js";

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: environment.CLIENT_URL,
  },
});

const socketConnect = () => {
  return {
    app,
    io,
    httpServer,
  };
};

export default socketConnect;
