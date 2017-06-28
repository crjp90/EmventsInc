const EventModel = require('../models/event');

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

function getEventsByTitle(title){
  return new Promise( function (resolve,reject){
    try{
      EventModel.find( { "title": { "$regex": title, "$options": "i" } }, (err,events) =>{
        if(err){
          reject(err);
        }
        else{
          resolve(events);
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

module.exports = {getAll, getEventById, getEventsByTitle, createEvent, updateEvent, deleteEvent};
