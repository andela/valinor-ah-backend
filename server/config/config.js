import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DB_DATABASE_TEST_URL',
    dialect: 'postgres',
  },
  production: {
    database: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};
