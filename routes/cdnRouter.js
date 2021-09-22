import express from 'express';
import Utils from '../utils/utils.js'

const cdnRouter = express.Router();
cdnRouter.use(express.static('cdn'));

cdnRouter.get('/:file', (req, res) => {
    const { file } = req.params;

    return res.sendFile(Utils.filePath(file))
})

export default cdnRouter;