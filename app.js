const express = require('express')
const app = express();

const Event = require('./Event').Event;
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient
, assert = require('assert');

const url = 'mongodb://localhost:27017/events';

let eventsdb;

MongoClient.connect(url, (err, db) => {
	assert.equal(null, err);
	console.log('Connected successfully to server');
	eventsdb = db;
});


const eventsArray = new Array();
		eventsArray.push(new Event(1, 'Conferencia', 'Node.js, Pair Programming', '2017-03-15'));
		eventsArray.push(new Event(2, 'Concierto', 'Sinfonica', '2017-03-11'));
		eventsArray.push(new Event(3, 'Cita Dentista', 'Limpieza Dental', '2017-03-09'));
		eventsArray.push(new Event(4, 'Clases de frances', 'Iniciando', '2017-03-01'));
		eventsArray.push(new Event(5, 'Cena', 'Conunidad Agile', '2017-02-15'));

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

	function createEvent(_id,title,description,date){
		return new Promise( function (resolve, reject) {
			try{
				let idEncontrado = eventsArray.find(evento => evento._id == _id);

				if(idEncontrado == undefined){

					let newEvent = new Event(_id, title, description, date);

					let insertEvent = (db, callback) => {
						let collection = db.collection('events');
						collection.insertOne(newEvent, (err, result) => {
							if (err) {
								reject(err);
							}
							else {
								assert.equal(1, result.result.n);
								assert.equal(1, result.ops.length);
								console.log('Inserted 1 event into the collection');
								callback(result);
							}
						});
					};

					insertEvent(eventsdb, () => {
						resolve(newEvent);
					});
				}else{
					resolve(undefined);
				}
			}
			catch(ex){
				reject(ex);
			}
		});
	}

function updateEvent(_id, title, description, date) {
	return new Promise( (resolve, reject) => {
		try {
			const collection = eventsdb.collection('events');

			collection.findOne({ _id: Number(_id)}, (err, doc) => {

				if (doc) {
					let foundEvent = doc;

					if (title != undefined) {
						foundEvent.title = title;
					}
					if (description != undefined) {
						foundEvent.description = description;
					}
					if (date != undefined) {
						foundEvent.date = date;
					}

					// Update in MongoDB:
					collection.update( { _id: foundEvent._id }, foundEvent, (err, result) => {
						if (err) {
							reject(err);
						}
						else {
							assert.equal(1, result.result.n);
							console.log("Updated the event with the field _id equal to " + _id);

							// Resolve the promise:
							resolve(foundEvent);
						}
					});
				}
				else
				{
					resolve(-1);
				}
			});
		}
	 	catch(ex) {
		 	reject(ex);
		}
	});
}

function deleteEvent(id){
		return new Promise( function (resolve, reject) {
			try{
				let indice = eventsArray.findIndex(evento => evento.id == id);
				if (indice == -1) {
					resolve(-1);
				}
				else {
					eventsArray.splice(indice,1);
					resolve(id);
				}
			}
			catch(ex){
				reject(ex);
			}
		});
	}

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
	updateEvent(req.params.id, req.body.title, req.body.description, req.body.date)
	.then(
		event => {
			if (event == -1) {
				res.status(404).send('No se puede actualizar un evento que no existe')
			}
			else {
				res.status(200).json(event);
			}
		})
	.catch(
		error => res.status(500).send('Se encontró un error ' + error)
	)
})

app.delete('/events/:id', (req, res) => {
	deleteEvent(req.params.id)
	.then(
		event => {
			if (event == -1) {
				res.status(404).send('No se puede eliminar un evento que no existe');
			}
			else
			{
				res.status(200).json(event);
			}
		})
	.catch(
		error => res.status(500).send('Se encontró un error ' + error)
	)
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
