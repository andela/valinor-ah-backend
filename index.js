import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import winston from 'winston';
import dotenv from 'dotenv';
import routes from './routes'


const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // development error handler
  // will print stacktrace
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
    errors: {
        message: err.message,
        error: err
    }
    });
});
  
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {}
      }
    });
  });

app.listen(port, () => {
    winston.log('info', `App listening at localhost:${port}`);
});

export default app;