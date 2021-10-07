/* eslint-disable no-shadow */
import express from 'express';
import {
  handleRegister, handleLogin, handleAuth,
} from '../controllers/p6Controllers.js';

const p6Router = express.Router();

p6Router.post('/api/users', handleRegister);
p6Router.post('/api/session', handleLogin);
p6Router.get('/api/session', handleAuth);

export default p6Router;
