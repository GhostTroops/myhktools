// 用于最差文件中包含哪些ip，通常用于跟踪黑客行为时使用
// cat gx.txt |sort|uniq
// wc -l gx.txt
// node getIps.js /Volumes/MyWork/log/btmp.zip
// node /Users/xiatian/safe/nodeJs/hktools/getIps.js ~/Desktop/xiaomamaa 
var fs = require("fs"),
// 避免重复输出
 	oT = {},
	moment = require('moment'),
	request = require('request'),
    mypath = "/Users/xiatian/safe/myhktools/db/ips/", child_process = require('child_process') ;
function isExists(t)
{
  return fs.existsSync( mypath+ t);
}

var rg = /<code>(\d*\.\d*\.\d*\.\d*)<\/code><\/p><p>所在地理位置：<code>([^<]+)<\/code><\/p>/gmi;
// 获取ip信息
function getIp(ip,fncbk)
{
	if(oT[ip] || /^192\./.test(ip))return;
	var o,fncbk1 = function(o)
	{
		if(oT[ip])return;
		oT[ip] = o;
		if(!o.date)o.date = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
		if(o.bogon)
		{
			o.Private = "私有网络";
		}//else if(o.country = 'CN')console.log(o);
		fncbk(o);
		fs.writeFileSync(mypath + ip,JSON.stringify(o));
	};
	  if(isExists(ip))
	  {
	    o = JSON.parse(fs.readFileSync(mypath + ip));

		if(!o.error && !o.bogon && (!o.region || o.region == o.ip))
		{
			(function(oT9){
			request.get({uri:"http://ip.cn/" + oT9.ip,headers:{"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"}},
				function(e,r,b)
		  	{
		  		if(e)return console.log(e);
		  		// console.log(b);
		  		var a = rg.exec(b);
		  		if(a)
		  		{
		  			oT9.region = a[1];
		  			// o.city = a[3];
		  			fncbk1(oT9);
		  			fs.writeFileSync(mypath + oT9.ip,JSON.stringify(oT9));
		  			// console.log(["Ok ", a[1],a[2],a[3]].join("\t"));
		  		}
		  		else console.log(oT9);
		  	});
			})(o);
		}
	    // 显示公网
	    //if(o && !o.bogon)
	    	//console.log(o),
	    else fncbk1(o);
	  }
	  else 
	  {
	  	if(-1 == ip.indexOf("192."))
		  	request.get("http://ipinfo.io/" + ip,function(e,r,b)
		  	{
		  		if(e)return ;
		  		o = JSON.parse(b);
		  		fncbk1(o);
		  	});
	  	else fncbk1({ip:ip});
	  }
}

var g_oIps = {};
// 读取文本文件
function fnReadTxt(f,szH)
{
	fs.exists(f,function(bC)
	{
		if(bC)
		{
			fs.readFile(f, 'utf8', function (err, s) 
		    {
		        if (err) throw err;
		        else
		        {
		        	var rg = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gmi;
		        	var x = null;
		        	while(x = rg.exec(s))
		        	{
		        		if(!oT[x[1]])
		        		{
		        			(function(t1)
		        			{
		        				if(!g_oIps[t1])
		        				{
		        					if(0 == t1.indexOf("1.1."))return;
		        					
		        					g_oIps[t1]=1;
			        				getIp(t1,function(o1)
			        				{
			        					oT[t1] = o1;
			        					g_oIps[t1] = o1;
			        				});
		        				}
		        			})(x[1]);
		        			
		        			// if(!szH || -1 < x[1].indexOf(szH))console.log(x[1]);
		        		}
		        	}
		        }
		    });
		}
		else
		{
		    console.log("can not find file: " + f);
		}
	});
}


function fnReadTxtnetstat(f,szH)
{
	fs.exists(f,function(bC)
	{
		if(bC)
		{
			fs.readFile(f, 'utf8', function (err, s) 
		    {
		        if (err) throw err;
		        else
		        {
		        	var rg = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:[\d\*]*)\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:[\d*]*)\s*[^\s]+\s*(\d*)\/([^\s]+)/gmi;
		        	var x = null;
		        	while(x = rg.exec(s))
		        	{
		        		if(!oT[x[1]])
		        		{
		        			oT[x[1]] = 1;
		        			if(!szH || -1 < x[1].indexOf(szH))
		        				console.log(x[1] + "\t" + x[2] + "\t" + x[3] + "\t" + x[4]);
		        		}
		        	}
		        }
		    });
		}
		else
		{
		    console.log("can not find file: " + f);
		}
	});
}

function fnDoDir(s,s2)
{
	if(!(/\/$/g.test(s)))s += "/";
	var files = fs.readdirSync(s);
	files.forEach(function(f)
    {
    	var s1 = s + f;
    	try{
	    	var info = fs.statSync(s1);
	    	if(info.isDirectory())
	    	{
	    		fnDoDir(s1, s2);
	    	}
	    	else if(info.isFile(s1))fnReadTxt(s1,s2);
    	}catch(e)
    	{
    		// console.log("skip: " + s);console.log(e);
    	}
    });
}

process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.defaultMaxListeners = 0
process.env.NODE_ENV = "production";
// 读取命令行参数
if(process.argv)
{
	var a = process.argv.splice(2);
	if(0 < a.length)
	{
		var info = fs.statSync(a[0]);
		if(info.isDirectory())fnDoDir(a[0],a[1]);
		else fnReadTxt(a[0],a[1]);
	}
}
process.on('exit', (code) => 
{
	for(var k in g_oIps)
	{
		var oT1 = g_oIps[k];
		if(oT1.region && "Sichuan" == oT1.region || true == oT1.bogon || oT1.error)
		{
			if(oT1.country == "US")console.log(oT1);
			delete g_oIps[k];
			continue;
		}
		if(oT1.region || oT1.city){console.log([k,oT1.region,oT1.city].join(','));}
		else console.log(k);
	}
	// console.log(JSON.stringify(g_oIps,null,' '));
	// console.log(JSON.stringify(oT,null,' '));
});