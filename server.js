'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
let db = require("./database")

var app = module.exports = express();

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', path.join(__dirname, 'views'));

// Path to our public directory

app.use(express.static(path.join(__dirname, 'public')));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');



app.get('/', async function(req, res){
  let questions = await db.getQuestions(1)
  questions = questions.map(q =>({
      ...q,
      options:q.options.split("#")
  }))
  res.render('questions', {
    questions,
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000,'0.0.0.0');
  console.log('Express started on port 3000');
}