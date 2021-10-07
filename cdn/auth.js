class Auth {
  static host = 'https://laicalf.freedomains.dev';

  static #authCurry = (fn) => {
    const arity = fn.length;

    return function $curry(...args) {
      if (args.length < arity) return $curry.bind(null, ...args);
      return fn.call(null, ...args);
    };
  };

  // sendRequest :: String -> String -> { a } -> { b }
  static #sendRequest = this.#authCurry(async (method, url, payload) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  })

  static #postRequest = this.#sendRequest('POST');

  static #getUser = this.#authCurry(async (requestFn, payload) => {
    const user = await requestFn(payload);

    if (user.jwt) localStorage.setItem('token', user.jwt);
    return user;
  })

  static signup = this.#getUser(this.#postRequest(`${Auth.host}/auth/api/users`));

  static login = this.#getUser(this.#postRequest(`${Auth.host}/auth/api/session`));

  static getSession = () => fetch(`${Auth.host}/auth/api/session`, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } });

  static logout = () => localStorage.removeItem('token');
}
