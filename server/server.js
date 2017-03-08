var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require("path"),
	config = require('./libs/config'),
	log = require('./libs/log')(module),
	ListModel = require('./libs/mongoose').ListModel,
	router = require('router'),
	list = require('./libs/api/list');

app.use(bodyParser());
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/', express.static(__dirname + '/../app'));
app.use('/js', express.static(__dirname + '/../app/js'));
app.use('/css', express.static(__dirname + '/../app/css'));
app.use('/api/lists', list);



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/../app', 'index.html'));
});



/*-- prod --

app.use('/js', express.static(__dirname + '/../build/js'));
app.use('/css', express.static(__dirname + '/../build/css'));
app.use('/images', express.static(__dirname + '/../build/images'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/../build', 'index.html'));
});

--*/

app.listen(config.get('port'), function(){
    log.info('Server listening on port ' + config.get('port'));
});