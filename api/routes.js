import express from 'express';
import Locations from './controllers/locations';

const routes = express.Router();

routes
  .route('/locations')
  .post(Locations.createLocation)
  .get(Locations.getLocations);

routes
  .route('/locations/:id')
  .get(Locations.getLocation)
  .patch(Locations.updateLocation)
  .delete(Locations.deleteLocation);

routes.get('/', (req, res) => {
  res.send('Welcome to the Population Management System!');
});

routes.get('/ping', (req, res) => {
  res.status(200).json('PONG!');
});

export default routes;
