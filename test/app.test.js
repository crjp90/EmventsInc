const app = require('../app');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET all events', () => {
  it('it should GET all the events', (done) => {
    chai.request(app)
      .get('/events')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        done();
      });
  });
});
