var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require("mongoose");
var app            = express();

app.use(express.static(__dirname + '/public')); 
app.use(morgan('dev'));
//app.use(express.bodyParser());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Add the routes
routes = require('./routes/clients')(app);
routes = require('./routes/products')(app);
routes = require('./routes/estoque')(app);
routes = require('./routes/vendas')(app);

// MongoDB configuration
mongoose.connect('mongodb://localhost/aplicacao', function(err, res) {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err);
  } else {
    console.log('Connected to Database');
  }
});

app.listen(8080);
console.log("App listening on port 8080");


app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});