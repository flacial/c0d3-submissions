import express from 'express';
import validate from 'validator';
import Storage from '../utils/storage.js';

const p6Router = express.Router();

const storage = new Storage('store', 'session', 'json');
const handleError = (code, message, res) => res.status(code).json({ error: { message } });

// p6Router.post('/api/users', (req, res) => {
//   const {
//     username, fullname, email, password,
//   } = req.body;

//   if (!username || !email || !password) return res.status(400).json({ error: { message: 'The credentials are not correct.' } });

//   if (password.length < 5) return handleError(400, 'Password must be 5 or more characters!', res);
//   if (!validate.isAlphanumeric(username)) return handleError(400, 'Username contains invalid characters. Only use Letters and Numbers');
//   if (!validate.isEmail(email) || storage.has(email)) return handleError(400, 'Email is invalid. Make sure to only use valid characters.');
// });

storage.add('user', {
  email: 'test@test.com', password: '1234', username: 'test', fullname: 'testtest',
});
storage.some(() => (1));
