let Event = null;
let acl = null;
const mongoose = require('mongoose');
const moduloacl = require('acl');

const connString = 'mongodb://localhost:27017/events';
mongoose.connect(connString);

function logger()
{
    return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } };
}

mongoose.connection.on('connected',  () => {
  console.log('Mongoose default connection open to ' + connString);
  // console.log('connection.hasOpened: ' + mongoose.connection._hasOpened);

  let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
  acl = new moduloacl(mongoBackend, logger());

  acl.allow([
      {
          roles:['organizer'],
          allows:[
              {resources:'/events', permissions: ['get', 'view', 'post']},
              {resources:'/events/:eventid', permissions: ['put', 'delete']}
          ]
      },
      {
          roles:['attendee'],
          allows:[
              {resources: '/events', permissions:['get', 'view']},
              {resources: '/events/:eventid/signup', permissions:['post']}
          ]
      }
  ])

    // acl.addUserRoles('592e1bdeccedc444acdfc2b6', 'attendee');  /*crjp*/
    // acl.addUserRoles('592e03e1415b34497c3c663e', 'organizer');  /*test*/

    // Instead use /POST /users/:username/roles/:role endpoint to assign a role to a user!

});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);

  mongoose.connection.on('connected', function() {

  });
});

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
    organizer: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Usuario'},
    signedUpUsers: [{type: Schema.Types.ObjectId, ref: 'Usuario'}]
  }
);

Event = mongoose.model('Event', eventSchema);

module.exports = Event;
