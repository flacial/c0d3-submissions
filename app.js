/* eslint-disable import/extensions */
import express from 'express';
import session from 'express-session';
import Utils from './utils/utils.js';
import p1Router from './routes/p1.js';
import p2Router from './routes/p2.js';
import p3Router from './routes/p3.js';
import p4Router from './routes/p4.js';
import p5Router from './routes/p5.js';
import p6Router from './routes/p6.js';
import p7Router from './routes/p7.js';
import cdnRouter from './routes/cdn.js';

const router = express();

router.use(
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
router.use(express.static('public'));
router.use(express.json());

router.options('/*', (_req, res) => res.set(Utils.CORS_HEADERS).sendStatus(200));
router.use('/*', (_req, res, next) => {
  res.set(Utils.CORS_HEADERS);
  return next();
});

router.get('/', (_req, res) => res.sendFile(Utils.filePath('main.html')));
router.use('/p1', p1Router);
router.use('/p2', p2Router);
router.use('/p3', p3Router);
router.use('/p4', p4Router);
router.use('/p5', p5Router);
router.use('/auth', p6Router);
router.use('/cdn', cdnRouter);
router.use('/p7', p7Router);

export default router;
