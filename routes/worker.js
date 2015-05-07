//http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
var aviso = require('../models/aviso').aviso; 
var request = require('request');
var cheerio = require('cheerio');

var url = 'http://www.paginasamarillas.com.ar/b/veterinarias/';

exports.start = function(req, res) {
  /*var options = {
    url: 'http://www.paginasamarillas.com.ar/b/veterinarias/',
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info.stargazers_count + " Stars");
      console.log(info.forks_count + " Forks");
    }
  }

  request(options, callback);*/
  request({uri: 'http://www.paginasamarillas.com.ar/b/veterinarias'},
    function(err, response, body){
    if (err && resp.statusCode === 200) {
      console.log(err); //throw err;
    }
    $ = cheerio.load(body);
    var results = parseInt($('.m-header--count').text()) + 1;
    console.log(results);
    var pages = $('.paginador.box a:nth-last-child(2)').text().trim();
    console.log(pages);
    scraper(pages);
  });
};

function scraper(pages) {
  for (var i = 0; i < pages; i++) {
    var url = "http://www.bumeran.com.ar/empleos-publicacion-hoy-pagina-" + (i + 1) + ".html";
    request(url, (function (i) {
      return function (err, resp, body) {
        if (err && resp.statusCode == 200) {
          console.log(err); //throw err;
        }
        $ = cheerio.load(body);
        $(".aviso_box.aviso_listado").each(function (index, tr) {
          console.log("Scrapping..." + $(this).attr("href"));
          scraperLinks($(this).attr("href"));
        });
      };
    })(i));
  }
}
    
function scraperLinks(link) {
  var url = "http://www.bumeran.com.ar" + link;
  request(url, function (err, resp, body) {
    if (err && resp.statusCode == 200) {
      console.log(err);
    } //throw err;
    $ = cheerio.load(body);            //console.log(body);
    var location = $('.aviso-resumen-datos tr td').last().text().trim(); // $('#.aviso-resumen-datos tr').last().find( "a" ).text();
    var detail = $("#contenido_aviso p:nth-child(2)").text();//$("#contenido_aviso p").first().text();
    var title = $(".box h2").first().text().trim();
    var date = $(".aviso-resumen-datos tbody tr td").first().text().trim();
    console.log("Saving..." + url);
    grabarAviso(url, location, detail, title, date);
  });
}

function grabarAviso(url, location, detail, title, date) {
  aviso.findOne({url: {$regex: new RegExp(url, "i")}}, function (err, doc) {  // Using RegEx - search is case insensitive
    if (!err && !doc) {
      var newAviso = new aviso();
      newAviso.url = url;
      newAviso.site = 'Bumeran';
      newAviso.location = location;
      newAviso.date = date;
      newAviso.title = title;
      newAviso.detail = detail;
      newAviso.save(function (err) {
        if (!err) {
          console.log("Saved " + url);
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
};


exports.jobs = function(req, res) {
  var searchterm = req.body.searchterm;
  if (searchterm == null) {
    aviso.find({}, function (err, docs) {
      if (!err) {
        res.json(200, {jobs: docs});
      } else {
        res.json(500, {message: err});
      }
    });
  } else {
    aviso.findONe({name: {$regex: new RegExp(searchterm, "i")}}, function (err, docs) {  // Using RegEx - search is case insensitive
      if (!err && !docs) {
        if (!err) {
          res.json(200, {jobs: docs});
        } else {
          res.json(500, {message: err});
        }
      }
    });
  }
};
