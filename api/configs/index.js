if (process.env !== 'production') {
  require('dotenv').config(); //eslint-disable-line
}

const { PORT } = process.env;

const DATABASE = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};

module.exports = {
  ...DATABASE,
  PORT,
};
