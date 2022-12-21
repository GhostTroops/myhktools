#!/usr/bin/env node
/*
node tools/lanSsProxy.js -p 192 -f tmp/sshIps.txt
cat data/Ok.txt |grep 192|grep -Eo "192\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"|sort -u|xargs -I % bash -c 'echo % % 22/tcp ssh   root  xxx!@#$         Password' >tmp/sshIps.txt
cat tmp/sshIps.txt
192.168.22.98   192.168.22.98    22/tcp (ssh)  root  xxx!@#$         Password

now ssh socks port 8111 to my kali
.....
内网渗透时隐藏ip最终，通过若干ssh建立代理池
proxychains4 -f ~/safe/`whoami`/proxychains.conf node /Users/`whoami`/safe/myhktools/tools/mySocks5.js -p 15533

curl -H 'user-agent:Mozilla/5.0 (Linux; Android 5.1.1; OPPO A33 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/7.1.8.3240 NetType/4G WebP/0.3.0 Pixel/540' -k -v -x 'socks5://127.0.0.1:8111' http://192.168.10.115:8083/QIMS/login.jsp

cat tmp/p.txt|grep -Eo "4[0-9]{3}"|xargs -I % curl --connect-timeout 3 -H 'user-agent:Mozilla/5.0 (Linux; Android 5.1.1; OPPO A33 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/7.1.8.3240 NetType/4G WebP/0.3.0 Pixel/540' -k -v -x 'socks5://127.0.0.1:%' http://192.168.10.115:8083/QIMS/login.jsp

netstat -ant|grep LISTEN|grep tcp4

*/
var fs  = require("fs"),
	program = require('commander'),
	path = require('path'),
	startPort = 4000,
	util = require('util'),
	prefix = "192",
	youPort = 9111,
	child_process = require('child_process'),
	a = [],
	fnE = function(e){console.log(e)};

	program.version("Lan_ssh_Proxy")
	.option('-f, --file [value]', 'file name')
	.option('-p, --prefix [value]', 'prefix，default:192')
	.option('-n, --startPort [value]', 'start port，default 4000')
	.option('-s, --youPort [value]', 'proxychains port，default 8111')
	.parse(process.argv);

process.setMaxListeners(0);
process.on('uncaughtException', fnE);
process.on('unhandledRejection', fnE);

startPort = program.startPort || startPort;
prefix = program.prefix || prefix;
youPort = program.youPort || youPort;

var socks = require('socksv5');
var Client = require('ssh2').Client;

// 启动监听
function fnMySSocks5(ip,u,p,port,fnCbk,sshport)
{
	var ssh_config = {
	  host: ip,
	  "port": sshport,
		username: u,
	  password: p
	};
	var sZ = process.env['HOME'] + '/.ssh/id_rsa';
	if(fs.existsSync(sZ))
	{
		ssh_config.privateKey = fs.readFileSync(sZ).toString("utf-8");
		// console.log(ssh_config.privateKey);
	}
	// console.log(ssh_config);

	socks.createServer(function(info, accept, deny)
	{
	  var conn = new Client();
	  conn.on('ready', function() {
	    conn.forwardOut(info.srcAddr,
	                    info.srcPort,
	                    info.dstAddr,
	                    info.dstPort,
	                    function(err, stream) {
	      if (err) {
	      	fnE(err);
	        conn.end();
	        return deny();
	      }

	      var clientSocket;
	      if (clientSocket = accept(true)) {
	        stream.pipe(clientSocket).pipe(stream).on('close', function() {
	          conn.end();
	        });
	      } else
	        conn.end();
	    });
		}).on('error', function(err) 
		{
			fnE(err);
	    deny();
	  }).connect(ssh_config);
	}).listen(port, '127.0.0.1', function() 
	{
		console.log("ssh forwarding listen: " + port);
		fnCbk(port);
	  // console.log('SOCKSv5 proxy server started on port '+ port);
	}).useAuth(socks.auth.None());
}

/*
得到已经监听的端口，避免冲突:
*/
var sAll = child_process.execSync("allListen=`netstat -ant|grep LISTEN|awk '{print $4}'|sed 's/.*[:\.]//g'|sort -u`;echo $allListen").toString('utf-8');
console.log("本地已经监听的端口，会自动跳过、避免冲突：" + sAll);
function fnDoIp(ip,u,p,fnCbk,sshport)
{
	//console.log([ip,u,p]);
	while(-1 < sAll.indexOf(String(++startPort)));
	fnMySSocks5(ip,u,p,startPort,fnCbk,sshport);
}

var szCode = String(`random_chain
quiet_mode
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0
[ProxyList]
`).split("\n");
/*
1、建立proxychains配置文件
2、启动ssh远程socks代理，启动前，杀掉相同ip的进程
ssh -4 -f -D 1337 -q -C -N root@192.168.17.98 -p 22
3、启动proxychains
*/
function fnGo()
{
	var szFileName = path.resolve(process.env.PWD,program.file);
	a = fs.readFileSync(szFileName).toString().split(/\n/gmi)
	if(0 == a.length)console.log("read list file ：" + szFileName);

	var i = 0;
	var nC = 0,c = [""],fnCbk1 = function(n)
	{
		szCode.push("socks5  127.0.0.1  " + n);
		nC--;
		if(0 == nC && i == a.length)
		{
			var tP = "/tmp/" + Math.random();
			fs.writeFileSync(tP,szCode.join("\n"));
			var szCmd = "`which proxychains4` -f " + tP + " node tools/mySocks5.js  -h 127.0.0.1 -p " + youPort + " &";
			console.log("run\n" + szCmd);
			console.log("start proxy port ：" + youPort);
			console.log("proxychains4 config: " + tP);
			child_process.execSync(szCmd);
			// check port start LISTEN ok?
			var szTmp = child_process.execSync("netstat -ant|grep LISTEN|grep tcp4|grep " + youPort);
			if(szTmp)
			{
				console.log("start proxy port " + youPort + " is Ok: \n" + szTmp);
			}
		}
		// else console.log("warning：service not start");
	};
	// console.log(a)
	for(; i < a.length; i++)
	{
		if(!a[i])continue;
		var t = a[i].trim().split(/[\s\t]+/);
		if(4 > t.length)
		{
			console.log("format error：" + t);
			continue;
		}
		nC++;
		var sshport = t[2].split("/")[0];
		// console.log(`[${sshport}]`)
		// console.log([t[0],t[4],t[5]])
		if(-1 < t[0].indexOf(prefix))fnDoIp(t[0],t[4],t[5],fnCbk1,sshport);
		else if(t[0] != t[1] && -1 < t[1].indexOf(prefix))fnDoIp(t[1],t[4],t[5],fnCbk1,sshport);
	}
	return (szCode);
}

fnGo();
