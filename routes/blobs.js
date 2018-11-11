import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const api = Router({ mergeParams: true });

const dirname = 'opt/workspace/myS3';

const name = '';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'opt/workspace/myS3');
  },
  filename(req, file, callback) {
    callback(null, 'image');
  },
});

const upload = multer({ storage });

api.post('/', upload.single('file'), (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.file);
    res.status(200).json('bravo le veau');
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
