import router from './app.js';

const port = 8124;
router.listen(process.env.PORT || port, () => console.log(`Running on port ${port}`));
