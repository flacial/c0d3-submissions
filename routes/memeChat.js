import express from 'express';
import Utils from '../utils/utils.js';
import {
  handleLogin,
  renderSecurePage,
  handleMemeCreation,
  handleSendingAllMemes,
  handleSendingMeme,
} from '../controllers/memeChat-controller.js';

Utils.createDir('public/p9-memes');

const p9Router = express.Router();

const renderLoginPage = renderSecurePage({
  page: 'login',
  redirectTo: '/p9/memechat',
  directTo: 'p9-login.html',
});
const renderMemechatPage = renderSecurePage({
  page: 'memechat',
  redirectTo: '/p9/login',
  directTo: 'p9-memechat.html',
});

p9Router.get('/memechat', renderMemechatPage);
p9Router.post('/api/createMeme', handleMemeCreation);

p9Router.get('/login', renderLoginPage);
p9Router.post('/api/login', handleLogin);

p9Router.get('/api/meme/:userMeme', handleSendingMeme);
p9Router.get('/api/memes', handleSendingAllMemes);

export default p9Router;
