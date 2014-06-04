
var list = require('./list.json');
var nhttp = require('http');
var util = require('util');
var i = 87;

function check_url(list_items) {
    console.log(i);
    if(list_items.attribution_url.length){
        var req = nhttp.get(list_items.attribution_url, function (result) {
            if(result.statusCode === 302 && result.headers.location.search('product_disabled') > 0){
                console.log(list_items.name + ' has a BAD URL!');
            } else {
                console.log(list_items.name + ' is Good');
            }
            i++;
            check_url(list.data[i]);
        });
        req.on('error', function(e) {
            console.log('something')
            i++;
            check_url(list.data[i]);
            console.log(list_items.name + 'Got an error: ' + e.message);
        });
        req.end();
    } else {
        i++;
        check_url(list.data[i]);
    }
}

check_url(list.data[i]);
    
