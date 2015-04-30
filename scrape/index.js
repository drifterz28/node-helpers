var fs = require('fs');
var https = require('https');
var cheerio = require('cheerio');

var scrape_site = 'https://store.davincigourmet.com';

var scrape_pages = [
    'https://store.davincigourmet.com/flavoring-syrups-c-199.aspx?pagenum=1',
    'https://store.davincigourmet.com/flavoring-syrups-c-199.aspx?pagenum=2',
    'https://store.davincigourmet.com/flavoring-syrups-c-199.aspx?pagenum=3',
    'https://store.davincigourmet.com/flavoring-syrups-c-199.aspx?pagenum=4',
    'https://store.davincigourmet.com/flavoring-syrups-c-199.aspx?pagenum=5',
    'https://store.davincigourmet.com/sugar-free-syrup-c-200.aspx?pagenum=1',
    'https://store.davincigourmet.com/sugar-free-syrup-c-200.aspx?pagenum=2',
    'https://store.davincigourmet.com/sugar-free-syrup-c-200.aspx?pagenum=3',
    'https://store.davincigourmet.com/sugar-free-syrup-c-200.aspx?pagenum=4',
    'https://store.davincigourmet.com/all-natural-syrups-c-201.aspx',
    'https://store.davincigourmet.com/fruit-syrup-tea-lemonade-cold-drink-flavors-c-202.aspx',
    'https://store.davincigourmet.com/beverage-concentrates-c-203.aspx'
    ];

function getPageContent(page_url, callback) {
    https.get(page_url, function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback(data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function getProductDetails(product_url) {
    getPageContent(scrape_site + product_url, function (data) {
        $ = cheerio.load(data);
        var item_number = $('.desciption').next().text().replace(/[^0-9]/gi, '');
        var item_name = $('.productnamedefault').text().replace(/(Glass|Plastic|375|1 Liter|Bottle|750|700|mL)/g, '').trim();
        fs.appendFileSync('product.txt', item_name + ', ' + item_number + ', "' + $('.desciption').html() + '"\n');
    });
}

for (var i = 0; i < scrape_pages.length; i++) {
    getPageContent(scrape_pages[i], function (data) {
        $ = cheerio.load(data);
        $('.wrap-proname a').each(function (i, elm) {
            getProductDetails($(this).attr('href'));
        });
    });
};

