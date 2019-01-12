if (process.env !== 'production') {
  require('dotenv').config(); //eslint-disable-line
}

const { PORT } = process.env;

const DATABASE = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};

module.exports = {
  ...DATABASE,
  PORT,
};
