import path from 'path';
import fs from 'fs';

class Utils {
  static filePath = (pathName) => `${path.resolve()}/public/${pathName}`;

  static CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization',
  }

  static resolvePath = (req, dir, https) => `${https ? 'https' : req.protocol}://${req.headers.host}${dir}`;

  static createDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) fs.mkdir(dirPath, (e) => e && console.error(e));
  }
}

export default Utils;
