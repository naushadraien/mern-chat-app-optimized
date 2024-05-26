import 'dotenv/config';

import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';

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

app.use(morgan(chatConfig.LOGS));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded and here extended is true to parse nested object in the form data like array of objects etc and limit is to limit the size of the data that can be sent in the form data to 50mb here

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Api working on /api/v1');
});
app.use(cookieParser());
// createUser(10);
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
