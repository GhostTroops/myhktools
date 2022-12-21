var Tesseract = require('tesseract.js'),
    program = require('commander');

program.version("ocr shell img 1.0")
    .option('-f, --file [value]', 'img file name')
    .on('--help', function () {
        console.log("node tools/ocr.js xxx.png\n\n\n\n");
    })
    .parse(process.argv);

var image = require('path').resolve(__dirname, program.file);
Tesseract.recognize(image, {
    lang: 'chi_sim'
    //,tessedit_char_blacklist: 'e'
})
    .then(function (result) {
        console.log(result.html)
    }).catch(err => {
        console.log('catch\n', err);
    })
    .finally(e => {
        console.log('finally\n');
        process.exit();
    });

