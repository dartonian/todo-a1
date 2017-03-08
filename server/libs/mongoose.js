var mongoose = require('mongoose'),
	log = require('./log')(module),
	config = require('./config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('error:', err.message);
});
db.once('open', function callback () {
    log.info("success");
});

var Schema = mongoose.Schema,
	List = new Schema({
	    title: String,
	    items: []
	}),
	ListModel = mongoose.model('List', List);

module.exports.ListModel = ListModel;