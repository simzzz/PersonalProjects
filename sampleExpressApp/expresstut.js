// Series of possible responses depending on the requested URL
// As we do that we will perform different actions
//If response is valid, we will display correct view otherwise we will handle errors

var express = require("express");

var app = express();

app.disable('x-powered-by'); //Hides information about our server for security reasons


//Defining that main.handlebars is our default layout
var handlebars = require('express-handlebars').create({defaultLayout:'main'});



app.engine('handlebars', handlebars.engine);

//Makes sure our HTML in views directory is transported to the main.handlebars layouts
app.set('view engine', 'handlebars');

//TODO: MORE IMPORTS
//This is gonna be required for when we use post for parsing data and code
app.use(require('body-parser').urlencoded({extended:true}));

var formidable = require('formidable');

var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));



//Setting port
app.set('port', process.env.PORT || 3000);

//This allows me to access the public directory and then reference the images so we can use them in our app.
app.use(express.static(__dirname + '/public'));

//Defines our routes, req is http request, res is response express will send back
app.get('/', function(req, res){
    res.render('home'); //point to our view, sends home.handlebars inside the body in main handlebars.
});

//Recieve a req and res and a next function. It will perform a function which pops up in console the URL that is beeing looked at.
//Middleware
app.use(function(req, res, next){
    console.log("Looking for URL: " + req.url);
    next();
})

//We can do other stuff with middleware, for example if we look for URL that doesn't exist

app.get('/junk', function(req, res, next){
    console.log('Tried to access the /junk URL');
    throw new Error("/junk doesn't exist")
});

app.use(function(err, req, res, next){
    console.log('Error: ' + err.message);
    next();
});

app.use


app.get('/about', function(req, res){
    res.render('about');
});

//Contact route
app.get('/contact', function(req, res){
    res.render('contact', {csrf: 'CSRF token here'}); //Render CSRF token, generated with cookie and post data when user posts info for security reasons
});

app.get('/thankyou', function(req, res){
    res.render('thankyou');
})

//Processing the information that is being sent to us
app.post('/process', function(req, res){
    console.log("Form: " + req.query.form);
    console.log("CSRF token: " + req.body._csrf);
    console.log("Email: " + req.body.email);
    console.log("Question: " + req.body.ques);
    res.redirect(303, '/thankyou');
})

//Route for file upload
app.get('/file-upload', function(req, res){
     var now = new Date(); //Current date, for storing later
     res.render('file-upload', {
         year: now.getFullYear(),
         month: now.getMonth()});
});
//Now route for having year and month
app.post('/file-upload/:year/:month',
function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, file) {
        if (err) {
            return res.redirect(303, '/error')
        }

        console.log("Recieved File");

        console.log(file); //I will later print it into the database.
        res.redirect(303, '/thankyou');
    });
});


// We set the cookie and also output information on the screen
app.get('/cookie', function(req, res){
    res.cookie('username', 'Simeon Nakov', {expire: new Date() + 9999}).send('username has the value of Simeon Nakov');
});

//We can now show the stored cookies to our console

app.get('/listcookies', function(req, res){
    console.log('Cookies: ', req.cookies);
    res.send("Look in the console for cookies.")
});

app.get('/deletecookie', function(req, res){
    res.clearCookie('username');
    res.send('username Cookie Deleted');
});

//Sessions using express-session
//I will later add them to a database because rn if the server shuts down the session is lost
var session = require('express-session');

var parseurl = require('parseurl'); //provides info of the URL of the request object that is passed to us

app.use(session({
    resave: false, //We only want to save to the session store if a change has been made
    saveUninitialized: true, //stores session information if it's new even if it hasn't been modified
    secret: credentials.cookieSecret,
}));

//Middleware for tracking how many times a user has gone to a specific page.
app.use(function(req, res, next){
    var views = req.session.views;

    if (!views) {
        views = req.session.views = {};
    }

    var pathname = parseurl(req).pathname; // knowing which page they're on

    views[pathname] = (views[pathname] || 0) + 1; //using pathname as key and set it to the total numbers of times, that's either 0 or the current times and we add 1

    next();
});

//Now getting this information every time we go to it

app.get('/viewcount', function(req, res, next){
    res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times')
});

var fs = require("fs");

app.get('/readfile', function(req, res, next){
    fs.readFile('./public/randomfile.txt', function(err, data){
        if (err) {
            return console.error(err);
        }
        res.send("The file: " + data.toString());
    });
});

app.get('/writefile', function(req, res, next){
    fs.writeFile('./public/randomfile2.txt', "More random text", function(err){
        if (err) {
            return console.error(err);
        }
    });

    //Now to make sure it worked

    fs.readFile('./public/randomfile2.txt', function(err, data){
        if (err) {
            return console.error(err);
        }
        res.send("The file: " + data.toString());
    });
});

//Middleware for 404, previous middleware still prints but because of next we can use this middleware too to render 404.handlebars
app.use(function(req, res){
    res.type('text/html');
    res.status(404);
    res.render('404')
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
})


app.listen(app.get('port'), function(){
    console.log("Express started on http://localhost:" + app.get('port') + "press Ctrl-C to terminate!");
});
