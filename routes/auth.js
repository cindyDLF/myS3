import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import User from '../models/user';
import Mail from '../lib/mail';

const api = Router();

api.post('/register', async (req, res) => {
  const {
    nickname, email, password, password_confirmation,
  } = req.body;

  try {
    const user = new User({
      nickname,
      email,
      password,
      password_confirmation,
    });

    await user.save();

    Mail.send(user.email, 'Welcome', 'yo', `<h1>${user.nickname}</h1>`);

    const payload = { uuid: user.uuid, nickname, email };

    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION);

    if (!fs.existsSync('/opt/workspace')) {
      try {
        fs.mkdirSync('/opt/workspace');
      } catch (err) {
        console.log(err);
      }
    }

    if (!fs.existsSync('/opt/workspace/myS3')) {
      try {
        fs.mkdirSync('/opt/workspace/myS3');
      } catch (err) {
        console.log(err);
      }
    } else {
      fs.mkdirSync(`/opt/workspace/myS3/${user.uuid}`);
    }

    res.status(201).json({ data: { user }, meta: { token } });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

api.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    {
      session: false,
    },
    (err, user, message) => {
      if (err) {
        res.status(400).res.json({ err });
      }
      const { uuid, email, nickname } = user.toJSON();

      const payload = { uuid: user.uuid, nickname, email };

      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION);

      return res.status(200).json({
        data: {
          user: { uuid, nickname, email },
        },
        meta: {
          token,
        },
      });
    },
  )(req, res);
});

export default api;

// chmod 777 opt
