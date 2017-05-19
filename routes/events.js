const express = require('express');
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const router = express.Router();
const eventManager = require('./eventsManager');
const User = require('../models/user.js');
const mongoose = require('mongoose');
let acl = require('acl');

acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));

passport.use(new BasicStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err); }
      if (!user) {
        return done(null, false); }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

router.all('*', passport.authenticate('basic', {session: false}));

router.get('/', (req, res) => {
    eventManager.getAll()
    .then(
      events => res.json(events)
    ).catch(
      error => res.status(500).send('Se encontro un error ' + error)
    )
});

router.get('/:id', (req, res) => {
  const idBuscado = req.params.id;
  eventManager.getEventById(idBuscado)
  .then(
    event => {
      if (event == undefined){
        res.status(404).send('El evento no existe.');
      }
      else {
        res.json(event);
      }
    }
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.get('/title/:title', (req,res) => {
  const titleBuscado = req.params.title;
  eventManager.getEventsByTitle(titleBuscado)
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.post('/', (req,res) => {
  eventManager.createEvent(req.body.id, req.body.title, req.body.description, req.body.date, req.user.username)
  .then(
    event => {
      if(event != undefined ){
        res.status(201).json(event)
      }else{
        res.status(409).send('Ya existe un evento con ese id');
      }
    }
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.put('/:id', (req,res) => {
  eventManager.updateEvent(req.params.id, req.body.title, req.body.description, req.body.date)
  .then(
    event => {
      if (event == -1) {
        res.status(404).send('No se puede actualizar un evento que no existe')
      }
      else {
        res.status(200).json(event);
      }
    })
  .catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.delete('/:id', (req, res) => {
  eventManager.deleteEvent(req.params.id)
  .then(
    event => {
      if (event == -1) {
        res.status(404).send('No se puede eliminar un evento que no existe');
      }
      else
      {
        res.status(200).json(event);
      }
    })
  .catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

module.exports = router;
