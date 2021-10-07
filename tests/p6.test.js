/* eslint-disable max-len */
/* eslint-disable no-undef */
import request from 'supertest';
import router from '../app.js';
import { startServer, stopServer } from '../utils/server.utils.js';

describe('Test the root path', () => {
//   test('It should response the GET method', async () => {
//     const jwt = 'eyJhbGciOiJIUzI1NiJ9.dGVzdDI.5wKrkZm1ukFxP6BuYaCZ1UREc-A-aNTmkMA44ufGWAg';
//     const response = await request(router).get('/p6/api/session').set('Authorization', `Bearer ${jwt}`);
//     expect(response.body.jwt).toBe(jwt);
//   });

  beforeAll(startServer);
  //   afterAll(stopServer);

  it('It should response the GET method', () => request(router)
    .get('/')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});
