import request from 'supertest';
import app from '../app.js';
import { deleteTest } from '../utils/test.utils.js';

const deleteSessionFile = () => deleteTest('session.json');

const authUsersPath = '/auth/api/users';
const authSessionPostPath = '/auth/api/session';

const mockUser = {
  username: 'test',
  email: 'test@test.com',
  password: 'test123',
  invalidUsername: 'test#@$',
  invalidEmail: 'test.com',
  invalidPassword: 'tes',
};

const {
  username, email, password, invalidUsername, invalidEmail, invalidPassword,
} = mockUser;

const authMissingCredsErr = 'Missing required credentails. Make sure to include the username, email, and password';
const authPasswordErr = 'Password must be longer than 5 characters!';
const authEmailErr = 'Email is invalid. Make sure to only use valid characters';
const authUsernameErr = 'Username contains invalid characters. Only use Letters and Numbers';
const authNoAuthHeaderErr = 'Access Denied';
const authIncorrectJWT = 'Invalid token';

describe('Users POST :: /auth/api/users', () => {
  it(`should send username only and respond with code 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ username })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send password only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ password })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send email only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send username and password only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ username, password })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error?.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send username and email only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ username, email })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send email and password only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email, password })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send email and password only and respond with 400 - ${authMissingCredsErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email, password })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authMissingCredsErr);

        done();
      });
  });

  it(`should send invalidPassword along with valid creds and respond with 400 - ${authPasswordErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email, password: invalidPassword, username })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authPasswordErr);

        done();
      });
  });

  it(`should send invalidEmail along with valid creds and respond with 400 - ${authEmailErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email: invalidEmail, password, username })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authEmailErr);

        done();
      });
  });

  it(`should send invalidUsername along with valid creds and respond with 400 - ${authUsernameErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ email, password, username: invalidUsername })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authUsernameErr);

        done();
      });
  });

  it('should respond with user credentials and statusCode 200', (done) => {
    expect.assertions(2);

    request(app)
      .post(authUsersPath)
      .send({ username, email, password })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            id: expect.any(String),
            jwt: expect.any(String),
          }),
        );

        done();
      });
  });

  afterAll(deleteSessionFile);
});

describe('Session POST :: /auth/api/session', () => {
  it('should respond with code 400 - "User does not exists"', (done) => {
    expect.assertions(2);

    request(app)
      .post(authSessionPostPath)
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error?.message).toEqual('User does not exists');

        done();
      });
  });

  it('should respond with code 200 and return user credentials', (done) => {
    expect.assertions(2);

    request(app)
      .post(authSessionPostPath)
      .send({ username, password })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            id: expect.any(String),
            jwt: expect.any(String),
          }),
        );

        done();
      });
  });

  afterAll(deleteSessionFile);
});

describe('Session GET :: /auth/api/session', () => {
  it(`should not set Authorization header and respond with code 400 - ${authNoAuthHeaderErr}`, (done) => {
    expect.assertions(2);

    request(app)
      .get(authSessionPostPath)
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authNoAuthHeaderErr);

        done();
      });
  });

  it(`should set Authorization header with Incorrect JWT and respond with code 400 - ${authIncorrectJWT}`, (done) => {
    expect.assertions(2);

    request(app)
      .get(authSessionPostPath)
      .set('authorization', 'Bearer 123')
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message).toEqual(authIncorrectJWT);

        done();
      });
  });

  it('should set Authorization header with correct JWT, respond with code 200 and user credentials', async () => {
    expect.assertions(2);

    const logInUser = await request(app)
      .post(authSessionPostPath)
      .send({ username, password });

    const { jwt } = logInUser.body;

    const getUserSession = await request(app)
      .get(authSessionPostPath)
      .set('authorization', `Bearer ${jwt}`);

    expect(getUserSession.statusCode).toEqual(200);
    expect(getUserSession.body).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        id: expect.any(String),
        jwt: expect.any(String),
      }),
    );
  });

  afterAll(deleteSessionFile);
});
