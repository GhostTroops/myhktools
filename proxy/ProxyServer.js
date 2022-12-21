// 校验http、https 代理是否可用
// nodest checkProxy.js ~/C/ip_log.txt 
/*
node proxy/ProxyServer.js -p 15331 -u
node proxy/ProxyServer.js --proxy socks://127.0.0.1:5533
node proxy/ProxyServer.js --proxy 'socks://mtxuser:sldfjsljf@127.0.0.1:5533'
curl -x "http://127.0.0.1:15531" http://ip.cn

npm install -g socks-proxy-agent
curl -v --proxy http://127.0.0.1:8880 http://ip.cn
# 这样kali就可以使用vps的代理了
vi /etc/apt/apt.conf.d/auto-apt-proxy.conf 
Acquire::http::Proxy "http://192.168.24.10:8880";
cat ssT.txt|sed 's/Socks4/Socks4 /g'|awk '{print $4"://"$1":"$2}'
*/

var fs  = require("fs"),
	net = require("net"),
	url = require("url"),
	http = require("http"),
    request = require("request"),
    g_aProxy = null,
    program = require('commander'),
    nPort = 8880,
    g_szUA = "Mozilla/5.0 (Linux; Android 5.1.1; OPPO A33 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/7.1.8.3240 NetType/4G WebP/0.3.0 Pixel/540",//"CaptiveNetworkSupport-355.30.1 wispr",
    szIp = "0.0.0.0";

program.version("动态代理")
	.option('-u, --useHttp', '使用动态http代理')
	.option('-p, --port [value]', 'port')
	.option('-v, --verbose', 'show log')
	.option('-l, --host [value]', 'host')
	.option('-x, --proxy [value]', 'socks://127.0.0.1:1086, or process.env.socks_proxy')
	.parse(process.argv);

nPort = program.port || nPort;
szIp = program.host || szIp;

process.on('uncaughtException', function(e){console.log(e)});
process.on('unhandledRejection', function(e){console.log(e)});

// 代理文件修改后自动更新内存
function fnWathProxyFile(s)
{
	var fnCbk = function()
	{
		if(fs.existsSync(s))
		{
			g_aProxy = fs.readFileSync(s).toString().trim().split(/\n/);
			console.log("读取到：" + g_aProxy.length + "个动态代理");
		}
	};
	fnCbk();
	fs.watch(s,{encoding:'buffer'},(eventType, filename)=>
	{
		if (filename)
		{
			fnCbk();
		}
	});
}
var szAutoProxyIps = '';
if(program.useHttp)
{
	szAutoProxyIps = __dirname + "/autoProxy.txt";
	fnWathProxyFile(szAutoProxyIps);
	console.log(szAutoProxyIps);
}

var proxy = program.proxy||process.env.socks_proxy||process.env["HTTP_PROXY"];
// 获取代理
function fnGetProxy()
{
	// 优先使用命令参数中的proxy，以及系统的设置
	if(proxy)
	{
		console.log("启用了代理:" + proxy);
		return {target:proxy};
	}
	if(program.useHttp)
	{
		var n = parseInt(Math.random() * 2000000000) % g_aProxy.length, aT = g_aProxy[n];
		if(-1 == aT.indexOf('http') && -1 == aT.indexOf('sock'))
			aT = "http://" + aT;
		process.env["HTTP_PROXY"] = aT;
		console.log("使用代理: " + aT);
		return {target:aT};
	}
	return {};
}

// 启动多个
// pm2 start ProxyServer.js -i max
process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.defaultMaxListeners = 0;

var option = 
{
	'timeout':20000,
	'maxSockets':333,
	maxRedirects:10,
	agentOptions: {
      rejectUnauthorized: false
    },
	// localAddress:'192.168.24.1',// 指定网卡Local interface to bind for network connections when issuing the request
	rejectUnauthorized:false,
	removeRefererHeader:false,
	followRedirect:true,     // follow HTTP 3xx responses as redirects (default: true).
	followAllRedirects:false,// follow non-GET HTTP 3xx responses as redirects (default: false)
	'headers':{'connection':'close'}
};

var server = http.createServer(function(req, res)
{
	option.proxy = fnGetProxy().target;
	// console.log([option.proxy,req.url])
	// console.log(req.method.toLowerCase())
	var r = request.defaults(option);
	
	req.pipe(r[req.method.toLowerCase()](req.url)).pipe(res)
	
}).listen(nPort);

function request(cReq, cRes) {
    var u = url.parse(cReq.url);

    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method     : cReq.method,
        headers     : cReq.headers
    };

    var pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
    }).on('error', function(e) {
        cRes.end();
    });

    cReq.pipe(pReq);
}

function connect(cReq, cSock)
{
	//*/////////////////////////////
    var u = url.parse('http://' + cReq.url);
    console.log(cReq);
    var pSock = net.connect(u.port, u.hostname, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function(e) {
        cSock.end();
    });

    cSock.pipe(pSock);
    ///////////////////*/
}

server.on('connect', connect);

/*/////////////////////
server.on('connection',function(s)
{
	var p = fnGetProxy().target;
	if(p)
	{
		var p2 = url.parse(p);
		
		const srvSocket = net.connect(p2.port, p2.hostname, () =>
		{
			s.pipe(srvSocket);
			srvSocket.pipe(s);
		});
	}
});
/////////////////////*/
/*
const srvSocket = net.connect(p2.port, p2.hostname, () =>
		{
			// req.pipe(srvSocket);
			var host = req.headers['host'];
		    var szStr = `CONNECT ${host}: HTTP/1.0\r\nHost: ${host}\r\n\r\n`;
		    console.log([p2.port, p2.hostname,szStr]);
		    srvSocket.write(szStr);
		    srvSocket.write(head);
		    srvSocket.on('data',function(s1)
		    {
		    	console.log("=========srvSocket=========");
		    	console.log(s1.toString('utf-8'));
		    	console.log("=========srvSocket=========end");
		    });

		    
		    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
		                    'Proxy-agent: PwnM.T.X\r\n' +
		                    '\r\n');
		    
		    srvSocket.pipe(cltSocket);
		    cltSocket.pipe(srvSocket);

		    
	  });
*/
