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

eventsArray.push(new Event('1', 'Conferencia', 'Node.js, Pair Programming', '2017-03-15'));
eventsArray.push(new Event('2', 'Concierto', 'Sinfonica', '2017-03-11'));
eventsArray.push(new Event('3', 'Cita Dentista', 'Limpieza Dental', '2017-03-09'));
eventsArray.push(new Event('4', 'Clases de frances', 'Iniciando', '2017-03-01'));
eventsArray.push(new Event('5', 'Cena', 'Conunidad Agile', '2017-02-15'));

app.get('/', (req, res) => {
  res.send('Got a GET request!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.get('/events', (req, res) => {
  res.json(eventsArray);
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})