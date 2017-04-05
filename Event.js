class Event {
	constructor(_id, title, description, date) {
		this._id = _id;
		this.title=title;
		this.description=description;
		this.date=date;
	}
}

exports.Event = Event;
