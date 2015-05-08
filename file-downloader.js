/* global require: false */

var http = require('http');
var path = require('path');
var fs = require('fs');
var file = 'reviews.sqlite';
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
var destFolder = 'maker/'; // with tailing slash
var downloadList = []; // array

db.each("SELECT * FROM 'reviews'", function(err, row) {
    if(err) console.log(err);
    if(row.images.length > 0) {
        var filename = [];
        var image_list = row.images.split(',');
        for (var i = 0; i < image_list.length; i++) {
            filename.push(path.basename(image_list[i]));
        }
        db.run("UPDATE reviews SET images = ? WHERE id = ?", filename.join(',') , row.id);
    }
},
function() {
    console.log('done');
    //parseList();
});
db.close();

function download(url, dest, cb) {
  var fileStream = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(fileStream);
    fileStream.on('finish', function() {
      fileStream.close(cb);
    });
  });
}

function getFile(file) {
    var filename = path.basename(file);

    download(file, destFolder + filename);
}

function parseList() {
    for (var i = downloadList.length - 1; i >= 0; i--) {
        getFile(downloadList[i]);
    }
}

