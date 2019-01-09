import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import routes from './routes';
import { PORT } from './configs';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  console.log('App is live on PORT:', PORT);
});
