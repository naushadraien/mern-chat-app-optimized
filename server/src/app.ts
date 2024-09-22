import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import chatConfig from './config';
import { errorMiddleware } from './middlewares/error';
import { mainRouter } from './routes';
import { limiter } from './utils/rateLimiterOptions';

const app = express();
app.locals.version = '1.0.0';
app.locals.title = 'Mern Chat App';

// Use Helmet!
app.use(helmet()); // Set security HTTP response headers to protect from well-known web vulnerabilities like XSS, Clickjacking, etc.

// // Apply the rate limiter to all requests
// app.use(limiter);

// Apply the rate limiter to specific routes
app.use('/api', limiter);

app.use(morgan(chatConfig.LOGS));
app.use(express.json({ limit: '50mb' })); // limit the body size to 50mb for incoming requests
app.use(express.urlencoded({ limit: '50mb', extended: true })); // urlencoded helps to parse the incoming requests with urlencoded payloads and makes the data available under the req.body property and it is used where the form data is sent using the application/x-www-form-urlencoded content type
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection (remove $ and . from req.body, req.query, and req.params)
app.use(hpp({ whitelist: ['filter'] })); // Prevent HTTP Parameter Pollution attacks like /api/v1/tours?sort=duration&sort=price (use the last query parameter) by removing duplicate parameters and whitelist some parameters (e.g., filter) that can have duplicate values
app.use(cookieParser());
// createUser(10);
mainRouter(app);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Api working on /api/v1');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  // this should be defined at the end of all routes otherwise it will override all other routes

  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.originalUrl} or this route not found`,
  });

  // next(new ErrorHandler(`Cannot ${req.method} ${req.originalUrl} or this route not found`, 404));
});

app.use(errorMiddleware);

export default app;
