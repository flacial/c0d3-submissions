import express from 'express';
import MemesGen from '../controllers/memegen-controller.js';

const memesGen = new MemesGen();
const p3Router = express.Router();

p3Router.get('/memegen/api/:text', memesGen.handleMemesGen);

export default p3Router;
