var child_process = require("child_process"),
    program = require('commander'),
    moment = require('moment'),
    fs = require('fs');

program.version("v1.0")
    .option('-f, --filepath [value]', 'watch file or path')
    .parse(process.argv);
fs.watch(program.filepath, { encoding: 'buffer',persistent: true, recursive:true }, (eventType, filename) => {
   console.log(this)
  if (filename) {
    console.log([moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),eventType,filename.toString()]);
  }
});