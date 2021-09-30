// ** SDK METHODS **

// UTILS
const curry = (fn) => {
    const arity = fn.length

    return function $curry(...args) {
        return args.length < arity ? $curry.bind(null, ...args) : fn.call(null, ...args)
    }
}

// sendRequest :: String -> String -> {Object} -> {Object}
const sendRequest = async (method, url, body) => {
    // Send a request and return a response object
    const response = await fetch(url, {
        method,
        ...(method !== 'GET' && {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    })

    // Get the body object from the response object and return it
    return await response.json()
}

const postRequest = curry(sendRequest)('POST')
// signup :: {Object} -> {Object}
const signup = postRequest('http://localhost:8123/api/users')
// login :: {Object} -> {Object}
const login = postRequest('http://localhost:8123/api/session')

const getRequest = curry(sendRequest)('GET')
const getSession = getRequest('http://localhost:8123/api/session')


