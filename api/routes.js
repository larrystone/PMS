import express from 'express';
import Locations from './controllers/locations';
import validateId from './middlewares/validateId';
import validateSubLocationId from './middlewares/validateSubLocationId';

const routes = express.Router();

routes
  .route('/locations')
  .post(validateSubLocationId, Locations.createLocation)
  .get(Locations.getLocations);

routes
  .route('/locations/:id')
  .all(validateId)
  .get(Locations.getLocation)
  .put(Locations.updateLocation)
  .delete(Locations.deleteLocation);

routes.post('/ping', (req, res) => {
  res.status(200).json('PONG!');
});

export default routes;
