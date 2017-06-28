const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const events = require('./routes/events');
const users = require('./routes/users');
const roles = require('./routes/roles');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));

app.use('/events', events);
app.use('/users', users);
app.use('/roles', roles);

app.listen(5000, () => {
  console.log('Example app listening on port 5000!')
})

module.exports = app;
