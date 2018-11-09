import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JsonWebTokenStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'nickname',
      passwprdField: 'password',
    },
    async (nickname, password, done) => {
      try {
        const user = await User.findOne({ where: { nickname } });

        if (!user) {
          done('please check your nickname');
        }

        if (!await user.checkPassword(password)) {
          done('incorrect password');
        }

        done(false, user);
      } catch (err) {
        done(`something wrong happend ${err.messages}`);
      }
    },
  ),
);

passport.use(
  new JsonWebTokenStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION,
    },
    async (jwtPayLoad, done) => {
      try {
        const user = await User.findOne({ where: { uuid: jwtPayLoad.uuid } });
        if (user) {
          done(null, user);
        }
      } catch (err) {
        done(err);
      }
    },
  ),
);

// curl -X POST -H "Content-Type: application/json" -d '{"nickname": "Iorveth", "password": "1234567", "email": "iorveth@gmail.com", "password_confirmation": "1234567"}' localhost:4242/api/auth/register | jq
