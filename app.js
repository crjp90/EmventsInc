const express = require('express')
const Event = require('./Event').Event;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');

const EventModel = require('./EventModel');

const app = express();
const url = 'mongodb://localhost:27017/events';

let eventsdb;

MongoClient.connect(url, (err, db) => {
	assert.equal(null, err);
	console.log('Connected successfully to server');
	eventsdb = db;
});

function getAll(){
		return new Promise( function (resolve, reject) {
			try{
				const collection = eventsdb.collection('events');
				collection.find({}).toArray((err, docs) => {
					if (err) {
						reject(err);
					}
					else
					{
						resolve(docs);
					}
				});
			}
			catch(ex){
				reject(ex);
			}
		});
	};
function getEventById(_id){
	return new Promise( function (resolve, reject) {
		try{
			const collection = eventsdb.collection('events');
			collection.findOne({_id: Number(_id)}, (err, doc) => {
				if (err) {
					reject(err);
				}
				else
				{
					resolve(doc);
				}
			});
		}
		catch(ex){
			reject(ex);
		}
	});
}

function createEvent(_id,title,description,date){
	console.log('entre a createEvent');
	console.log(_id);

	return new Promise( function (resolve, reject) {
		try{
			EventModel.findById(Number(_id), (err, event) => {
				console.log(event);
				console.log(!event);
				if(err){
					console.log(err);
					reject(err);
				}
				else
				{
					if (!event) {
            const newEvent = EventModel({
              _id : _id,
              title: title,
              description: description,
              date:  new Date(date)
            });

            newEvent.save((err) => {
              if (err) {
              	console.log(err);
                reject(err);
              }
              else
              {
                console.log('Inserted 1 event into the collection');
                resolve(newEvent);
              }
            });
          }
          else
          {
          	console.log('ya existe');
            resolve(undefined);
          }
				}
			});
		}
		catch(ex){
			console.log(ex);
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

function deleteEvent(_id){
		return new Promise( function (resolve, reject) {
			try{
				const collection = eventsdb.collection('events');
				collection.findOne({ _id: Number(_id)}, (err, doc) => {
				if (doc) {
					collection.deleteOne({ _id: Number(_id)}, (err, result) => {
						if(err){
							reject(err);
						}else{
							assert.equal(1, result.result.n);
							console.log("Deleted the event with the field _id equal to " + _id);
							resolve(_id);
						}
					});
				}else{
					resolve(-1);
				}
			});
		}catch(ex){
			reject(ex);
		}
	});
}

app.use(bodyParser.json());

app.get('/events', (req, res) => {
	getAll()
	.then(
		events => res.json(events)
	).catch(
		error => res.status(500).send('Se encontro un error ' + error)
	)
})

app.get('/events/:id', (req, res) => {
	const idBuscado = req.params.id;
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
