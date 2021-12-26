import path from 'path';
import fs from 'fs';
import fp from 'lodash/fp.js';

const fsP = fs.promises;
const { curry } = fp;
class Utils {
  static filePath = (pathName, dir = 'public') => `${path.resolve()}/${dir}/${pathName}`;

  static CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization',
  }

  static resolvePath = (req, dir, https) => `${https ? 'https' : req.protocol}://${req.headers.host}${dir}`;

  static createDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) fs.mkdir(dirPath, (e) => e && console.error(e));
  }

  static deleteDir = curry((dir, file) => {
    try {
      const filePath = `${dir}/${file}`;
      if (fs.existsSync(filePath)) fsP.unlink(filePath);
    } catch (e) {
      console.error('Could not link file', e);
    }
  })

  static sendHTML = curry((HTMLname, req, res) => res.sendFile(this.filePath(HTMLname, 'js6')))
}

export default Utils;
