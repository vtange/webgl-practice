    var express = require('express');
    var path = require('path');
    var app = express();

    //always use CSS and JS in public to go with ejs output
    app.use(express.static(path.join(__dirname, 'public')));
	
	// set the view engine to ejs
	app.set('view engine', 'ejs');

	//load routes
	require('./routes/routes.js')(app);

//let Heroku/other host set port, else default 4000, and then listen
var port     = process.env.PORT || 4000;
app.listen(port);
console.log('The magic happens on port ' + port);