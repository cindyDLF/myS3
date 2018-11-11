import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import morgan from 'morgan';
import mLog from './lib/utils';
import { db as database } from './models';
import routes from './routes';
import './middlewares/passport';

dotenv.config();

const port = parseInt(process.argv[2], 10) || process.env.PORT;

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const start = async () => {
  try {
    await database.authenticate();
    if (process.env.APP === 'development') {
      await database.sync({ force: false });
    }

    app.use('/api', routes);

    app.listen(port, (err) => {
      if (err) {
        throw err;
      } else {
        mLog(`server is running on port ${port}`, 'cyan');
      }
    });
  } catch (e) {
    throw e;
  }
};

start();
