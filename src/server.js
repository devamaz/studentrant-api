import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mountRoutes from './mountRoutes.js';
import mountGlobalConfigurations from './mountGlobalConfigurations.js';
import { NotFoundException } from './core/exceptions.service.js';
import { badExceptionConstants } from './constants/index.constant.js';
import {
  Config, Database, Session, Logger,
} from './core/config/index.config.js';

import * as routes from './routes/index.route.js';

const app = express();

app.set('PORT', Config.get('SERVER.PORT'));
app.set('CONFIGURATION', Config);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mountGlobalConfigurations(
  app,
  [
    Database,
    Session,
    Logger,
  ],
);

mountRoutes(
  app,
  [
    routes.RegisterRoute,
    routes.LoginRoute,
    routes.RantRoute,
  ],
);

app.use('*', (req, res, next) => next(NotFoundException(`route ${req.path} does not exists`)));

// eslint-disable-next-line
app.use((err, req, res, next) => {

  const { status, message } = err.errorDetails
    ? err.errorDetails
    : {
      status: 500,
      message: process.env.NODE_ENV === 'production'
        ? badExceptionConstants
        : err.message,
    };

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    const logger = new Logger(app.get('CONFIGURATION'));
    logger.setLogType('express');
    logger.log.fatal(message);
  }

  return res.status(status).json({ status, message });
});

app.listen(app.get('PORT'), () => {
  console.log(`listening on port ${app.get('PORT')}`);
});

export default app;
