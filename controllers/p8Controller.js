import fs from 'fs';
import { v4 as uuid } from 'uuid';
import Utils from '../utils/utils.js';

const fsP = fs.promises;

Utils.createDir('public/p8-snaps');
const getAllUsersImages = () => fsP.readdir('public/p8-snaps');

// handleSnap POST :: /p8/api/snap
export const handleSnap = (req, res) => {
  try {
    const id = uuid();
    const snapPath = Utils.filePath(`p8-snaps/${id}.png`);

    fsP.writeFile(snapPath, req.body.imageData, 'base64');

    return res.status(201).send({ imgUrl: Utils.resolvePath(req, `/p8/api/image/${id}.png`, true) });
  } catch (err) {
    return res.status(500).send({ error: { message: 'Could not store image' } });
  }
};

// handleImage GET :: /p8/api/image
export const handleSendingImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    res.set({
      'content-type': 'image/png',
      'cache-control': 'max-age=4000',
    });

    const imageBuffer = await fsP.readFile(Utils.filePath(`p8-snaps/${imageId}`));

    return res.send(imageBuffer);
  } catch (e) {
    return res.send({ error: { message: 'Requested file does not exist' } });
  }
};

// handleSendingImages GET :: /p8/api/images
export const handleSendingImages = async (req, res) => {
  const userImages = await getAllUsersImages();

  const mapUserImagesToUrl = userImages.map((imageName) => Utils.resolvePath(req, `/p8/api/image/${imageName}`, true));

  return res.send(mapUserImagesToUrl);
};
