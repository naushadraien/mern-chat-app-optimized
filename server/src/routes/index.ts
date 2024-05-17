import type { Application } from 'express';

import authRouter from './auth.js';
import chatRouter from './chat.js';

const baseRouter = '/api/v1';

const mainRouter = (app: Application) => {
  app.use(`${baseRouter}/user`, authRouter);
  app.use(`${baseRouter}/chat`, chatRouter);
};

export { mainRouter };
