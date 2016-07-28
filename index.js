var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');

//default port will always be 27017 for mongo if not specified
var url = 'mongodb://localhost/example';

var port = 8080;
//use mongoose to connect to mongodb
mongoose.connect(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//retrieve everything within the collection
app.get('/books', function(req, res){
  console.log('getting all books');
  Book.find({})
  .exec(function(err, docs){
    if(err) {throw err}
      else{
        console.log('show results');
        res.json(docs)
      }
  })
})
// retrieve one book with this route
app.get('/books/:id', function(req, res){
  console.log('getting one book');
  Book.findOne({
    _id:req.params.id
  }).exec(function(err, docs){
    if(err){throw err}
      else {
        console.log('successfully retrieved');
        res.json(docs);
      }
  })
})

//post route
app.post('/book', function(req, res){
  var newBook = new Book();

  newBook.title = req.body.title;
  newBook.author = req.body.author;
  newBook.category =req.body.category;

  newBook.save(function(err, docs){
    if(err){ 
      res.send('error saving book');
    } else {
      console.log('book saved');
      res.send(docs + ' was saved');
    }
  })
})

/* 
//alternate posting method (Not recommended)
app.post('/book', function(req, res){
  Book.create(req.body, function(err. docs){
    if(err){
      res.send('error saving book');
    } else {
      console.log(docs);
      res.send(docs + ' was saved');
    }
  })
})
*/

//update route
app.put('/book/:id', function(req, res){
  Book.findOneAndUpdate({
    _id:req.params.id
  }, { 
    $set:{ title: req.body.title
    }}, { 
      upsert: true
    }, function(err, docs){
      if(err){
        res.send('error updated');
      } else {
        console.log(newBook);
        res.sendStatus(204);
      }
  });
})

//delete route
app.delete('/book/:id', function(req, res){
  Book.findOneAndRemove({
    _id: req.body.id
  }, function(err, docs){
    if(err) {
      res.send('error deleting');
    } else {
      console.log(docs + ' deleted');
      res.sendStatus(204);
    }
  })
})

// server listener
app.get('/', function( req, res){
  res.sendStatus(200);
  console.log('app running on' + port);
}).listen(port);