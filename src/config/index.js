import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file if not in production
if (process.env.NODE_ENV !== 'prod') {
  const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
  console.log(`🌱 Loading development environment from ${envPath}`);
  dotenv.config();
} else {
  dotenv.config();
}

// Required environment variables
const requiredEnvVars = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  SERVICE_NAME: process.env.SERVICE_NAME,

  // Optional but added for completeness
  NODE_ENV: process.env.NODE_ENV,
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,
  API_DOMAIN: process.env.API_DOMAIN,
  SUPERTOKEN_CONNECTION_URL: process.env.SUPERTOKEN_CONNECTION_URL,
  SUPERTOKEN_API_KEY: process.env.SUPERTOKEN_API_KEY,
  AUTH_SERVICE_PORT: process.env.AUTH_SERVICE_PORT,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET
};

// Validate core required variables
const coreRequiredVars = ['PORT', 'MONGODB_URI', 'RABBITMQ_URL', 'SERVICE_NAME'];
const missingVars = coreRequiredVars.filter((key) => !requiredEnvVars[key]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ Required environment variables loaded successfully');
}

// Export all variables
export const {
  PORT,
  MONGODB_URI,
  RABBITMQ_URL,
  SERVICE_NAME,
  NODE_ENV,
  WEBSITE_DOMAIN,
  API_DOMAIN,
  SUPERTOKEN_CONNECTION_URL,
  SUPERTOKEN_API_KEY,
  AUTH_SERVICE_PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET
} = requiredEnvVars;
