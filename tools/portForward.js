#!/usr/bin/env node
/* 
1、proxy to my kali（172.17.0.2）
node tools/lanSsProxy.js -p 127 -f ~/safe/myKali.txt
now ssh socks port 8111 to my kali
you see：/tmp/0.6580720119184813
2、Simple port forwarding ...
`which proxychains4` -f /tmp/0.6580720119184813 node tools/portForward.js -l 8080,3306 --rhost 172.17.0.2
# test
curl -H 'user-agent:Mozilla/5.0 (Linux; Android 5.1.1; OPPO A33 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/7.1.8.3240 NetType/4G WebP/0.3.0 Pixel/540' -k -v  https://127.0.0.1:8080

3、other
node  tools/portForward.js -l 8080,3306 --rhost 172.17.0.2 -s 127.0.0.1 -p 8111
////////////////*/ 
var net = require("net"),
	program = require('commander'),
	fnE = function(e){console.log(e)};

program.version("port forwading ")
	.option('-l, --lport [value]', 'local ports,eg:80,8800')
	.option('-r, --rport [value]', 'remoute ports,default eq --lport')
	.option('-k, --rhost [value]', 'remoute host')
	.option('-i, --lhost [value]', 'local host')
	.parse(process.argv);

process.setMaxListeners(0);
process.on('uncaughtException', fnE);
process.on('unhandledRejection', fnE);

var portIn = String(program.lport).split(/[,;]/),
    hostOut = program.rhost,
    
    portOut = String(program.rport||program.lport).split(/[,;]/);


for(var i = 0; i < portIn.length; i++)
{
	(function(n){
		net.createServer(function(connIn)
		{
			var connOut = net.createConnection(portOut[n],hostOut);
			connIn.pipe(connOut);
			connOut.pipe(connIn);	
			connOut.on("end", connIn.end.bind(connIn));
			connIn.on("end", connOut.end.bind(connOut));
		}).listen(portIn[n]);
	})(i);
}