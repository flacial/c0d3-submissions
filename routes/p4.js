import express from "express";
import AssetCreation from '../controllers/p4Controller.js';
import Utils from "../utils/utils.js";

const p4Router = express.Router();
const assetCreation = new AssetCreation(3 * 1000, './temp/')

p4Router.use(express.static('public'));
p4Router.get("/", (_req, res) => res.sendFile(Utils.filePath("p4.html")));
p4Router.post("/api/files", assetCreation.handleFileCreation);
p4Router.get("/api/files", assetCreation.handleFilesList);
p4Router.get("/api/files/:name", assetCreation.handleFileContent);

export default p4Router;