import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!env[key]) throw new Error(`Missing env variable: ${key}`);
}