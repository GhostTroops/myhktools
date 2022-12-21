#!/usr/bin/env node
/*
cat md5.txt
xxx:ce71ef22e2b2d2879288e0110e0b498b
....
cat pswdfile.txt
f146dc8542ac59a88f5b002e83a49050:100912
...

node tools/mg2File.js -m md5.txt -p pswdfile.txt

cat md5.txt|grep -E ":.{1,30}$"
xxName:111111

so,search name

cat md5.txt|grep liuhz
*/
var fs  = require("fs"),
	program = require('commander'),
	fnE = function(e){console.log(e)};


program.version("Lan_ssh_Proxy")
	.option('-m, --md5 [value]', 'md5 file name')
	.option('-p, --pswdfile [value]', 'pswd file')
	.parse(process.argv);
process.setMaxListeners(0);
process.on('uncaughtException', fnE);
process.on('unhandledRejection', fnE);


var a = fs.readFileSync(program.md5).toString(),
	b = fs.readFileSync(program.pswdfile).toString().split(/\n/gmi);

for(var i = 0; i < b.length; i++)
{
	var k = b[i].split(/:/);
	if(2 == k.length)
		a = a.replace(new RegExp(k[0],"gi"),k[1]);
}
a += "\n";
fs.writeFileSync(program.md5,a);
console.log(a.replace(/[^\n]+?:[a-f-F0-9]{30,}\n/gmi,""));
