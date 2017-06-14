const express = require('express');
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../models/user.js');
const router = express.Router();
const userManager = require('./usersManager');
const mongoose = require('mongoose');
const moduloacl = require('acl');
let acl = null;

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

router.all('/:id/events', passport.authenticate('basic', {session: false}));


function logger() 
{ 
    return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
}

 let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
 acl = new moduloacl(mongoBackend, logger());

router.post('/', (req,res) => {
  userManager.createUser(req.body.username, req.body.password, req.body.email, req.body.fullname)
  .then(
    user => {
      if(user != undefined ){
        res.status(201).json(user)
      }else{
        res.status(409).send('Ya existe un usuario con ese username');
      }
    }
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});


router.get('/:id/events', /*[authenticated, acl.middleware( 1, get_user_id) ],*/ (req,res) => {
  const userId = req.params.id;
  userManager.getUpcomingEventsByUser(userId)
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.post('/:username/roles/:role', (req, res) => {
  userManager.getUserByUsername(req.params.username)
  .then(
    user => {
      if (user) {
        acl.addUserRoles(user._id.toString(), req.params.role, (err) => {
          if (err) { res.status(500).send('Se encontró un error ' + err)}
            else { res.status(201).send('Rol asignado correctamente'); }
        }); 

      } 
      else {res.status(404).send('No existe el usuario ' + req.params.username);}
    }).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.get('/:username/roles', (req, res) => {
  userManager.getUserByUsername(req.params.username)
  .then(
    user => {
      if (user) {
        acl.userRoles(user._id.toString(), (err, roles) => {
          if (err) { res.status(500).send('Se encontró un error ' + err)}
            else { res.status(200).json(roles); }
        }); 
      } 
      else {res.status(404).send('No existe el usuario ' + req.params.username);}
    }).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

module.exports = router;
