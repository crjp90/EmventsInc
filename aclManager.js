let acl = null;
const mongoose = require('mongoose');
const moduloacl = require('acl');

const connString = 'mongodb://localhost:27017/events';
mongoose.connect(connString);

function logger() 
{ 
    return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
}

function initACL() {
	mongoose.connect(connString);
}

mongoose.connection.on('connected',  () => {
	console.log('ACL connection open to ' + connString);

  	let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
  	acl = new moduloacl(mongoBackend, logger());
  
	acl.allow([
	    {
	        roles:['organizer'],
	        allows:[
	            {resources:'events', permissions: ['get', 'view']}
	        ]
	    },
	    {
	        roles:['attendee'],
	        allows:[
	            {resources:'events', permissions:['get', 'view']},
	            {resources:['events/:eventid/signup'], permissions:['post']}
	        ]
	    }
	])

	acl.removeAllow( 'organizer', 'events', ['post', 'edit'], function(err) {
		console.log(err);
	});

	acl.removeUserRoles('test', ['organizer'], function(err) {
		console.log(err);
	});

  	// Asignación de roles a usuarios:
  	// acl.addUserRoles('592e0427415b34497c3c663f', 'attendee'); /*ccalvarez*/
  	// acl.addUserRoles('592e03e1415b34497c3c663e', 'organizer');  /*test*/

  	acl.addUserRoles('ccalvarez', ['attendee', 'organizer']); /*ccalvarez*/
  	acl.addUserRoles('test', 'attendee');  /*test*/
  	acl.addUserRoles('crjp', 'attendee');  /*test*/



acl.isAllowed('ccalvarez', 'events', 'view', function(err, res)
	{ if(res)
		{ console.log("User ccalvarez is allowed to view events") } 
		else
			{console.log("User ccalvarez is NOT ALLOWED to view events")}
});

  	//por username:
acl.allowedPermissions('crjp', ['events'], function(err, permissions)
    { 
      console.log(' Los permisos de crjp sobre events son:');
      console.log(permissions);
    });

  acl.userRoles( 'crjp', function(err, roles) {
      console.log('los roles de crjp son:');
      console.log(roles);
  });

  	acl.allowedPermissions('ccalvarez', ['events'], function(err, permissions)
    { 
      console.log(' Los permisos de ccalvarez sobre events son:');
      console.log(permissions);
    });

  acl.userRoles( 'ccalvarez', function(err, roles) {
      console.log('los roles de ccalvarez son:');
      console.log(roles);
  });

  acl.allowedPermissions('test', ['events'], function(err, permissions)
    { console.log(' Los permisos de test sobre events son:');
      console.log(permissions);
    });

  acl.userRoles( 'test', function(err, roles) {
      console.log('los roles de test son:');
      console.log(roles);
  });

  acl.roleUsers('attendee', function(err, users) {
  	console.log('los usuarios que tienen rol attendee son:');
  	console.log(users);
  });


  // por id:
  acl.allowedPermissions('592e0427415b34497c3c663f', ['events'], function(err, permissions)
    { 
    	console.log(' Los permisos de ccalvarez por id sobre events son:');
    	console.log(permissions);
    });

	acl.userRoles('592e0427415b34497c3c663f', function(err, roles) {
  		console.log('los roles de ccalvarez por id son:');
  		console.log(roles);
	});

	acl.allowedPermissions('592e03e1415b34497c3c663e', ['events'], function(err, permissions)
    { console.log(' Los permisos de test por id sobre events son:');
    	console.log(permissions);
    });

	acl.userRoles('592e03e1415b34497c3c663e', function(err, roles) {
  		console.log('los roles de test por id son:');
  		console.log(roles);
	});

});

module.exports = {initACL};
