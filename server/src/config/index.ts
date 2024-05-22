import envConfigs from './env.config';
const chatConfig = {
  ENVS: {
    PROD: 'production',
    DEV: 'development',
    STAGE: 'staging',
  },
  ...envConfigs,
};

export default chatConfig;
