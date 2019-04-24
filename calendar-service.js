//Name: Gabe Unruh
//Course: CSC 337
//Description: This javascript file recieves and sends the data to and from events.txt


const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

//posts the event to the text file
app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let id = req.body.id
	let time = req.body.time;
	let title = req.body.title;
	let content = id + ':::' + time + ':::' + title + '\n'

	fs.appendFile('events.txt', content, function(err) {
    	if(err) {
			res.status(400);
    	}
    	res.send("Success!");
    	console.log("success");
	});
})

//gets all the lines from the text file and sends it
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	var fs = require("fs");
	let json = {};
	var events = fs.readFileSync('events.txt').toString().split("\n");
	json['events'] = events;
	res.send(JSON.stringify(json));
})

app.listen(process.env.PORT);
