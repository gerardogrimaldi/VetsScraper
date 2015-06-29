//http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var vet = require('../models/vet.server.model');
var xray = require('x-ray');

var urlHost = 'http://www.paginasamarillas.com.ar/b/veterinarias';

exports.start = function() {
  xray(urlHost)
    .select([{
      $root: '.m-results-business',
      name: '.m-results-business--name a',
      address: '.m-results-business--address',
      url: '.m-results-business--online a',
      desc: '.m-results-business--services',
      services: '.m-services',
      openTime: '.m-opening-hours',
      coords: '.m-results-business--map-link[onclick]',
      tel: '.m-bip-otras-direcciones--telefonos p',
      img: '.media-container-img[src]',
      page: '.m-results-pagination li.last > a[href]'
    }])
    .paginate('.m-results-pagination li.last > a[href]')
    .limit(191)

    .run(function (err, json) {

      if (err) throw err;

      json.forEach(function (vet) {
        var error = false;
        if (vet.name) {
          vet.name = vet.name.replace(/(\r\n|\n|\r|\t)/gm, '').trim();
        }
        if (vet.address) {
          vet.address = vet.address.split(',')[0].trim() + ', ' + vet.address.split(',')[1].trim();
        }
        if (vet.desc) {
          vet.desc = vet.desc.replace(/(\r\n|\n|\r|\t)/gm, '').trim();
        }
        if (vet.services) {
          vet.services = vet.services.replace(/(\r\n|\n|\r|\t)/gm, '').trim();
        }
        if (vet.openTime) {
          vet.openTime = vet.openTime.replace(/(\r\n|\n|\r|\t)/gm, ' ');
        }
        if (vet.coords) {
          var lat = vet.coords.split('|')[2].split('&')[0].split(',')[0];
          var long = vet.coords.split('|')[2].split('&')[0].split(',')[1];
          vet.coords = [lat, long];
        }
        grabarVet(vet);

      });
    });
};

function grabarVet(vetObj) {

  vet.findOne({name: {$regex: new RegExp(vetObj.name.replace(/\+/g, ''), "i")}}, function (err, doc) {  // Using RegEx - search is case insensitive
    if (!err && !doc) {
      var newVet = new vet();
      newVet.name = vetObj.name;
      newVet.url = vetObj.url;
      newVet.address = vetObj.address;
      newVet.details = vetObj.desc;
      newVet.coords = vetObj.coords;
      newVet.schedule = vetObj.openTime;
      newVet.tel = vetObj.tel;
      newVet.servicesList = vetObj.services;
      newVet.save(function (err) {
        if (!err) {
          console.log("Saved " + vetObj.name);
        } else {
          console.log("Error... " + err);
        }
      });

    } else if (!err) {

      console.log('Name exist');

    } else {

      console.log(err);

    }
  });
}