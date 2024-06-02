import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';

import chatConfig from './config';
import { errorMiddleware } from './middlewares/error';
import { mainRouter } from './routes';
import connectDB from './utils/feature';

const app = express();
app.locals.version = '1.0.0';
app.locals.title = 'Mern Chat App';

app.use(morgan(chatConfig.LOGS));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
// createUser(10);
mainRouter(app);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Api working on /api/v1');
});

app.all('*', (req: Request, res: Response, _next: NextFunction) => {
  // this should be defined at the end of all routes otherwise it will override all other routes
  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.originalUrl} or this route not found`,
  });
});

app.use(errorMiddleware);

export async function setupApp() {
  await connectDB(chatConfig.Mongo_URI);
  return app;
}
