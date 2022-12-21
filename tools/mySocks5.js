#!/usr/bin/env node
/*
node tools/mySocks5.js --user mtxuser --password Wr90,_x*d -p 15533
node /Users/`whoami`/safe/myhktools/tools/mySocks5.js -h en0 -p 15534
node /Users/`whoami`/safe/myhktools/tools/mySocks5.js -h bridge0 -p 15534
node proxy/ProxyServer.js --proxy 'socks://mtxuser:Wr90,_x*d@127.0.0.1:15533'
curl -x "http://127.0.0.1:8880" http://ip.cn

curl -x "socks5://mtxuser:Wr90,_x*d@127.0.0.1:15533" http://ip.cn
curl -x "socks5://127.0.0.1:1089" http://ip.cn

同时使用多个vps线路的情况，苹果系统代理不能设置密码，否则各种问题
proxychains4 -f ~/safe/`whoami`/proxychains.conf node /Users/`whoami`/safe/myhktools/tools/mySocks5.js -p 15533
*/
var socks = require('socksv5'),
	fs  = require("fs"),
	globalTunnel = require('global-tunnel'),
	program = require('commander'),
	child_process = require('child_process'),
	g_aProxy = null,
	srv = socks.createServer(function(info, accept, deny)
{
	if(g_aProxy)
	{
		var n = parseInt(Math.random() * 2000000000) % g_aProxy.length, aT = g_aProxy[n];
		// process.env["HTTP_PROXY"] = "http://" + aT;
		process.env["ALL_PROXY"] = "http://" + aT;
		
		console.log("proxy: " + process.env["ALL_PROXY"]);
		// globalTunnel.initialize();
		//console.log(globalTunnel)
	}
	/*
	{ cmd: 'connect',
  srcAddr: '127.0.0.1',
  srcPort: 56597,
  dstAddr: 'ip.cn',
  dstPort: 80 }
	*/
	// console.log(info)
	accept();
	// 黑名单：deny();
});
program.version("socks5代理")
	.option('-p, --port [value]', '端口,默认 15533')
	.option('-d, --useHttp [value]', '使用动态http代理 ../proxy/autoProxy.txt')
	.option('-h, --host [value]', '绑定的ip，默认0.0.0.0')
	.option('-u, --user [value]', '用户名')
	.option('-p, --password [value]', "密码")
	.parse(process.argv);
process.setMaxListeners(0);
process.on('uncaughtException', function(e){console.log(e)});
process.on('unhandledRejection', function(e){console.log(e)});


var szAutoProxyIps = __dirname + "/" + (program.useHttp || process.env["autoProxy"] || "../proxy/autoProxy.txt");
// console.log(szAutoProxyIps);
if(fs.existsSync(szAutoProxyIps))
	;// g_aProxy = fs.readFileSync(szAutoProxyIps).toString().trim().split(/\n/);

var szStrIP = program.host ||'';
if(!(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g.test(szStrIP)))
{
	var bridge0 = 'bridge0',
		szCmd = 'ipconfig getifaddr ' + ((bridge0 == szStrIP || 'en0' == szStrIP)?szStrIP : bridge0);
	try{
		szStrIP = child_process.execSync(szCmd).toString();
		console.log(szCmd);
		szStrIP = szStrIP.trim();
	}catch(e){}
}

program.host = szStrIP = szStrIP||'0.0.0.0';
console.log("端口绑定到：" + szStrIP);
srv.listen(program.port||15533, szStrIP, function()
{
	console.log('SOCKS server listening...' + this._connectionKey);
});

if(program.user && program.password)
	srv.useAuth(socks.auth.UserPassword(function(user, password, cb) {
	  cb(user === (program.user || 'mtx') && password === (program.password || "`!';/.;l'Qgdf097"));
	}));
else srv.useAuth(socks.auth.None());