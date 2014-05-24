/* global require: false */

var http = require('http-get'),
    downloadList = require('./catalog.json'),
    destFolder = 'wilson/'; // with tailing slash

function get_file(file) {
    var filename = file.split('/').pop();


    http.get(file, destFolder + filename, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.log('File downloaded at: ' + result.file);
        }
    });
}


for (var i = downloadList.files.length - 1; i >= 0; i--) {
    get_file(downloadList.files[i]);
}

