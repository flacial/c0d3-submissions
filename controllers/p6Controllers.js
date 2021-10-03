import validate from 'validator';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash/fp.js';
import Storage from '../utils/storage.js';

const { curry } = _;

const secret = 'you can never guess it';
const storage = new Storage('store', 'session', 'json');
const isUnique = async (condition, value) => {
  const unique = await storage.some(([id, creds]) => condition(id, creds, value));
  return !unique;
};

const emailCondition = (_, creds, prop) => creds.email === prop;
const isEmailUnique = curry(isUnique)(emailCondition);

const usernameCondition = (id, _, prop) => id === prop;
const isUsernameUnique = curry(isUnique)(usernameCondition);
const userDontExist = isUsernameUnique;

const createToken = (payload) => jwt.sign(payload, secret);
const encrypt = async (saltRounds, data) => bcrypt.hash(data, saltRounds);

const passwordLessThan5 = (password) => password.length < 5;
const usernameHasInvalidChars = (username) => !validate.isAlphanumeric(username);
const usernameExist = async (username) => !(await isUsernameUnique(username));
const emailHasInvalidChars = (email) => !validate.isEmail(email);
const emailExist = async (email) => !(await isEmailUnique(email));

// Can use compose here.
const areFieldsValid = async (username, password, email) => {
  switch (true) {
    case !username || !email || !password: return 'Missing required credentails. Make sure to include the username, email, and password';
    case passwordLessThan5(password): return 'Password must be 5 or more characters!';
    case usernameHasInvalidChars(username): return 'Username contains invalid characters. Only use Letters and Numbers';
    case await usernameExist(username): return 'Username already exist';
    case emailHasInvalidChars(email): return 'Email is invalid. Make sure to only use valid characters';
    case await emailExist(email): return 'Email already exist';
    default: return null;
  }
};

export const handleCreateUser = async (req, res) => {
  const {
    email, username, password, ...rest
  } = req.body;
  const uuid = uuid4();
  const decodedPassword = atob(password);

  const errorMessage = await areFieldsValid(username, decodedPassword, email);
  if (errorMessage) return res.status(400).send({ error: { message: errorMessage } });

  req.session.token = createToken(username);

  const passwordHash = await encrypt(10, decodedPassword);
  storage.add(username, { email, password: passwordHash, ...rest });

  return res.json({ id: uuid, email, username });
};

export const handleLoginUser = async (req, res) => {
  const { username, password } = req.body;

  if (await userDontExist(username)) return res.status(400).send({ error: { message: 'User does not exists' } });

  const { email, password: hash } = await storage.getValue(username);
  const decodedPassword = atob(password);
  const isSamePassword = await bcrypt.compare(decodedPassword, hash);

  if (isSamePassword) {
    const uuid = uuid4();
    req.session.token = createToken(username);
    return res.json({ id: uuid, email, username });
  }

  return res.status(400).json({ error: { message: 'Incorrect credentials' } });
};

export const handleJWT = async (req, res) => {
  const { token } = req.session;

  if (!token) return res.status(400).json({ error: { message: 'Access Denied' } });

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return res.status(400).json({ error: { message: 'Invalid token' } });

    const username = decoded;
    const user = await storage.getValue(username);

    if (user) {
      const { email } = user;
      const uuid = uuid4();
      return res.json({ id: uuid, username, email });
    }

    return res.status(500).json({ error: { message: "Token is valid but user doesn't exist" } });
  });
};

export const handleLogout = async (req, res) => {
  req.session.token = null;
  return res.sendStatus(200);
};
