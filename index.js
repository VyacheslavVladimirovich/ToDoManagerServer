//load libs
var https = require('https'),
    http = require('http'),
    express = require('express'),
    fs = require("fs");
var bodyParser = require('body-parser');

//create http application
var app = express();

//sets port
app.set('port', process.env.PORT || 8000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//default test route
app.get('/', function (req, res) {
    res.json({"server_state": "Ok"});
});

//connect router
require('./route/Router.js')(app);

//start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
