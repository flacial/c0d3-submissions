import app from './app.js';
import startServer from './graphql/graphql.js';

const port = process.env.PORT || 8124;

startServer(port, app);
