import express from 'express';
import Utils from '../utils/utils.js';

const js6Router = express.Router();

// (/*)? used to allow the url to extend to /kanban and /stars
js6Router.get('/react-stars-and-kanban(/*)?', Utils.sendHTML('react-stars-and-kanban/index.html'));

export default js6Router;
