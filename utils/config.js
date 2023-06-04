module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB: process.env.MONGODB || 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET: process.env.JWT_SECRET || 'secret-code',
  DEV_SECRET: 'dev-secret',
  NODE_PRODUCTION: 'production',
};
