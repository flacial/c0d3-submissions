import express from 'express';
import Visitors from '../controllers/p1Controller.js';

const VisitorsC = new Visitors();

const p1Router = express.Router();

p1Router.get('/visitors', VisitorsC.handleIpLocation);
p1Router.get('/visitors/city/:cityName', VisitorsC.handlePrevLocation);

export default p1Router;
