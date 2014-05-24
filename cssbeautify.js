var fs = require('fs');
var _ = require('underscore');
var cssbeautify = require('cssbeautify');

var cssfile_input = process.argv[2];
var cssfile_output = process.argv[3] || cssfile_input;

function showUsage() {
    console.log('Usage:');
    console.log('   cssbeautify [options] style.css');
    console.log();
    console.log('Available options:');
    console.log();
    console.log('  -v, --version  Shows program version');
    console.log();
    process.exit(1);
}

if (process.argv.length <= 2) {
    showUsage();
}


var style = [];
content = fs.readFileSync(cssfile_input, 'utf-8');

content = content.split('\n');

_.each(content, function (lines){
    var newline = lines.replace(/(^[A-z 0-9#,:>-_\.-]+)({ ?}+)/g, '');

    if (newline !== '\r') {
        style.push(newline);
    }
});

function convertCase(str, reg) {
    return str.replace(
        new RegExp(reg),
        function ($1) {
            return ($1.toLowerCase());
        }
    );
}

function declorations(str) {
    return str.replace(
        new RegExp(/{(.)+}/mg),
        function ($1) {
            return ($1.replace(/(:(?![ \/\/]))/mg, ':')
                    .replace('0px', '0')
                    .replace(/(; )/mg, ';')
                    .replace(/(;(?!\n))/mg, ';\n')
                    .replace(/(,(?! ))/mg, ', ')
                    .replace(/({(?!\n))/mg, '{\n')
                );
        }
    );
}

style = cssbeautify(style.join('\n'));

style = convertCase(style, /(#([0-9a-fA-F]{3,6}))/gm);

style = declorations(style);

style = cssbeautify(style); // send it thru one more time to cleans
fs.writeFile(cssfile_output, style, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(cssfile_output + ' was created and saved!');
    }
});
