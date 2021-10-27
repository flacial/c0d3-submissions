import express from 'express';
import Utils from '../utils/utils.js';
import { handleSnap, handleSendingImage } from '../controllers/p8Controller.js';

const p8Router = express.Router();

p8Router.get('/', (_, res) => res.sendFile(Utils.filePath('p8.html')));
p8Router.post('/api/snap', handleSnap);
p8Router.get('/api/image/:imageId', handleSendingImage);

export default p8Router;
