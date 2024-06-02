import 'dotenv/config';

import { type Application } from 'express';

import { setupApp } from './app';
import chatConfig from './config';
import { logWithIcon } from './utils/logServerWithIcon';

setupApp()
  .then((app: Application) => {
    app.listen(chatConfig.PORT, () => {
      logWithIcon('🔌', '94', `Server listening on port: ${chatConfig.PORT}`);
      logWithIcon('🚀', '95', `Deploy stage: ${chatConfig.NODE_ENV}`);
      logWithIcon('📀', '93', `Server: ${app.locals.title}`);
    });
  })
  .catch((error) => {
    console.error('Failed to setup the application:', error);
    process.exit(1);
  });
