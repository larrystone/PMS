/*eslint-disable*/
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

it('should get the entry endpoint', async () => {
  const res = await chai.request(app).get('/');
  expect(res.statusCode).to.equal(200);
});

it('should respond to a Ping request', async () => {
  const res = await chai.request(app).post('/ping');
  expect(res.statusCode).to.equal(200);
  expect(res.body).to.equal('PONG!');
});