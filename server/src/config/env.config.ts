const envs = {
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: process.env.PUBLIC_URL,
  API_URL: process.env.REACT_APP_API_URL,
  Mongo_URI: process.env.MongoURI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV?.trim() || '"production"',
  LOGS: process.env.NODE_ENV === 'production' ? `combined` : 'dev',

  // mail envs
  mailHost: process.env.SMTP_HOST,
  mailPort: process.env.SMTP_PORT || '587',
  mailUser: process.env.SMTP_USER,
  mailPassword: process.env.SMTP_PASS,
};

export default envs;
