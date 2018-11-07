import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import winston from 'winston';
import validator from 'express-validator';
import passport from 'passport';
import session from 'express-session';

import routes from './server/routes';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get('/', (req, res) => {
  res.status(200)
    .json({
      // eslint-disable-next-line max-len
      message: 'Welcome to Author\'s Haven Homepage, the community of great authors',
      status: 200
    });
});

app.get('/login', (req, res) => {
  res.status(200)
    .json({
      message: 'Authors\'s Haven login page',
      status: 200
    });
});

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

// eslint-disable-next-line max-len
app.listen(port, () => winston.log('info', `App listening at localhost:${port}`));

export default app;
