import fs from 'fs';
import { v4 as uuid } from 'uuid';
import Utils from '../utils/utils.js';

const fsP = fs.promises;

// handleSnap POST :: /p8/api/snap
export const handleSnap = (req, res) => {
  try {
    const id = uuid();
    const snapPath = Utils.filePath(`images/${id}.png`);

    fsP.writeFile(snapPath, req.body.imageData, 'base64');

    return res.status(201).send({ imgUrl: Utils.resolvePath(req, `/p8/api/image/${id}.png`) });
  } catch (err) {
    return res.status(500).send({ error: { message: 'Could not store image' } });
  }
};

// handleImage GET :: /p8/api/image
export const handleSendingImage = async (req, res) => {
  const { imageId } = req.params;

  res.set({
    'content-type': 'image/png',
    'cache-control': 'max-age=4000',
  });

  const imageBuffer = await fsP.readFile(Utils.filePath(`images/${imageId}`));

  return res.send(imageBuffer);
};
