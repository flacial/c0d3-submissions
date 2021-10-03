import app from '../app.js';

export const startServer = () => new Promise((resolve, reject) => {
  const server = app.listen(8124);
  resolve(server);
});

export const stopServer = (server) => new Promise((resolve, _) => {
  server.stop(() => {
    resolve();
  });
});
