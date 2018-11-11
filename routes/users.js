import { Router } from 'express';
import { pick } from 'lodash';
import fs from 'fs';
import User from '../models/user';
import Buckets from '../models/bucket';

const api = Router();

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

api.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: { users }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:uuid', async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    res.status(200).json({ data: { user } });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.put('/:uuid', async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    if (user) {
      const field = pick(req.body, ['nickname', 'email', 'password', 'password_confirmation']);
      await user.update(field);
    }
    res.status(204).json({ data: { user } });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

api.delete('/:uuid', async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    console.log(user);
    if (user) {
      deleteFolderRecursive(`/opt/workspace/myS3/${req.params.uuid}`);
      Buckets.destroy({ where: { user_uuid: req.params.uuid } });
      await user.destroy();
      await res.status(204).send();
    } else {
      res.status(400).json({ err: "user doesn't exist" });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
