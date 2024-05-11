import express from 'express';
import 'dotenv/config';
import chatConfig from './config/index.js';
import { mainRouter } from './routes/index.js';
import { errorMiddleware } from './middlewares/error.js';
import connectDB from './utils/feature.js';
connectDB(chatConfig.Mongo_URI);
const app = express();
app.use(express.json());
app.get('/', (req, res, next) => {
    res.send('Api working on /api/v1');
});
mainRouter(app);
app.use(errorMiddleware);
app.listen(chatConfig.PORT, () => {
    console.log(`Server is working on http://localhost:${chatConfig.PORT}`);
});
