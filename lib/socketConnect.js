// socketConnect.js
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { environment } from "../utils/environment.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [environment.CLIENT_URL, "http://localhost:5173"],
  },
});

export { app, io, httpServer };
