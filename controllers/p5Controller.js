import fetch from 'node-fetch';
import Storage from '../utils/storage.js';
import Utils from '../utils/utils.js';

class Chatroom {
  #rooms;

  constructor() {
    this.#rooms = new Storage('store', 'chatroom', 'json');
  }

  handleUser = async (req, res, next) => {
    const auth = req.get('Authorization');
    const token = auth && auth.split(' ')[1];

    const userDataRes = await fetch('https://js5.c0d3.com/auth/api/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userDataRes.json();
    req.user = userData;

    if (userData.error) { return res.status(403).send({ error: { message: 'User is not authenticated' } }); }

    return next();
  };

  handleHome = (_req, res) => {
    res.set('cache-control', 'max-age=3000');
    return res.sendFile(Utils.filePath('p5.html'));
  };

  handleSession = (req, res) => {
    const { user } = req;

    if (user.error) return res.status(403).json({ ...user });

    return res.json({ ...user });
  };

  #addMessage = async (content, room, owner) => {
    try {
      if (!(await this.#rooms.has(room))) await this.#rooms.add(room, []);

      this.#rooms.modify(room, (value) => {
        if (value) return [...value, { owner, content }];
        throw new Error('Room not created');
      });
    } catch (e) {
      throw new Error("Couldn't add message");
    }
  };

  handleMessageCreation = async (req, res) => {
    try {
      const { room } = req.params;
      const { content } = req.body;
      const { username: owner } = req.user;

      if (!content) { return res.status(400).json({ error: { message: 'Content missing' } }); }

      this.#addMessage(content, room, owner);

      return res.status(201).json({ message: 'Message added successfully' });
    } catch (e) {
      return res
        .status(500)
        .json({ error: { message: 'Error adding the message.' } });
    }
  };

  handleGettingMessages = async (req, res) => {
    try {
      const { room } = req.params;
      const messages = await this.#rooms.getValue(room);
      let reqBody = null;

      if (messages) reqBody = messages;

      return res.json(reqBody);
    } catch (e) {
      return res
        .status(500)
        .json({ error: { message: "Couldn't get the messages." } });
    }
  };
}

export default Chatroom;
