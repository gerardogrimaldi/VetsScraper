//var user = require('../../models/user').user; 
var http = require("http");
var cheerio = require("cheerio");

exports.start = function(req, res) {

    var req_opts = {
        host:"www.bumeran.com.ar",
        path:"/empleos-publicacion-hoy-pagina-" //+ "2000.html"
    };
    var response_text = "";
    var listado = [];
    var status = 200;
    var cant = 1;
    while(status == 200)
    {
        if(cant <= 1){
            req_opts.path = "/empleos-publicacion-hoy.html";  
        }else{
            req_opts.path = "/empleos-publicacion-hoy-pagina-" + cant + ".html";  
        }
      
        var request = http.request(req_opts, function(resp) {
            if(resp.statusCode != 200) {
              status = resp.statusCode;
              //throw "Error: " + resp.statusCode; 
            }
            resp.setEncoding("utf8");
            resp.on("data", function (chunk) {
              response_text += chunk;
            });
            resp.on("end", function() {
        
              // 2. Parse response using cheerio
              $ = cheerio.load(response_text);
         
                $(".aviso_box.aviso_listado.aviso_nuevo").each(function(index, tr) {
                    listado.push($(this).attr("href"));
                    console.log($(this).attr("href"));
                });
            });
        });
    
    request.on("error", function(e) {
    //throw "Error: " + e.message;
    });
    
    request.end();
    cant ++;
  }
};
