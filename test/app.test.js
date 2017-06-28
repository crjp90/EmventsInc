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

describe('/POST event ', () => {
  it('it should POST an event',(done) => {
    const newEvent = {id: 7, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
    chai.request(app)
      .post('/events/')
      .send(newEvent)
      .end((err,res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('date');
        res.body.should.have.property('id').eql(7);
        done();
      })
  });
  it('it shouldn\'t POST an existent event', (done) => {
    const newEvent = {id: 2, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
    chai.request(app)
      .post('/events')
      .send(newEvent)
      .end((err,res) => {
        res.should.have.status(409);
        res.body.should.be.eql({});
        done();
      });
  });
});

describe('/PUT event', () => {
  it('it should PUT an existent event with all properties', (done) => {
    const updatedEvent = {id: 2, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
    chai.request(app)
      .put('/events/' + 2)
      .send(updatedEvent)
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('date');
        res.body.should.have.property('id').eql(2);
        done();
      });
  });
  it('it should PUT an existent event with optional properties', (done) => {
    const updatedEvent = {id: 2, title: "Webinar TDD con CHAI"};
    chai.request(app)
      .put('/events/' + 2)
      .send(updatedEvent)
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('date');
        res.body.should.have.property('id').eql(2);
        done();
      });
  });
  it('it shouldn\'t PUT a non existent event', (done) => {
    const updatedEvent = {id: 7, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
    chai.request(app)
      .put('/events' + 7)
      .send(updatedEvent)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.eql({});
        done();
      });
  });
});

describe('/DELETE event', () => {
  it('it should DELETE an existent event', (done) => {
    chai.request(app)
      .delete('/events/' + 4)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('string');
        done();
      });
  });
  it('it shouldn\'t DELETE a non existent event', (done) => {
    chai.request(app)
      .delete('/events/' + 9)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.eql({});
        done();
      });
  })
});
