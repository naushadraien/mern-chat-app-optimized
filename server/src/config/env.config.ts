const envs = {
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: process.env.PUBLIC_URL,
  API_URL: process.env.REACT_APP_API_URL,
  Mongo_URI: process.env.MongoURI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV?.trim() || '"PRODUCTION"',
};

export default envs;
