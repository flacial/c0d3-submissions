import Jimp from 'jimp';
import LRU_Cache from '../utils/lru-cache.js';

class MemesGen {
  constructor() {
    this.memesCache = new LRU_Cache(10);
  }

  createMeme = async (text, src, blur, black) => {
    try {
      const font = await Jimp.loadFont(black ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_64_WHITE);
      const image = await Jimp.read(src || 'https://placeimg.com/640/480/any');
      const { height, width } = image.bitmap;

      if (blur) image.blur(blur);
      image.print(font, 0, 0, {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      width,
      height);

      return image.getBufferAsync(Jimp.MIME_JPEG);
    } catch (e) {
      throw new Error(e);
    }
  };

  handleMemesGen = async (req, res) => {
    try {
      const { text } = req.params;
      const {
        originalUrl,
      } = req;

      if (this.memesCache.hasItem(originalUrl)) {
        return res.send(this.memesCache.getItem(originalUrl));
      }

      const {
        src,
        blur,
        black,
      } = req.query;

      const buffer = await this.createMeme(text, src, +blur, black === 'true');
      this.memesCache.addItem(originalUrl, buffer);

      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=4000',
      });

      return res.send(buffer);
    } catch (e) {
      return res.status(500).send({
        message: 'Error. Make sure the src link is correct and try again after a while.',
      });
    }
  }
}

export default MemesGen;
