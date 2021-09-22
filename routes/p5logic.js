/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
const render = document.querySelector('#render');

const storage = localStorage.getItem('jwt') || '[]';
let token = JSON.parse(storage);
let prevMessagesLength = 0;

const handleSignUpHint = () => signUpPage();
const handleLoginHint = () => loginPage();

const curry = (fn) => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) return $curry.bind(null, ...args);
    return fn.call(null, ...args);
  };
};

const sendMessage = (content, room) => {
  fetch(`/p5/api/${room}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  });
};

const getMessages = async (room) => {
  const roomRes = await fetch(`/p5/api/${room}/messages`);
  const messages = await roomRes.json();

  if (messages && messages.length !== prevMessagesLength) {
    render.querySelector('.messages__container').innerHTML = renderMessages(messages);
    prevMessagesLength = messages.length;
  }

  setTimeout(() => getMessages(room), 500);
};

const createEvent = (event, funToAdd, eventEl) => eventEl.addEventListener(event, funToAdd);

const eventL = curry(createEvent);
const clickEvent = eventL('click');
const keyDownEvent = eventL('keydown');

const removeEvent = (funToRemove, event, el) => el.removeEventListener(event, funToRemove);

const renderMessages = (messages) => (
  messages ? messages.reduce((acc, {
    owner,
    content,
  }) => acc += `<div class="message">
                <span class="message__owner">${owner}:</span>
                <p class="message__content">${content}</p>
                </div>`, '') : ''
);

const handleSignUpSubmit = ({
  fullName,
  username,
  password,
  email,
}) => {
  if (!fullName.value || !username.value || !password.value || !email
    .value) {
    return;
  }

  fetch('https://js5.c0d3.com/auth/api/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username: fullName.value,
      email: email.value,
      name: name.value,
      password: Buffer.from(password, 'base64'),
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      password.value = '';

      if (data.jwt) {
        localStorage.setItem('jwt', JSON.stringify(data.jwt));
        joinUrlParamRoom();
      }
    });
};

const handleSendMessageKey = (e, room) => {
  const content = e.target.value;

  if (content && e.key === 'Enter') {
    sendMessage(content, room);
    e.target.value = '';
  }
};

const parentContainer = (childs) => `<div class="card">${childs}</div>`;

const chatRoomPage = async (room) => {
  const roomRes = await fetch(`/p5/api/${room}/messages`);
  const messages = await roomRes.json();

  if (messages) prevMessagesLength = messages.length;

  const html = `
    <h1 class="title">Chat Room: ${room}</h1>
    <input type="text" placeholder="Message" class="input message"/>
    <div class="messages__container">
        ${renderMessages(messages)}
    </div>
    `;

  render.innerHTML = parentContainer(html);

  keyDownEvent((e) => handleSendMessageKey(e, room), render.querySelector('.message'));

  getMessages(room);
};

const chatRoomNamePage = () => {
  const html = `
    <h1 class="title">Enter Room Name</h1>
    <div class="inputs" style="margin-top: 40px;">
        <input type="text" placeholder="Room" class="input roomName"/>
        <button class="submit">Join</button>
    </div>
    `;

  render.innerHTML = parentContainer(html);

  const room = document.querySelector('.roomName');

  clickEvent(() => {
    if (room.value) {
      chatRoomPage();
    }
  }, render.querySelector('.submit'));
};

const loginPage = () => {
  const html = `
    <h1 class="title">Login</h1>
    <div class="inputs">
        <input type="text" placeholder="Username" class="input username"/>
        <input type="password" placeholder="Password" class="input password"/>
        <button class="submit">Log in</button>
        <span class="hint">Don’t have an account?<span class="signup_page">Sign up</span></span>
    </div>
    `;

  render.innerHTML = parentContainer(html);

  const username = document.querySelector('.username');
  const password = document.querySelector('.password');

  removeEvent(handleLoginHint, 'click');

  clickEvent(handleSignUpHint, render.querySelector('.signup_page'));
  clickEvent(() => {
    if (!username.value || !password.value) {
      return;
    }

    fetch('https://js5.c0d3.com/auth/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: btoa(password.value),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        password.value = '';

        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt));
          joinUrlParamRoom();
        }
      });
  }, render.querySelector('.submit'));
};

const signUpPage = () => {
  const html = `
<h1 class="title">Sign up</h1>
<div class="inputs">
<input type="text" placeholder="Full name" class="input fullname"/>
<input type="text" placeholder="Username" class="input username"/>
<input type="email" placeholder="Email" class="input email"/>
<input type="password" placeholder="Password" class="input password"/>
<button class="submit">Sign up</button>
<span class="hint">Have an account?<span class="login_page">Login</span></span>
</div>
`;

  render.innerHTML = parentContainer(html);

  const fullName = document.querySelector('.fullname');
  const username = document.querySelector('.username');
  const password = document.querySelector('.password');
  const email = document.querySelector('.email');

  removeEvent(handleSignUpHint, 'click');

  clickEvent(handleLoginHint, render.querySelector('.login_page'));
  clickEvent(() => handleSignUpSubmit({
    fullName,
    username,
    password,
    email,
  }), render.querySelector('.submit'));
};

const joinUrlParamRoom = () => {
  const room = document.location.pathname.split('/')[2];

  return room ? chatRoomPage(room) : chatRoomNamePage();
};

const renderPage = () => {
  fetch('/p5/api/session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json()).then((userState) => {
    if (userState.jwt) {
      joinUrlParamRoom();
      return;
    }

    token = [];

    loginPage();
  });
};

renderPage();
