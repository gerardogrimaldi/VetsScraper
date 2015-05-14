//http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
var vet = require('../models/vet.server.model');
var request = require('request');
var cheerio = require('cheerio');

var urlHost = 'http://www.paginasamarillas.com.ar/b/veterinarias/';

exports.start = function(req, res) {
  request({uri: urlHost, headers: {'User-Agent': 'request'}},
    function(err, response, body){
      if (err && resp.statusCode === 200) {
        console.log(err); //throw err;
      }
    $ = cheerio.load(body);
    var results = parseInt($('.m-header--count').text()) + 1 ;
    var pages = parseInt(results / 25) + 1;

    scraper(pages);
  });
};

function scraper(pages) {
  for (var i = 1; i < pages + 1; i++) {
    var url = urlHost + 'p-' + i;
    request({uri: url, headers: {'User-Agent': 'request'}},
      function (err, resp, body) {
        if (err && resp && resp.statusCode === 200) {
          console.log(err); //throw err;
        }
        $ = cheerio.load(body);
        for (var l = 0; l < 25; l++) {
          var name     = $($('.m-results-business--name a')[l]).text().replace(/(\r\n|\n|\r|\t)/gm,'').trim();
          var url      = $($('.m-results-business--online a')[l]).text().replace(/(\r\n|\n|\r|\t)/gm,'').trim();
          var address  = $($($('.m-results-business--address')[l]).children('span').eq(0)).text().trim() + ', ' + $($($('.m-results-business--address')[l]).children('span').eq(1)).text().trim();
          var details  = $($('.l-plain.m-results-business--services li')[l]).text().trim();
          var coords = [];
          if($($('.m-results-business--map-link')[l]).attr('onclick')) {
            var latitude  = $($('.m-results-business--map-link')[l]).attr('onclick').split('|')[2].split('&')[0].split(',')[0];
            var longitude = $($('.m-results-business--map-link')[l]).attr('onclick').split('|')[2].split('&')[0].split(',')[1];
            coords    = [latitude,longitude ];
          }
          if (name && address) {
            grabarVet(name, url, address, details, coords);
          }
        }
      }
    );
  }
}

function grabarVet(name, url, address, details, coords) {
  vet.findOne({name: {$regex: new RegExp(name.replace(/\+/g, ''), "i")}}, function (err, doc) {  // Using RegEx - search is case insensitive
    if (!err && !doc) {
      var newVet = new vet();
      newVet.name = name;
      newVet.url = url;
      newVet.address = address;
      newVet.details = details;
      newVet.coords = coords;
      newVet.save(function (err) {
        if (!err) {
          console.log("Saved " + url);
          console.log(name);
          console.log(url);
          console.log(address);
          console.log(details);
          console.log(coords);

          //res.json(201, {message: "Aviso created with name: " + newAviso.name });    
        } else {
          console.log("Error... " + err);
          //res.json(500, {message: "Could not create User. Error: " + err});
        }
      });
    } else if (!err) {
      //res.json(403, { message: "Aviso with that name already exists, please update instead of create or create a new User with a different name."}); 
    } else {
      //res.json(500, { message: err});
    }
  });
}