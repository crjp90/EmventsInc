const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moduloacl = require('acl');
let acl = null;


function logger() 
{ 
    return { debug: function( msg ) { console.log( '-DEBUG-', msg ); } }; 
}

 let mongoBackend = new moduloacl.mongodbBackend(mongoose.connection.db);
 acl = new moduloacl(mongoBackend, logger());

router.get('/:role/resources', (req, res) => {
  acl.whatResources(req.params.role, (err, resources) => {
    if (err) { res.status(500).send('Se encontró un error ' + err)}
    else { res.status(200).json(resources); }
  }); 
});

module.exports = router;
