import { Router } from 'express';
import passport from 'passport';
import Buckets from '../models/bucket';

const api = Router({ mergeParams: true });

api.get('/directory', async (req, res) => {
  try {
    const buckets = await Buckets.findAll();
    res.status(200).json({ data: { buckets }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.post('/', async (req, res) => {
  const { name } = req.body;
  const id = req.params.uuid;
  console.log(req.body);
  try {
    if (req.body.name) {
      const bucket = new Buckets({ name, user_uuid: id });
      await bucket.save();
      // fs.mkdirSync('/otp');
    } else {
      console.log(`directory ${req.body.name} already exist`);
    }
    res.status(200).json({
      data: {
        user: { id, name },
      },
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
