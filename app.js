const express = require('express')
const app = express();

const Event = require('./Event').Event;
const bodyParser = require('body-parser');
const eventsArray = new Array();
/*class EventManager {
	constructor() {*/

		eventsArray.push(new Event(1, 'Conferencia', 'Node.js, Pair Programming', '2017-03-15'));
		eventsArray.push(new Event(2, 'Concierto', 'Sinfonica', '2017-03-11'));
		eventsArray.push(new Event(3, 'Cita Dentista', 'Limpieza Dental', '2017-03-09'));
		eventsArray.push(new Event(4, 'Clases de frances', 'Iniciando', '2017-03-01'));
		eventsArray.push(new Event(5, 'Cena', 'Conunidad Agile', '2017-02-15'));
	/*}*/

	function getAll(){
		return new Promise( function (resolve, reject) {
			try{
				resolve(eventsArray);
			}
			catch(ex){
				reject(ex);
			}
		});
	};

	function getEventById(id){
		return new Promise( function (resolve, reject) {
			try{
				let eventoEncontrado = eventsArray.find(evento => evento.id == id);
				resolve(eventoEncontrado);
			}
			catch(ex){
				reject(ex);
			}
		});
	}

	function createEvent(id,title,description,date){
		return new Promise( function (resolve, reject) {
			try{
				let idEncontrado = eventsArray.find(evento => evento.id == id);
				if(idEncontrado == undefined){
					let newEvent = new Event(id, title, description, date);
					eventsArray.push(newEvent);
					resolve(newEvent);
				}else{
					resolve(undefined);
				}
			}
			catch(ex){
				reject(ex);
			}
		});
	}

//const eventManager = new EventManager();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Got a GET request!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})


app.get('/events', (req, res) => {
	getAll()
	.then(
		events => res.json(events)
	).catch(
		error => res.status(500).send('Se encontro un error ' + error)
	)
})

app.get('/events/:id', (req, res) => {
	let idBuscado = req.params.id;
	getEventById(idBuscado)
	.then(
		event => {
			if (event == undefined){
				res.status(404).send('El evento no existe.');
			}
			else {
				res.json(event);
			}
		}
	).catch(
		error => res.status(500).send('Se encontró un error ' + error)
	)
})

app.post('/events', (req,res) => {
	createEvent(req.body.id, req.body.title, req.body.description, req.body.date)
	.then(
		event => {
			if(event != undefined ){
				res.status(201).json(event)
			}else{
				res.status(409).send('Ya existe un evento con ese id');
			}
		}
	).catch(
		error => res.status(500).send('Se encontró un error ' + error)
	)
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
			if (req.body.title != undefined) {
				eventsArray[indice].title = req.body.title;
			}
			if (req.body.description != undefined) {
				eventsArray[indice].description = req.body.description;
			}
			if (req.body.date != undefined) {
				eventsArray[indice].date = req.body.date;
			}

			res.status(200).json(eventsArray[indice]);
		}
	}catch(ex){
		res.status(500).send('Se encontró un error.')
	}
})

app.delete('/events/:id', (req, res) => {
	try{
		let indice = eventsArray.findIndex(evento => evento.id == req.params.id);
		if (indice == -1)
		{
			res.status(404).send('No se puede eliminar un evento que no existe');
		}
		else{
			eventsArray.splice(indice,1);
			res.status(200).json(req.params.id);
		}
	}catch(ex){
		res.status(500).send('Se encontró un error.')
	}
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
