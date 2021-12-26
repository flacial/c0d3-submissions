import express from "express";
import Commands from "../controllers/commands-controller.js";
import Utils from "../utils/utils.js";

const commands = new Commands();
const p2Router = express.Router();

p2Router.use("/commands", (_req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type, Origin",
  });

  next();
});

p2Router.get("/commands", (_req, res) =>
  res.sendFile(Utils.filePath("p2.html"))
);

p2Router.post("/commands", commands.handleCommands);

export default p2Router;
