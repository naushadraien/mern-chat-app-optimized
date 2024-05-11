import type { Application } from 'express';

import authRouter from './auth.js';

const baseRouter = '/api/v1';

const mainRouter = (app: Application) => {
  app.use(`${baseRouter}/user`, authRouter);
};

export { mainRouter };
