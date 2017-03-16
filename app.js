const express = require('express')
const app = express();
const eventsArray = new Array();

class Event { 
	constructor(id, title, description, date) { 
		this.id = id;
		this.title=title;
		this.description=description;
		this.date=date;
	} 
}

app.get('/', (req, res) => {
  res.send('Got a GET request!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})