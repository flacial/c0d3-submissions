import express from 'express';
import path from 'path';
import session from 'express-session';
import p1Router from './routes/p1.js';
import p2Router from './routes/p2.js';
import p3Router from './routes/p3.js';

const router = express();
const dirname = path.resolve();

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

const filePath = (pathName) => `${dirname}/public/${pathName}`;

router.options('/*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Origin',
  });

  res.send('Set Headers');
});

router.get('/', (req, res) => res.sendFile(filePath('main.html')));
router.use('/p1', p1Router);
router.use('/p2', p2Router);
router.use('/p3', p3Router);

router.listen(process.env.PORT || 8124);
