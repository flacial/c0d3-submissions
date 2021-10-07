import Storage from '../utils/storage.js';
import Utils from '../utils/utils.js';
import { verifyToken } from './p6Controllers.js';

class Chatroom {
  #rooms;

  constructor() {
    this.#rooms = new Storage('store', 'chatroom', 'json');
  }

  handleUser = async (req, res, next) => {
    try {
      const auth = req.get('authorization');
      const token = auth && auth.split(' ')[1];
      if (!token) return res.status(400).json({ error: { message: 'Access Denied' } });

      const user = await verifyToken(token);
      req.user = user;

      return next();
    } catch (err) {
      return res.status(403).send({ error: { message: 'User is not authenticated' } });
    }
  };

  handleHome = (_req, res) => {
    res.set('cache-control', 'max-age=3000');
    return res.sendFile(Utils.filePath('p5.html'));
  };

  handleSession = (req, res) => res.json({ ...req.user });

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

  // POST
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

  // GET
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
