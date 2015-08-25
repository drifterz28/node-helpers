var fs = require('fs');
var http = require('http');

reviews = [];

function trimLast(theString) {
    return theString.substr(0, theString.length-1);
}

function getCleanReview(review_0bj) {

}

// takes review info string and returns review id's as array
function parseReviewDetails(review, item_id) {
    var review_json = review.split(' = ').pop();
    review_json = trimLast(review_json);
    review_json = eval(review_json);

    for (var i = 0; i < review_json.length; i++) {
        var power = review_json[i].r;
        var images = '';
        if(power.i) {
            images = getImages(power.i.r);
        }
        var item_review = {
            'item_id': item_id,
            stars: power.r,
            name: power.n,
            title: power.h,
            location: power.w,
            review: power.p,
            orig_date_added: power.db.replace('T', ' '),
            images: images
        };

        reviews.push(item_review);
    }
}

function getImages(image_obj) {
    var image_str = [];
    for (var i = 0; i < image_obj.length; i++) {
        if(image_obj[i].s && image_obj[i].s.u) {
            image_str.push(image_obj[i].s.u);
        }
    };
    return image_str.join(',');
}

function addToFile() {
    fs.appendFileSync('reviews.txt', JSON.stringify(reviews));
}

function getItemID(item_id) {
    var reg = /([a-z:/\.0-9]{61})/i;
    return item_id.replace(reg, '').replace('-en_US-1-reviews.js', '').replace('\r', '');
}

function grabContent(content_array) {
    var max_leng = content_array.length - 1;
    var count = 0;
    var http_interval = setInterval(function() {
        if(count > max_leng) {
            console.log(count);
            clearInterval(http_interval);
            addToFile();
        }

        http.get(content_array[count], function(res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if(res.statusCode !== 404) {
                    var item_id = getItemID(content_array[count]);
                    console.log(item_id);
                    parseReviewDetails(data, item_id);
                    count++;
                }
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }, 700);
}

//init on read file
fs.readFile('./reviewKeys.json', {encoding: 'utf-8'}, function (err, data) {
    if (err) throw err;
    var content = data.split('\n');
    content.pop();
    grabContent(content)
});
