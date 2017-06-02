const express = require('express');
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const router = express.Router();
const eventManager = require('./eventsManager');
const User = require('../models/user.js');
const mongoose = require('mongoose');
 const moduloacl = require('acl');
let acl = null;


function logger() 
{ 
    return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
}

 let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
 acl = new moduloacl(mongoBackend, logger());

function aclMiddleware(req, res, next) {
  acl.isAllowed(req.user._id, req.url, req.method, (err, isAllowed) => {
    console.log(isAllowed);
    if(isAllowed) {
      next();
    }
    else {
      res.notAllowed;
    }
  });
}

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

router.get('/', [authenticated, acl.middleware( 1, get_user_id) ], (req, res) => {
     eventManager.getAll()
    .then(
      events => res.json(events)
    ).catch(
      error => res.status(500).send('Se encontro un error ' + error)
    )
});

function get_user_id(request, response)  {
  return request.user && request.user.id.toString()  || false;
}

function authenticated(request, response, next) {
  if (request.isAuthenticated() ) {
    return next();
  }
  response.send(401, 'User not authenticated');
}

router.get('/:id', [authenticated, acl.middleware( 1, get_user_id) ], (req, res) => {
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

router.get('/title/:title', [authenticated, acl.middleware( 1, get_user_id) ], (req,res) => {
  const titleBuscado = req.params.title;
  eventManager.getEventsByTitle(titleBuscado)
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.get('/organizer/:organizer', [authenticated, acl.middleware( 1, get_user_id) ], (req,res) => {
  const organizer = req.params.organizer;
  eventManager.getEventsByOrganizer(organizer)
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.post('/:eventid/signup', [authenticated, acl.middleware( 1, get_user_id) ], (req,res) => {
  const eventid = req.params.eventid;
  eventManager.signupToEvent(eventid, req.user._id)
  .then(
    event => {
      if (event == -1) {
        res.status(404).send('No se puede registrar a un evento que no existe')
      }else{
        if (event == 422) {
          res.status(422).send('Ya se encuentra registrado en este evento');
        }
        else {
          res.status(200).json(event)
        }
      }
    }
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.post('/', [authenticated, acl.middleware( 1, get_user_id) ], (req,res) => {
  eventManager.createEvent(req.body.id, req.body.title, req.body.description, req.body.date, req.user._id)
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

router.put('/:id', [authenticated, acl.middleware( 1, get_user_id) ], (req,res) => {
  eventManager.updateEvent(req.params.id, req.body.title, req.body.description, req.body.date, req.user._id)
  .then(
    event => {
      if (event == -1) {
        res.status(404).send('No se puede actualizar un evento que no existe')
      }
      else {
        if (event == 401) {
          res.status(401).send('Unauthorized');
        }
        else {
          res.status(200).json(event);
        }
      }
    })
  .catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.delete('/:id', [authenticated, acl.middleware( 1, get_user_id) ], (req, res) => {
  eventManager.deleteEvent(req.params.id, req.user._id)
  .then(
    event => {
      if (event == -1) {
        res.status(404).send('No se puede eliminar un evento que no existe');
      }
      else {
        if (event == 401) {
          res.status(401).send('Unauthorized');
        }
        else
        {
          res.status(200).json(event);
        }
      }
    })
  .catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

module.exports = router;
