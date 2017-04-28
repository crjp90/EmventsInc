const express = require('express');
const router = express.Router();
const eventManager = require('./eventsManager');

router.get('/', (req, res) => {
  eventManager.getAll()
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontro un error ' + error)
  )
})

router.get('/:id', (req, res) => {
  const idBuscado = req.params.id;
  eventManager.getEventById(idBuscado)
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

router.get('/title/:title', (req,res) => {
  const titleBuscado = req.params.title;
  eventManager.getEventsByTitle(titleBuscado)
  .then(
    events => res.json(events)
  ).catch(
    error => res.status(500).send('Se encontró un error ' + error)
  )
});

router.post('/', (req,res) => {
  eventManager.createEvent(req.body.id, req.body.title, req.body.description, req.body.date)
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

router.put('/:id', (req,res) => {
  eventManager.updateEvent(req.params.id, req.body.title, req.body.description, req.body.date)
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

router.delete('/:id', (req, res) => {
  eventManager.deleteEvent(req.params.id)
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

module.exports = router;
