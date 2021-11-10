import express from 'express';
import session from 'express-session';
import Utils from './utils/utils.js';
import cdnRouter from './routes/cdn.js';
import p1Router from './routes/p1.js';
import p2Router from './routes/p2.js';
import p3Router from './routes/p3.js';
import p4Router from './routes/p4.js';
import p5Router from './routes/p5.js';
import p6Router from './routes/p6.js';
import p7Router from './routes/p7.js';
import p8Router from './routes/p8.js';
import p9Router from './routes/p9.js';

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
app.use('/cdn', cdnRouter);
app.use('/p1', p1Router);
app.use('/p2', p2Router);
app.use('/p3', p3Router);
app.use('/p4', p4Router);
app.use('/p5', p5Router);
app.use('/auth', p6Router);
app.use('/p7', p7Router);
app.use('/p8', p8Router);
app.use('/p9', p9Router);

export default app;
