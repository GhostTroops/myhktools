// 后渗透中用来压缩文件夹
// node zipFolder.js youpath xxx.zip
var zipFolder = require('zip-folder');
var a = process.argv.splice(2);
zipFolder(a[0], a[1], function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
    }
});
