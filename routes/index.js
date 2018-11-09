import { Router } from 'express';
import passport from 'passport';
import auth from './auth';
import users from './users';
import buckets from './buckets';
import Mail from '../lib/mail';

const api = Router();

api.get('/', (req, res) => {
  Mail.send('c@gmail', 'Welcome', 'yo', '<h1>yo</h1>');
  res.json({ hello: 'from express.island' });
});

api.use('/users', passport.authenticate('jwt', { session: false }), users);
api.use('/auth', auth);
api.use('/buckets', buckets);

export default api;
