const express = require('express')
const Event = require('./Event').Event;
const bodyParser = require('body-parser');
const EventModel = require('./EventModel');
const app = express();

function getAll(){
		return new Promise( function (resolve, reject) {
			try{
				EventModel.find({},(err,events) => {
					if(err){
						reject(err);
					}else{
						resolve(events);
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
			EventModel.findById(Number(_id), (err,event) => {
				if(err){
					reject(err);
				}
				else{
					resolve(event);
				}
			});
		}
		catch(ex){
			reject(ex);
		}
	});
}

function createEvent(_id,title,description,date){
	return new Promise( function (resolve, reject) {
		try{
			EventModel.findById(Number(_id), (err, event) => {
				if(err){
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
            resolve(undefined);
          }
				}
			});
		}
		catch(ex){
			reject(ex);
		}
	});
}

function updateEvent(_id, title, description, date) {
	return new Promise( (resolve, reject) => {
		try {
			EventModel.findById(Number(_id), (err, event) => {
				if(err){
					reject(err);
				}
				else{
					if (event) {
						if (title != undefined) {
							event.title = title;
						}
						if (description != undefined) {
							event.description = description;
						}
						if (date != undefined) {
							event.date = date;
						}
						event.save((err) =>{
							if(err){
								reject(err);
							}
							else{
								console.log("Updated the event with the field _id equal to " + _id);
								resolve(event);
							}
						});
					}
					else{
						resolve(-1);
					}
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
				EventModel.findById(Number(_id), (err, event) => {
					if(err){
						reject(err);
					}
					else{
						if(event){
							event.remove((err) => {
								if(err){
									reject(err);
								}
								else{
									console.log("Deleted the event with the field _id equal to " + _id);
									resolve(_id);
								}
							});
						}
						else{
							resolve(-1);
						}
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
