const express = require('express');
const router = express.Router();
const userManager = require('./usersManager');

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
})

module.exports = router;
