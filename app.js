import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Utils from './utils/utils.js';
import p1Router from './routes/p1.js';
import p2Router from './routes/p2.js';
import p3Router from './routes/p3.js';
import p4Router from './routes/p4.js';

dotenv.config();

const router = express();
const rooms = {};

router.use(
  session({
    secret: 'A great secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  }),
);
router.use(express.static('public'));
router.use(express.json());

router.options('/*', (_req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization',
  }).sendStatus(200)
});

router.use('/*', (_req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization',
  })

  next()
})

router.get('/', (_req, res) => res.sendFile(Utils.filePath('main.html')));
router.use('/p1', p1Router);
router.use('/p2', p2Router);
router.use('/p3', p3Router);
router.use('/p4', p4Router);

router.use('/api/*', (req, _res, next) => {
  const auth = req.get('Authorization')
  const token = auth && auth.split(' ')[1]

  req.user = token;

  next()
})

router.get('/api/session', async (req, res) => {
  res.set('Cache-Control', 'max-age=1000')

  const userDataRes = await fetch('https://js5.c0d3.com/auth/api/session', {
    headers: {
      'Authorization': 'Bearer ' + req.user
    },
  })

  const userData = await userDataRes.json()

  if (userData.error) return res.json({ ...userData });
  return res.json({ ...userData });
})

router.get('/api/:room/messages', (req, res) => {  
  const { room }  = req.params;
  const messages = rooms[room]?.messages
  const reqBody = null

  if (messages) reqBody = messages

  return res.json(reqBody)
})

router.listen(process.env.PORT || 8124);
