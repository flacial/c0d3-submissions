/* eslint-disable no-prototype-builtins */
/* eslint-disable import/extensions */
import express from 'express';
import Chatroom from '../controllers/p5Controller.js';

const p5Router = express.Router();
const chatRoom = new Chatroom();

p5Router.use('/api/*', chatRoom.handleUser);
p5Router.get('/api/session', chatRoom.handleSession);

p5Router.route('/api/:room/messages')
  .post(chatRoom.handleMessageCreation)
  .get(chatRoom.handleGettingMessages);

p5Router.get('/*', chatRoom.handleHome);

export default p5Router;
