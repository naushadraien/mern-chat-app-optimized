import type { Application } from 'express';

import authRouter from './auth';
import chatRouter from './chat';
import testRouter from './test';

const baseRouter = '/api/v1';

const mainRouter = (app: Application) => {
  app.use(`${baseRouter}/user`, authRouter);
  app.use(`${baseRouter}/chat`, chatRouter);
  app.use(`${baseRouter}/test`, testRouter);
};

export { mainRouter };
