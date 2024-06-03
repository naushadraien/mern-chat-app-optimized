import 'dotenv/config';

// handleUncaughtException();
import app from './app';
import chatConfig from './config';
import connectDB from './utils/feature';
import { handleUnhandledRejection } from './utils/handlingError';
import { logWithIcon } from './utils/logServerWithIcon';

connectDB(chatConfig.Mongo_URI);

const server = app.listen(chatConfig.PORT, () => {
  logWithIcon('🔌', '94', `Server listening on port: ${chatConfig.PORT}`);
  logWithIcon('🚀', '95', `Deploy stage: ${chatConfig.NODE_ENV}`);
  logWithIcon('📀', '93', `Server: ${app.locals.title}`);
});

handleUnhandledRejection(server); // Handle unhandled promise rejection
