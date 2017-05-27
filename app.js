const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const moduloacl = require('acl');
// let acl = null;

const events = require('./routes/events');
const users = require('./routes/users');
const app = express();

// let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);


// function logger() 
// { 
// 		return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
// }

// acl = new moduloacl(mongoBackend, logger());




// acl = new node_acl( mongoBackend, logger() );

// acl.allow('organizer', '/events', ['edit', 'view', 'post']);

// // Attendees are allowed to:
// // - Sign up to events
// acl.allow('attendee', '/events', 'get');
// acl.allow('attendee', 'events/:eventid/signup', 'post');

// // prueba:
// acl.addUserRoles('ccalvarez', 'attendee');
// acl.addUserRoles('test', 'organizer');

app.use(bodyParser.json());

// app.use( function (req, res, next) {
// 	req.acl = acl;
// 	next();
// });

app.use('/events', events);
app.use('/users', users);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
