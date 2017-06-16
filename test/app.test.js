const app = require('../app');
const mongoose = require('mongoose');
const eventModel = require('../models/event');
const userModel = require('../models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let savedAttendeeId = null;
let savedOrganizerId = null;

chai.use(chaiHttp);

describe('Delete events and users collections, insert test user', () => {
 beforeEach(() => {
        eventModel.remove({}, (err) => {
        });
        userModel.remove({}, (err) => {
        });
        const attendeeUser = new userModel({ username: 'attendeeUser', password: 'test', email: 'attendeeUser@test.com', fullname: 'Attendee User'});
        const organizerUser = new userModel({ username: 'organizerUser', password: 'test', email: 'organizerUser@test.com', fullname: 'Organizer User'});
        attendeeUser.save(function (err, savedUser){
          if(err){
            console.log(err);
          }else{
            savedAttendeeId = savedUser._id;
            chai.request(app)
            .post('/users/attendeeUser/roles/attendee')
            .end((err, res) => {
              if(err){
                console.log(err);
              }
            });
          }
        });
        organizerUser.save(function (err, savedUser){
          if(err){
            console.log(err);
          }else{
            savedOrganizerId = savedUser._id;
            chai.request(app)
            .post('/users/organizerUser/roles/organizer')
            .end((err, res) => {
              if(err){
                console.log(err);
              }
            });
          }
        });
    });

  describe('/GET all events', () => {
    it('it should GET all the events', (done) => {
      chai.request(app)
        .get('/events')
        .auth('organizerUser', 'test')
        .end((err, res) => {
          console.log('Error' + err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/GET event by id', () => {
    it('it should GET an event by its id', (done) => {
      console.log("savedAttendeeId: "+ savedAttendeeId);
      const newEvent = new eventModel({_id: 1, title: "Feria de Libros", description: "Conferencias y venta", date : "2017-06-15", organizer: savedOrganizerId});
      console.log(newEvent);
      newEvent.save((err, newEvent) => {
        console.log('*******ERROR*******' + err);
        console.log(newEvent);
        chai.request(app)
        .get('/events/' + newEvent._id)
        .auth('attendeeUser', 'test')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('date');
          //res.body.should.have.property('_id').eql(newEvent._id);
          done();
        });
      });
    });

    it('it should return status 404 if event doesn\'t exist', (done) => {
      chai.request(app)
        .get('/events/' + 6)
        .auth('test', 'testPassword')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql({});
          done();
        });
    });
  });

  describe('/POST event ', () => {
    it('it should POST an event',(done) => {
      const newEvent = {id: 7, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15", organizer: savedOrganizerId};
      chai.request(app)
        .post('/events/')
        .auth('test', 'testPassword')
        .send(newEvent)
        .end((err,res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('date');
          res.body.should.have.property('_id').eql(7);
          done();
        })
    });

    it('it shouldn\'t POST an existent event', (done) => {
      const event = new eventModel({_id: 7, title: "Feria de Libros", description: "Conferencias y venta", date : "2017-06-15", organizer: savedOrganizerId});
      event.save((err, event) => {
        const newEvent = {id: 7, title: "Feria de Libros", description: "Conferencias y venta", date : "2017-06-15"};
        chai.request(app)
        .post('/events')
        .auth('test', 'testPassword')
        .send(newEvent)
        .end((err,res) => {
          res.should.have.status(409);
          res.body.should.be.eql({});
          done();
        });
      });
    });
  });

  describe('/PUT event', () => {
    it('it should PUT an existent event with all properties', (done) => {
      const newEvent = new eventModel({_id: 2, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15", organizer: savedOrganizerId});
      newEvent.save((err, event) => {
        const updatedEvent = {id: event._id, title: "Pair Programming con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
        chai.request(app)
          .put('/events/' + event._id)
          .auth('test', 'testPassword')
          .send(updatedEvent)
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('date');
            res.body.should.have.property('_id').eql(event._id);
            done();
          });
      });
    });

    it('it should PUT an existent event with optional properties', (done) => {
      const newEvent = new eventModel({_id: 2, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15", organizer: savedOrganizerId});
      newEvent.save((err,event) => {
        const updatedEvent = {id: event._id, title: "Webinar TDD con CHAI"};
        chai.request(app)
          .put('/events/' + event._id)
          .auth('test', 'testPassword')
          .send(updatedEvent)
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('date');
            res.body.should.have.property('_id').eql(event._id);
            done();
          });
        });
    });

    it('it shouldn\'t PUT a non existent event', (done) => {
      const updatedEvent = {id: 7, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15"};
      chai.request(app)
        .put('/events/' + 7)
        .auth('test', 'testPassword')
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
      const newEvent = new eventModel({_id: 2, title: "Webinar TDD con CHAI", description: "Prueba con CHAI", date : "2017-04-15", organizer: savedOrganizerId});
      newEvent.save((err,event) => {
        chai.request(app)
        .delete('/events/' + event._id)
        .auth('test', 'testPassword')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          done();
        });
      });
    });

    it('it shouldn\'t DELETE a non existent event', (done) => {
      chai.request(app)
        .delete('/events/' + 9)
        .auth('test', 'testPassword')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql({});
          done();
        });
    })
  });

  describe('/GET events by Title', () => {
    it('it should get all events containing a given title', (done) => {
      const newEvent1= new eventModel({_id: 1, title: "Feria de Libros", description: "Conferencias y venta", date : "2017-06-15", organizer: savedOrganizerId});
      const newEvent2= new eventModel({_id: 2, title: "Feria Gastronomica", description: "Gallo Pinto y Pupusas", date : "2017-06-15", organizer: savedOrganizerId});
      newEvent1.save((err, newEvent1) => {
          newEvent2.save((err,newEvent2) => {
          chai.request(app)
          .get('/events/title/' + "feria")
          .auth('test', 'testPassword')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            done();
          });
        });
      });
    });
  });
});


