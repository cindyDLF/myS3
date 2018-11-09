import { Router } from 'express';
import { pick } from 'lodash';
import User from '../models/user';

const api = Router();

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
    await user.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
