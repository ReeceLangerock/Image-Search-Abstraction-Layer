var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var mongoURL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds111549.mlab.com:11549/image-search-project`

mongo.connect(mongoURL, function(err, database) {
    if (err) console.log(err);
    db = database;
    console.log("connected to DB");

});

router.get('/', function(req, res){

getRecentSearches.then(function(response, error){
  res.send(response);

  //return res.render('searchResults', {
  //    title: "Search Results",
  //      data: response
  //  });
  })
})

function getRecentSearches(){
  return new Promise(function(resolve, reject) {
    var dbResults =  db.collection('searches').find().sort({_id:1}).limit(50);
    console.log(dbResults);
    return resolve(dbResults);
}
}

module.exports = router;
