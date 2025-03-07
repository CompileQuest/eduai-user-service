import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
  console.log('Uploading development Env');
  const configFile = `./.env.${process.env.NODE_ENV}`;
  console.log('the configfile is ', configFile);
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}


export const PORT = process.env.PORT;
export const DB_URL = process.env.MONGODB_URI;
export const RABBITMQ_URL = process.env.RABBITMQ_URL;
export const SERVICE_NAME = process.env.SERVICE_NAME;