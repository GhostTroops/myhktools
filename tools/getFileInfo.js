/*
获取文件信息
mac os：mdls  ~/Desktop/3581520995599_.pic_hd.jpg 
*/
var fileMetadata = require('file-metadata');
console.log(fileMetadata.sync(process.argv.splice(2)[0]));
