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

describe('/GET event by id', () => {
  it('it should GET an event by its id', (done) => {
    chai.request(app)
      .get('/events/' + 3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('date');
        res.body.should.have.property('id').eql(3);
        done();
      });
  });

  it('it should return status 404 if event doesn\'t exist', (done) => {
    chai.request(app)
      .get('/events/' + 6)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.eql({});
        done();
      });
  });

});
