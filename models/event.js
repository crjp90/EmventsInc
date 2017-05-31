let Event = null;
// let acl = null;
const mongoose = require('mongoose');
// const moduloacl = require('acl');

const connString = 'mongodb://localhost:27017/events';
mongoose.connect(connString);

// function logger() 
// { 
//     return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
// }

mongoose.connection.on('connected',  () => {
  console.log('Mongoose default connection open to ' + connString);
  // console.log(mongoose.connection._hasOpened);

  // let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
  // acl = new moduloacl(mongoBackend, logger());
  
//   acl.allow('organizer', '/events', ['edit', 'view', 'post']);

//   // Attendees are allowed to:
//   // - Sign up to events
//   acl.allow('attendee', ['/events', 'events/:eventid/signup'], 'get');
//   //acl.allow('attendee', 'events/:eventid/signup', 'post');

//   // prueba:
//   acl.addUserRoles('ccalvarez', 'attendee');
//   acl.addUserRoles('test', 'organizer');

//   acl.allowedPermissions('ccalvarez', ['/events'], function(err, permissions)
//     { console.log(' Los permisos son:');
//     console.log(permissions);
//     });

// acl.userRoles( 'ccalvarez', function(err, roles) {
//   console.log('los roles de ccalvarez son:');
//   console.log(roles);
// });

});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);

  mongoose.connection.on('connected', function() {

  });
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

const Schema = mongoose.Schema;
const eventSchema = new Schema(
  {
    _id: { type: Number, required: true },
    title: { type: String, required: true, index: true},
    description: { type: String, required: true },
    date: { type: Date },
    organizer: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
    signedUpUsers: {type: Array, required: false, index: true, ref: 'User'}
  }
);

Event = mongoose.model('Event', eventSchema);


module.exports = Event;
