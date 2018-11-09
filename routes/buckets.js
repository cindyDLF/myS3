import { Router } from 'express';
import Buckets from '../models/bucket';

const api = Router();

api.post('/:uuid/create-directory', async (req, res) => {
  const { name } = req.body;
  const id = req.params.uuid;
  try {
    if (!req.body.name) {
      const bucket = new Buckets({ name, user_uuid: id });
      await bucket.save();
      // fs.mkdirSync('/otp')
    } else {
      console.log(`directory ${req.body.name} already exist`);
    }

    // console.log(user);

    res.status(200).end();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
