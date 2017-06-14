/*eslint no-console: "error"*/
var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

//Setting up view engine
var handlebars = require('express-handlebars')
    .create({defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Setting port
app.set('port', process.env.PORT || 3000);

//Static middleware
app.use(express.static(__dirname + '/public'));

//Setting up unit tests
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

//Getting them pages
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/teams/hearthstone', function(req, res){
    res.render('teams/hearthstone')
});

app.get('/teams/leagueOfLegends', function(req, res){
    res.render('teams/leagueOfLegends')
});

app.get('/teams/requestcoaching', function(req, res){
    res.render('teams/requestcoaching');
});



//Custom 404 page / catch-all handler middleware
app.use(function(req, res){
    res.status('404');
    res.render('404');
});

//Custom 500 page / error handler middleware
app.use(function(err, req, res){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
