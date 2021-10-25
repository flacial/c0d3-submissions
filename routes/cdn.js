import express from 'express';
import Utils from '../utils/utils.js';

const cdnRouter = express.Router();
cdnRouter.use(express.static('cdn'));

cdnRouter.get('/:file', (req, res) => res.sendFile(Utils.filePath(req.params.file)));

export default cdnRouter;
