import Jimp from 'jimp';
import fs from 'fs';
import Utils from '../utils/utils.js';

const fsP = fs.promises;

const readAllMemes = () => fsP.readdir('public/p9-memes');

const createMeme = async (text, buffer) => {
  try {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const image = await Jimp.read(buffer);
    const { height, width } = image.bitmap;

    image.print(
      font, 0, 0,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      width, height,
    );

    return image.getBufferAsync(Jimp.MIME_PNG);
  } catch (e) {
    throw new Error(e);
  }
};

export const handleLogin = (req, res) => {
  if (req.session.username) {
    return res.status(409).send({ error: { message: 'User already logged in' } });
  }

  const { username } = req.body;

  if (!username) return res.status(401).send({ error: { message: 'Username is required' } });

  req.session.username = username;

  return res.redirect('/p9/memechat');
};

export const renderSecurePage = ({ page, redirectTo, directTo }) => (req, res) => {
  const { username } = req.session;
  const condition = page === 'login' ? username : !username;

  if (condition) return res.redirect(redirectTo);

  return res.sendFile(Utils.filePath(directTo));
};

export const handleMemeCreation = async (req, res) => {
  const { username } = req.session;

  const { text, imgData } = req.body;

  if (!text || !imgData) {
    return res.status(400).send({
      error: {
        message: 'Required fields are missing. Make sure to include text and image buffer',
      },
    });
  }

  const imageData = Buffer.from(req.body.imgData, 'base64');

  fsP.writeFile(
    Utils.filePath(`p9-memes/${username}.png`),
    await createMeme(text, imageData),
    'base64',
  );

  return res.status(201).send({ message: 'Meme created' });
};

export const handleSendingMeme = async (req, res) => {
  try {
    const { userMeme } = req.params;

    res.set({ 'content-type': 'image/png' });

    const memeBuffer = await fsP.readFile(Utils.filePath(`p9-memes/${userMeme}`));

    return res.send(memeBuffer);
  } catch (e) {
    return res.send({ error: { message: 'Requested meme does not exist' } });
  }
};

export const handleSendingAllMemes = async (req, res) => {
  const memes = await readAllMemes();

  const mapMemesToUrls = memes.map((memeName) => Utils.resolvePath(req, `/p9/api/meme/${memeName}`));

  return res.send(mapMemesToUrls);
};
