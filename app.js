const express = require('express')
const app = express();
const eventsArray = new Array();

const Event = require('./Event').Event;
const bodyParser = require('body-parser');

eventsArray.push(new Event(1, 'Conferencia', 'Node.js, Pair Programming', '2017-03-15'));
eventsArray.push(new Event(2, 'Concierto', 'Sinfonica', '2017-03-11'));
eventsArray.push(new Event(3, 'Cita Dentista', 'Limpieza Dental', '2017-03-09'));
eventsArray.push(new Event(4, 'Clases de frances', 'Iniciando', '2017-03-01'));
eventsArray.push(new Event(5, 'Cena', 'Conunidad Agile', '2017-02-15'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Got a GET request!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.get('/events', (req, res) => {
  res.json(eventsArray);
})

app.get('/events/:id', (req, res) => {
	let idBuscado = req.params.id;
	 try
	 {
		let eventoEncontrado = eventsArray.find(evento => evento.id == idBuscado);

		if (eventoEncontrado == undefined)  {
			res.status(404).send('El evento no existe.');
		}
		else {
			res.json(eventoEncontrado);
		}
	}
	catch(ex) {
		res.status(500).send('Se encontró un error.')
	}
})

app.post('/events', (req,res) => {
	try{

		let idEncontrado = eventsArray.find(evento => evento.id == req.body.id);

		if(idEncontrado == undefined){
			let newEvent = new Event(req.body.id, req.body.title, req.body.description, req.body.date);
			eventsArray.push(newEvent);
			res.status(201).json(newEvent);
		}else{
			res.status(409).send('Ya existe un evento con ese id');
		}
	}catch(ex){
		res.status(500).send('Se encontró un error.')
	}
})

app.put('/events/:id', (req,res) => {
	try{
		let indice = eventsArray.findIndex(evento => evento.id == req.params.id);

		if (indice == -1)
		{
			res.status(404).send('No se puede actualizar un evento que no existe')
		}
		else
		{
			let eventoActualizado = new Event(req.params.id, req.body.title, req.body.description, req.body.date);
			eventsArray[indice] = eventoActualizado;
			res.status(200).json(eventoActualizado);
		}
	}catch(ex){
		res.status(500).send('Se encontró un error.')
	}
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
