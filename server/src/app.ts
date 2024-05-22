import 'dotenv/config';

import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';

import chatConfig from './config';
import { errorMiddleware } from './middlewares/error';
import { mainRouter } from './routes';
import connectDB from './utils/feature';

connectDB(chatConfig.Mongo_URI).catch((error) => {
  console.error('Failed to connect to the database:', error);
  throw error;
});
const app = express();
app.locals.version = '1.0.0';
app.locals.title = 'Mern Chat App';
app.use(express.json());
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Api working on /api/v1');
});
app.use(cookieParser());

mainRouter(app);

app.use('*', (req: Request, res: Response, _next: NextFunction) => {
  res
    .status(404)
    .json({ message: `Cannot ${req.method} ${req.originalUrl} or this route not found` });
});

app.use(errorMiddleware);
app.listen(chatConfig.PORT, () => {
  console.log(`Server is working on http://localhost:${chatConfig.PORT}`);

  console.info(`🔌 Server listening on port:${'\x1b[94m'} ${chatConfig.PORT}` + '\x1b[0m');
  console.info('\x1b[95m' + `🚀 Deploy stage: ${chatConfig.NODE_ENV}` + '\x1b[0m');
  console.info('\x1b[93m' + `📀 Server: ${app.locals.title}` + '\x1b[0m');
});
