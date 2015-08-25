var storeUrl = 'store.tealco.net';

var catalogUrl = 'http://' + storeUrl + '/objinfo.xml';
var fs = require('fs');
var http = require('http');

function getXml() {
  console.log(catalogUrl);
  http.get(catalogUrl, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
        console.log(res.statusCode);
          if(res.statusCode === 200) {
            console.log('saved');
              fs.writeFileSync('catalog.xml', data);
          } else {
            console.log('fail' + res.statusCode);
          }
      });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
  });
}
getXml();
