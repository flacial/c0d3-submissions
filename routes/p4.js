import express from "express";
import AssetCreation from '../controllers/p4Controller.js';
import path from 'path';

const dirname = path.resolve();

const p4Router = express.Router();
p4Router.use(express.static('public'));

const filePath = (pathName) => `${dirname}/public/${pathName}`;

p4Router.get("/", (req, res) => res.sendFile(filePath("p4.html")));

p4Router.post("/api/files", AssetCreation.handleFileCreation);

p4Router.get("/api/files", AssetCreation.handleFilesList);

p4Router.get("/api/files/:name", AssetCreation.handleFileContent);

export default p4Router;