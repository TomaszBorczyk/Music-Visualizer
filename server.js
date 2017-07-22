const express = require('express'),
			path = require('path'),
			bodyParser = require('body-parser'),
			mongoose = require('mongoose'),
			index = require('./server/routes/index'),
			tracks = require('./server/routes/tracks'),
			config = require('./server/config/config'),
			cookieParser = require('cookie-parser'),
			passport = require('passport'),
			localStrategy = require('passport-local').Strategy;


const port = 4567;
var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static folder
app.use(express.static(path.join(__dirname, 'dist')));

//app configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport configuration
var User = require('./server/models/user.model');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//adding routes
require('./server/routes/router')(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//connecting to database and listening on port
if(process.env.NODE_ENV === "test"){
	mongoose.connect(config.db_test);
	if(!module.parent){
    app.listen(port);
	}
  console.log('App runs in test mode');
}else{
 	mongoose.connect(config.db_dev);
	if(!module.parent){
    app.listen(port);
	}
 	console.log('App runs in develop mode');
}

module.exports = app;
