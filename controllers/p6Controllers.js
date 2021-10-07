import validate from 'validator';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import atob from 'atob';
import _ from 'lodash/fp.js';
import Storage from '../utils/storage.js';

const { curry } = _;

const secret = 'you can never guess it';
const storage = new Storage('store', 'session', 'json');

const isUnique = curry(async (condition, value) => {
  const unique = await storage.some(([id, creds]) => condition(id, creds, value));
  return !unique;
});

const isEmailUnique = isUnique((_, creds, prop) => creds.email === prop);
const isUsernameUnique = isUnique((id, _, prop) => id === prop);

const createToken = (payload) => jwt.sign({ payload }, secret, { expiresIn: 1000 * 60 * 5 });
const encrypt = async (saltRounds, data) => bcrypt.hash(data, saltRounds);

const areFieldsValid = async (username, password, email) => {
  switch (true) {
    case !username || !email || !password: return 'Missing required credentails. Make sure to include the username, email, and password';
    case password.length < 5: return 'Password must be longer than 5 characters!';
    case !validate.isAlphanumeric(username): return 'Username contains invalid characters. Only use Letters and Numbers';
    case !(await isUsernameUnique(username)): return 'Username already exist';
    case !validate.isEmail(email): return 'Email is invalid. Make sure to only use valid characters';
    case !(await isEmailUnique(email)): return 'Email already exist';
    default: return null;
  }
};

export const handleRegister = async (req, res) => {
  const {
    email, username, password, ...rest
  } = req.body;
  const id = uuid4();
  const decodedPassword = password && atob(password);

  const errorMessage = await areFieldsValid(username, decodedPassword, email);
  if (errorMessage) return res.status(400).send({ error: { message: errorMessage } });

  const token = createToken(username);

  const passwordHash = await encrypt(10, decodedPassword);
  storage.add(username, {
    id, email, password: passwordHash, token, ...rest,
  });

  return res.json({
    id, email, username, jwt: token,
  });
};

export const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (await isUsernameUnique(username)) return res.status(400).send({ error: { message: 'User does not exists' } });
  if (!password) return res.status(400).send({ error: { message: 'Passsword must not be empty' } });

  const { email, password: hash, id } = await storage.getValue(username);
  const decodedPassword = password && atob(password);
  const isSamePassword = await bcrypt.compare(decodedPassword, hash);

  if (isSamePassword) {
    return res.json({
      id, email, username, jwt: createToken(username),
    });
  }

  return res.status(400).json({ error: { message: 'Incorrect credentials' } });
};

export const verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return reject(new Error(400));

    const { payload: username } = decoded;
    const user = await storage.getValue(username);

    if (user) {
      const { email, id } = user;
      return resolve({ id, username, email });
    }

    return reject(new Error(400));
  });
});

export const handleAuth = async (req, res) => {
  try {
    const auth = req.get('authorization');
    const token = auth && auth.split(' ')[1];

    if (!token) return res.status(400).json({ error: { message: 'Access Denied' } });

    const user = await verifyToken(token);
    return res.json({ ...user, jwt: token });
  } catch (err) {
    return res.status(400).json({ error: { message: 'Invalid token' } });
  }
};
