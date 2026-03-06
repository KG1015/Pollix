import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import mongoose from "mongoose";
import { config } from "./config.js";
import { attachPollSocket } from "./PollSocketHandler.js";
import { getState, getHistory } from "./controllers/pollController.js";

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

const httpServer = createServer(app);

app.get("/api/state", getState);
app.get("/api/history", getHistory);

attachPollSocket(httpServer, config.corsOrigin);

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
  } catch (e) {
    console.error("DB connect failed:", e);
  }
  httpServer.listen(config.port, () => {
    console.log("Server on", config.port);
  });
}

start();
