class Auth {
  static host = 'https://laicalf.freedomains.dev/auth/api/';

  static #authCurry = (fn) => {
    const arity = fn.length;

    return function $curry(...args) {
      if (args.length < arity) return $curry.bind(null, ...args);
      return fn.call(null, ...args);
    };
  };

  // sendRequest :: String -> String -> {Object} -> {Object}
  static #sendRequest = async (method, url, payload) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  };

  static #postRequest = this.#authCurry(this.#sendRequest)('POST');

  static signup = this.#postRequest(`${Auth.host}users`);

  static login = this.#postRequest(`${Auth.host}session`);

  static getSession = () => fetch(`${Auth.host}session`, { credentials: 'include' });

  static logout = () => fetch(`${Auth.host}session`, { credentials: 'include', method: 'DELETE' });
}
