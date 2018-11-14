const express = require('express');
const hbs = require('hbs');
const fetch = require("node-fetch");
const request = require("request");
const fs = require("fs");

const port = process.env.PORT || 8080;

var app = express();
var url ='';

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

hbs.registerHelper('message', (text) => {
	return text.toUpperCase();
})


// hbs.registerHelper('getImage', () => {
// 	app.send('<img src=')
// })


// hbs.registerHelper('', () => {})

// app.use((request,response, next) => {	
	// response.render('maintenance.hbs', {
	//	 title: 'Maintenance Page',
	//	 time: new Date().toString()
	// });
// });

app.use((request, response, next) => {
	var time = new Date().toString();
	console.log(`${time}: ${request.method} ${request.url}`);
	var log = `${time}: ${request.method} ${request.url}`;
	fs.appendFile('server.log', log + '\n', (error) => {
		if (error) {
			console.log('Unable to log message');
		}
	});
	next();
});

app.get('/', (request, response) => {
    response.send('<h1>Home Page</h1>' +
        '<a href="/about">About me</a>' +
        '<p></p>' +
        '<a href="/image">Image</a>' + 
        '<p></p>' +
        '<a href="/empty_page">Empty page</a>');
});

app.get('/about', (request, response) => {
	response.render('about.hbs', {
		title: 'About page',
		year: new Date().getFullYear(),
		welcome: 'Hello!'
	});
});

app.get('/image', (request, response) => {
	response.render('image.hbs', {
		title: 'Image page',
		year: new Date().getFullYear(),
		welcome: 'image page',
		image: url
	});
});

app.get('/404', (request, response) => {
	response.send({
		error: 'Page not found'
	})
})

app.listen(port, () => {
	console.log('Server is up on the port ${port}');
	request({
	        url: 'https://jsonplaceholder.typicode.com/photos/1',
	        json: true
	    }, (error, response, body) => {
	    	url = body.url;
	    });
});