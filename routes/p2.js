import express from 'express';
import path from 'path';
import Commands from '../controllers/p2Controller.js';

const commands = new Commands();
const p2Router = express.Router();

const filePath = (pathName) => `${dirname}/public/${pathName}`;
const dirname = path.resolve();

p2Router.use('/commands', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin,
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Origin',
  });

  next();
});

p2Router.get('/commands', (req, res) => res.sendFile(filePath('p2.html')));

p2Router.post('/commands', commands.handleCommands);

export default p2Router;
