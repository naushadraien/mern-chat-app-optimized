import type { Application } from 'express';

import authRouter from './auth';
import chatRouter from './chat';

const baseRouter = '/api/v1';

const mainRouter = (app: Application) => {
  app.use(`${baseRouter}/user`, authRouter);
  app.use(`${baseRouter}/chat`, chatRouter);
};

export { mainRouter };
