var fs = require('fs');
var _ = require('underscore');
var cssbeautify = require('cssbeautify');

var cssfile_input = process.argv[2];
var cssfile_output = process.argv[3] || cssfile_input;
var style = [];
content = fs.readFileSync(cssfile_input, 'utf-8');

content = content.split('\n');

_.each(content, function (lines){
    var newline = lines.replace(/(^[A-z 0-9#,:>-_\.-]+)({ ?}+)/g, '');
    //newline = newline.replace(/,/g, '\n');
    if (newline.length) {
        style.push(newline);
    }
});

function convertCase (str, reg) {
    return str.replace(
        new RegExp(reg),
        function($1){
            return ( $1.toLowerCase() );
        });
}

style = cssbeautify(style.join('\n'));
style = convertCase(style, /(#([0-9a-fA-F]{3,6}))/gm);

fs.writeFile(cssfile_output, style, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(cssfile_output + ' was created and saved!');
    }
});
