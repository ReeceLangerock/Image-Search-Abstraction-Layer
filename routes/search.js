var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var mongoURL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds111549.mlab.com:11549/image-search-project`
var request = require('request').defaults({
    headers: {
        'Ocp-Apim-Subscription-Key': 'fa35580541df4378851f27029ed00b4c'
    }
});
var url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search";

mongo.connect(mongoURL, function(err, database) {
    if (err) throw err;
    db = database;
    console.log("connected to DB");

});


router.get('/', function(req, res) {
    res.send("search");
})

router.get('/:searchTerm', function(req, res) {
    var searchTerm = req.params.searchTerm;
    var numResults = req.query.offset;
    var searchResults = [];
    var urlWithSearch = url + "?q=" + searchTerm + "&count=" + numResults;

    bingSearch(urlWithSearch)
        .then(function(response, error) {
            return res.render('searchResults', {
                title: "Search Results",
                data: response
            });

        });

        recordSearch(searchTerm);

})

function recordSearch(search){
    return new Promise(function(resolve, reject) {
      console.log(search);
      db.collection('searches').insert({
                        searchQuery: search,
                        dateSearched: $currentDate
                    });
      return resolve();
    })
}

function bingSearch(url) {
    return new Promise(function(resolve, reject) {
        request.get({
            url: url,
        }, function(error, response, body) {
            if (error) {
                return reject(error);
            } else {
                var parsedData = JSON.parse(body);

                var numResults = parsedData.value.length;
                var searchResults = [];

                for (var i = 0; i < numResults; i++) {
                    searchResults.push({
                        name: parsedData.value[i].name,
                        imageURL: parsedData.value[i].contentUrl,
                        pageURL: parsedData.value[i].hostPageDisplayUrl,
                        thumbnailUrl: parsedData.value[i].thumbnailUrl
                    })
                }

                return resolve(searchResults);

            }
        });

    })
}


module.exports = router;
