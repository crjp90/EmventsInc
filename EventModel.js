const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/events');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  _id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
