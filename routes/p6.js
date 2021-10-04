/* eslint-disable no-shadow */
import express from 'express';
import {
  handleRegister, handleLogin, handleJWT, handleLogout,
} from '../controllers/p6Controllers.js';

const p6Router = express.Router();

p6Router.post('/api/users', handleRegister);
p6Router.post('/api/session', handleLogin);
p6Router.get('/api/session', handleJWT);
p6Router.delete('/api/session', handleLogout);

export default p6Router;
