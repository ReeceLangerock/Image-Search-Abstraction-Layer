var express = require('express');
var path = require('path');
var search = require('./routes/search');
var recent = require('./routes/recent');
var port = process.env.PORT || 3000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api/search', search);
app.use('/api/recent', recent);


app.get('/', function(req, res){
  res.render("index");
})

app.listen(port, function(){
  console.log(`Image Search listening on port ${port}!`)
});
