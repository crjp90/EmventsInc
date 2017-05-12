const express = require('express')
const bodyParser = require('body-parser');

const events = require('./routes/events');
const users = require('./routes/users');
const app = express();

app.use(bodyParser.json());
app.use('/events', events);
app.use('/users', users);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
