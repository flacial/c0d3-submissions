import path from 'path';

class Utils {
    static filePath = (pathName) => `${path.resolve()}/public/${pathName}`;

    static CORS_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Origin, Authorization',
    }
}

export default Utils;
