/* eslint-disable no-prototype-builtins */
import fs from 'fs';

const fsAsync = fs.promises;

class Storage {
    #folder;

    #fileName;

    #ext;

    #path;

    #storage;

    constructor(folder, fileName, ext) {
      this.#folder = folder;
      this.#fileName = fileName;
      this.#ext = ext;
      this.#path = `${folder}/${fileName}.${ext}`;
      this.#storage = this.#initStorage();
    }

    #initStorage = async () => {
      try {
        if (!fs.existsSync(this.#folder)) await fsAsync.mkdir(this.#folder);

        if (!fs.existsSync(this.#path)) await fsAsync.writeFile(this.#path, '{}');

        const storeData = await fsAsync.readFile(this.#path, 'utf-8');

        // if (!storeData) this.updateStorage();
        return JSON.parse(storeData || '{}');
      } catch (err) {
        throw new Error(err, 1);
      }
    }

    updateStorage = async () => {
      const s = await this.#storage;
      await fsAsync.writeFile(this.#path, JSON.stringify(s))
        .catch((err) => { throw new Error(err); });
      return this;
    }

    add = async (key, value) => {
      const s = await this.#storage;
      s[key] = value;
      this.updateStorage();
      return this;
    }

    modify = async (key, fn) => {
      const s = await this.#storage;
      s[key] = fn(s[key]);
      this.updateStorage();
      return this;
    }

    getValue = async (key) => {
      const s = await this.#storage;
      return s[key];
    }

    has = async (key) => {
      const s = await this.#storage;
      return s.hasOwnProperty(key);
    }

    some = async (fn) => {
      const s = await this.#storage;

      console.log(Object.values(s));
    }
}

export default Storage;
