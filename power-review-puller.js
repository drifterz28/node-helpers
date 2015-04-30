
// start for the groups, group one should stop at 10... i think
var start_group1 = 0;
var start_group2 = 0;

var fs = require('fs');
var http = require('http');

var power_review_content = function(group1, group2) {
    return 'http://cdn.powerreviews.com/repos/17085/pr/pwr/content/' + pad(group1) + '/' + pad(group2) + '/contents.js';
};

var power_review_reviews = function(item_id, group) {
    return 'http://cdn.powerreviews.com/repos/17085/pr/pwr/content/' + pad(group[0]) + '/' + pad(group[1]) + '/' + item_id + '-en_US-1-reviews.js';
};

function pad(v) {
    return ('0' + v).split('').reverse().splice(0, 2).reverse().join('');
}

function cleanIds(review_id) {
    review_id = review_id.replace(/^[p]?/, '');
    return review_id.replace(/__/g, '-');
}

function trimLast(theString) {
    return theString.substr(0, theString.length-1);
}

function trimFirst(theString) {
    return theString.substr(1, theString.length-1);
}

// takes review info string and returns review id's as array
function parseReviewDetails(review) {
    var review_json = review.split(' = ').pop();
    review_json = trimLast(review_json);
    review_json = JSON.parse(review_json);
    if(review_json.locales.en_US) {
        return Object.getOwnPropertyNames(review_json.locales.en_US);
    } else {
        return false;
    }
}

function buildReviewList(review_data, group) {
    var review_ids = parseReviewDetails(review_data);
    console.log(group);
    for (var i = 0; i < review_ids.length; i++) {
        var review_id = cleanIds(review_ids[i]);
        var reviews_url = power_review_reviews(review_id, group);
        fs.appendFileSync('reviewKeys.json', reviews_url + '\n');
    }
}

var main_group = 0; // test group
var sec_group = 0;
var max-main_group = 10;
setInterval(function() {
    if(sec_group > 99) {
        sec_group = 0;
        main_group++;
        if(main_group > max-main_group) {
            process.exit(1);
        }
    }
    http.get(power_review_content(main_group, sec_group), function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            if(res.statusCode !== 404) {
                buildReviewList(data, [main_group, sec_group]);
            }
            sec_group++;
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}, 700);
