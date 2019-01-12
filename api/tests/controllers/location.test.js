/*eslint-disable*/
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

describe('Location Controller Test', () => {
  describe('/GET all Locations', () => {
    it('should return an empty array', async () => {
      const res = await chai.request(app).get('/locations');
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Success');
      expect(res.body.data.length).to.equal(0);
    });
  });

  describe('/POST new Location', () => {
    // Happy endings
    it('should create a new location', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Lagos',
          male: 20,
          female: 10,
        });
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.name).to.equal('Lagos');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.be.null;
    });

    it('should create a Location with subLocation data provided', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Abeokuta',
          male: 20,
          female: 10,
          subLocation: {
            name: 'Nigeriansaman',
            male: 1,
            female: 80,
          },
        });
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.name).to.equal('Abeokuta');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.equal(2);
    });

    it('should create a Location with subLocationId provided', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Nigeria',
          male: 20,
          female: 10,
          subLocationId: 3,
        });
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.name).to.equal('Nigeria');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.equal(3);
    });

    it('should return an array of locations', async () => {
      const res = await chai.request(app).get('/locations');
      expect(res.body.data.length).to.equal(4);
    });

    // Sad endings
    it('should return error for invalid name', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'L',
          male: 20,
          female: 10,
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Invalid location data provided!');
    });

    it('should return error for invalid male or female population', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Lags',
          male: 'a20',
          female: 'w10a',
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Invalid location data provided!');
    });

    it('should return error for invalid sub Location data', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Lags',
          male: 'a20',
          female: 10,
          subLocation: {
            name: 'a',
            male: 1,
            female: 80,
          },
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Invalid location data provided!');
    });

    it('should return error if location already exist in the database', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Lagos',
          male: 60,
          female: 10,
        });
      expect(res.statusCode).to.equal(409);
      expect(res.body.message).to.equal('Location already exist');
    });

    it('should return error for invalid subLocation ID (Not found)', async () => {
      const res = await chai.request(app)
        .post('/locations')
        .set('Accept', 'application/json')
        .send({
          name: 'Nigeria',
          male: 20,
          female: 10,
          subLocationId: 30,
        });
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('subLocation not found in database');
    });
  });

  describe('/GET location', () => {
    // Happy endings
    it('should return location data', async () => {
      const res = await chai.request(app).get('/locations/1');
      expect(res.body.message).to.equal('Success!. Max depth of 4 supported');
      expect(res.body.data.id).to.equal(1);
      expect(res.body.data.name).to.equal('Lagos');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.female).to.equal(10);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.be.null;
    });

    it('should return location data with default subLocation depth of 1', async () => {
      const res = await chai.request(app).get('/locations/3');
      expect(res.body.message).to.equal('Success!. Max depth of 4 supported');
      expect(res.body.data.id).to.equal(3);
      expect(res.body.data.name).to.equal('Abeokuta');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.female).to.equal(10);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.equal(2);
      expect(res.body.data.subLocation).to.include({
        id: 2,
        name: 'Nigeriansaman',
        male: 1,
        female: 80,
        total: 81,
      });
    });

    it('should return location data with subLocation depth of 2', async () => {
      const res = await chai.request(app).get('/locations/4?depth=2');
      expect(res.body.message).to.equal('Success!. Max depth of 4 supported');
      expect(res.body.data.id).to.equal(4);
      expect(res.body.data.name).to.equal('Nigeria');
      expect(res.body.data.male).to.equal(20);
      expect(res.body.data.female).to.equal(10);
      expect(res.body.data.total).to.equal(30);
      expect(res.body.data.subLocationId).to.equal(3);
      expect(res.body.data.subLocation).to.include({
        id: 3,
        name: 'Abeokuta',
        male: 20,
        female: 10,
        total: 30,
      });
      expect(res.body.data.subLocation.subLocationId).to.equal(2);
      expect(res.body.data.subLocation.subLocation).to.include({
        id: 2,
        name: 'Nigeriansaman',
        male: 1,
        female: 80,
        total: 81,
      });
    });

    // Sad ending
    it('should return error when an invalid ID is provided', async () => {
      const res = await chai.request(app).get('/locations/as');
      expect(res.statusCode).to.equal(422);
      expect(res.body.message).to.equal('Invalid Location ID provided');
    });

    it('should return not found an ID', async () => {
      const res = await chai.request(app).get('/locations/19');
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Location not found');
    });
  });

  describe('/DELETE location', () => {
    // Happy ending
    it('should delete a location successfully', async () => {
      const res = await chai.request(app).delete('/locations/1');
      expect(res.statusCode).to.equal(200);
    });

    // Sad ending
    it('should return error when an invalid ID is provided', async () => {
      const res = await chai.request(app).delete('/locations/as');
      expect(res.statusCode).to.equal(422);
      expect(res.body.message).to.equal('Invalid Location ID provided');
    });

    it('should return not found an ID', async () => {
      const res = await chai.request(app).delete('/locations/19');
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Location not found');
    });
  });

  describe('/PUT Location', () => {
    // Happy endings
    it('should update an existing location', async () => {
      const res = await chai.request(app)
        .put('/locations/2')
        .set('Accept', 'application/json')
        .send({
          name: 'Lagos',
          male: 2000,
          female: 50000,
          subLocationId: null,
        });
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.name).to.equal('Lagos');
      expect(res.body.data.male).to.equal(2000);
      expect(res.body.data.total).to.equal(52000);
      expect(res.body.data.subLocationId).to.be.null;
    });

    // Sad endings
    it('should return error for an invalid name', async () => {
      const res = await chai.request(app)
        .put('/locations/3')
        .set('Accept', 'application/json')
        .send({
          name: 'L',
          male: 20,
          female: 10,
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Invalid location data provided!');
    });

    it('should return error for invalid male or female population', async () => {
      const res = await chai.request(app)
        .put('/locations/2')
        .set('Accept', 'application/json')
        .send({
          name: 'Lags',
          male: 20,
          female: 'w10a',
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Invalid location data provided!');
    });
  });
});
