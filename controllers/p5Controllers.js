/* eslint-disable import/extensions */
// eslint-disable-next-line import/extensions
import fetch from 'node-fetch';
import Storage from '../utils/storage.js';
import Utils from '../utils/utils.js';

class Chatroom {
    #rooms;

    constructor() {
      this.#rooms = new Storage('store', 'chatroom', 'json');
    }

    addMessage = async (content, room, owner) => {
      try {
        if (!this.#rooms.has(room)) await this.#rooms.add(room, []);
        this.#rooms.modify(room, (value) => [...value, { owner, content }]);
      } catch (e) {
        throw new Error("Couldn't add message");
      }
    };

    handleUser = async (req, _res, next) => {
      const auth = req.get('Authorization');
      const token = auth && auth.split(' ')[1];

      const userDataRes = await fetch('https://js5.c0d3.com/auth/api/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      req.user = await userDataRes.json();

      next();
    }

    handleHome = (_req, res) => {
      res.set('cache-control', 'max-age=3000');
      return res.sendFile(Utils.filePath('p5.html'));
    }

    handleRoom = (_req, res) => res.sendFile(Utils.filePath('p5.html'))

    handleSession = (req, res) => {
      const { user } = req;

      if (user.error) return res.status(403).json({ ...user });

      if (!req.session.token) req.session.token = user.jwt;

      return res.json({ ...user });
    }

    handleMessageCreation = async (req, res) => {
      try {
        const { room } = req.params;
        const { content } = req.body;
        const { username: owner } = req.user;

        if (!owner) return res.status(403).json({ error: { message: 'User is not authenticated' } });
        if (!content) return res.status(400).json({ error: { message: 'Content missing' } });

        await this.addMessage(content, room, owner);

        return res.status(201).json({ message: 'Message added successfully' });
      } catch (e) {
        return res.status(500).json({ error: { message: 'Error adding the message.' } });
      }
    }

    handleGettingMessages = async (req, res) => {
      try {
        if (!req.user) return res.status(403).json({ error: 'User is not authenticated' });

        const { room } = req.params;
        const messages = await this.#rooms.getValue(room);
        let reqBody = null;

        if (messages) reqBody = messages;

        return res.json(reqBody);
      } catch (e) {
        return res.status(500).json({ error: { message: "Couldn't get the messages." } });
      }
    }
}

export default Chatroom;
