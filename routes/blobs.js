import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const api = Router({ mergeParams: true });

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'opt/workspace/myS3');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage }).single('avatar');

api.post('/', (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        console.log(req);
        return;
      }

      if (!req.files) {
        console.log("file desn't exists");
      } else {
        // Implement your own logic if needed. Like moving the file, renaming the file, etc.
        console.log('coucou');
      }
    });
    // console.log(req.file);
    // console.log(req.file);
    res.status(200).json('successed');
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
