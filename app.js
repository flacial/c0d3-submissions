import express from 'express';
import session from 'express-session';
import Utils from './utils/utils.js';
import cdnRouter from './routes/cdn.js';
import ipGeolocation from './routes/ipGeolocation.js';
import commands from './routes/commands.js';
import memegen from './routes/memegen.js';
import assetCreation from './routes/assetCreation.js';
import chatroomUsingJwtAuth from './routes/chatroom-using-jwt-auth.js';
import authentication from './routes/authentication.js';
import imageTextExtraction from './routes/image-text-extraction.js';
import selfieQueen from './routes/selfie-queen.js';
import memeChat from './routes/memeChat.js';
import js6Router from './routes/js6.js';

const app = express();

app.use(
  session({
    secret: 'A great secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
      maxAge: 60000 * 60, // 1 minute = 60,000ms -> 60,000ms * 60 = 1hr
    },
  }),
);
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

app.options('/*', (_req, res) => res.set(Utils.CORS_HEADERS).sendStatus(200));
app.use('/*', (_req, res, next) => {
  res.set(Utils.CORS_HEADERS);
  return next();
});

app.get('/', (_req, res) => res.sendFile(Utils.filePath('main.html')));
app.use('/cdn', express.static('cdn'));
app.use('/p1', ipGeolocation);
app.use('/p2', commands);
app.use('/p3', memegen);
app.use('/p4', assetCreation);
app.use('/p5', chatroomUsingJwtAuth);
app.use('/auth', authentication);
app.use('/p7', imageTextExtraction);
app.use('/p8', selfieQueen);
app.use('/p9', memeChat);

app.use('/js6', js6Router);

// Allow the ability to link static content to HTML file
app.use('/js6Static', express.static('js6'));

export default app;
