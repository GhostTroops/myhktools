#!/usr/bin/env node
/*
node checkAll.js --struts2 tomcat
*/
var arg = [],//process.argv.splice(2),
    s1 = "/Users/xiatian/Desktop/untitled folder/hbww.txt"//0 < arg.length ? arg[0] : require('os').homedir() + "/Desktop/untitled\ folder/urls.txt"
    , fs = require('fs')
    ,colors = require('colors')
    , a = fs.readFileSync(s1).toString().trim().split("\n"),
    async = require('async'),
    child_process = require('child_process'),
    md5 = require('md5'),
    kkk = require('./lib/core_new.js');

var g_oUrl = {},nX = 0;
async.mapLimit(a, 2000,function(s,fnCbk1)
{
	// console.log("node checkUrl.js -v -u '" + s + "' &"),fnCbk1();if(true)return;
	nX++;
	// if(50 > nX)return fnCbk1();
	var r = new kkk(s);
	var sFn = r.rstPath + '/' + r.md5(s) + ".txt";
	if(fs.existsSync(sFn))
	{
		var szT = fs.readFileSync(sFn).toString();
		if(-1 < szT.indexOf('"vul": true,'))
			console.log(r.getTimeCur().red + szT.bgYellow.red);
		else console.log(r.getTimeCur().bgBlue + szT);
		// console.log("今天已经执行过了，跳过：" + s);
		if(!g_oUrl[s])g_oUrl[s] = 1,fnCbk1();
		return;
	}
	r.on('info',function(s)
	{
		console.log(s);
	});
	r.on('vulinfo',function(s)
	{
		console.log(s);
	});
	
	r.on('over',function()
	{
		console.log(s);
		if(!g_oUrl[s])g_oUrl[s] = 1,fnCbk1();
	});
	
	r.on('log',function(s)
	{
		console.log(s);
	});
	r.on('error',function(s,t,o)
	{
		if(s)
		{
			s = String(s.stdout||s.stderr||s);
			if(-1 == s.indexOf("ESOCKETTIMEDOUT") && -1 == s.indexOf("ETIMEDOUT"))
				console.log('=================='),console.log(s);
			else return;
		}
		if(-1 < s.indexOf('ping -c 1'))
		{
			r.g_szError += o.url + "\n";
			r.fs.writeFileSync(r.szErrorPath, r.g_szError);
			return;
		}
		if(o && o.url)console.log(o.url);
		console.log('==================');
	});
	r.on('vul',function(v,t,s)
	{
		if(v.vul)console.log(v);
	});

	r.on('ready',function()
	{
		r.log('准备好开弄：' + s);
		// r.runChecks(url,"weblogic,struts2,web");
	});
});