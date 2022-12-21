#!/usr/bin/env node
/*
npm install -g pretty-bytes parse-torrent
*/
var  parseTorrent = require('parse-torrent'),
	fs = require('fs'),
	prettyBytes = require('pretty-bytes'),
	program = require('commander'),
	fnE = function(e){console.log(e)};

program.version("parse torrent")
	.option('-f, --file [value]', 'file name,or magnet string')
	.option('-h, --help', "node tools/parse-torrent.js -f /Volumes/MyWork/skytorrents_dump.torrent")
	
	.parse(process.argv);
process.setMaxListeners(0);
process.on('uncaughtException', fnE);
process.on('unhandledRejection', fnE);

if(program.file)
{
	var s = program.file,oR;
	// fs.existsSync
	if(fs.existsSync(s))
	{
		oR = parseTorrent(fs.readFileSync(s));
	}
	else if(-1 < s.indexOf("magnet"))
	{
		oR = parseTorrent(s);
	}
	else oR = parseTorrent(new Buffer(s, 'hex'))
	var a = oR.info.files;
	for(var i = 0; i < a.length; i++)
	{
		console.log(a[i].path.toString('utf-8') + "(" + prettyBytes(a[i].length) + ")");
	}
	// console.log(oR);
}
else program.help();