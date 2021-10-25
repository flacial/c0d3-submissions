import express from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { handleImageUpload, handleJob, handleJobDone } from '../controllers/p7Controller.js';
import Utils from '../utils/utils.js';

const p7Router = express.Router();

const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (_, file, cb) => {
    cb(null, `${uuid()}`);
  },
});
const upload = multer({ storage });

p7Router.post('/imageAnalysis', upload.array('userImages'), handleImageUpload);
p7Router.get('/imageAnalysis/jobs/:jobId', handleJob);
p7Router.get('/imageAnalysis/jobs/state/:jobId', handleJobDone);
p7Router.get('/', (req, res) => res.sendFile(Utils.filePath('p7.html')));

export default p7Router;
