// 数据拷贝
global.copyO2O=function (oS,oD,b)
{
	var o = b? {} : oD;
	if(b)
	{
		for(var k in oD)
		{
			o[k] = oD[k];
		}
	}
	for(var k in oS)
	{
		o[k] = oS[k];
	}
	return o;
}
// 定义全局变量
copyO2O({szMyName:'巅狼团队M.T.X._2017-06-08 1.0',
	program:require('commander'),
	request:require('request'),
	g_oRstAll:{},// 结果差分比较
	// args:process.argv.splice(2),
	_request:require('request'),
	urlObj:require('url'),
	g_szSplit:/[,;\s\|]/gmi,
	g_host2Ip:{},// 域名到ip转换缓存
	async:require('async'),
	g_nThread:5,// 并发线程数
	g_szUa:"Mozilla/5.0 (ss) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/2188029 NetType/4G WebP/0.3.0 Pixel/540",
	child_process:require("child_process"),
	net:require('net'),
	crypto:require('crypto'),
	path:require("path"),
	fs:require('fs'),
	http:require("http"),
	iconv:require("iconv-lite"),
// 头信息的处理
fnRequest:function(req)
{
	if(req && req.headers)
	{
		var h = req.headers;
		h["accept-language"] = 'zh-cn';
		h["user-agent"] = g_szUa;
	}
	return req;
},
	/*
生成密码
*/
fnMkUp:function(u,p)
{
	
    var s = new Buffer(u + ":" + p);
    // console.log(s.toString("base64"));
    return(s.toString("base64"));
},// 一次性建立多级目录
mkdirs:function(s)
{
	var a = s.split('/'), s1 = '';
	for(var i = 0; i < a.length; i++)
	{
		if(!a[i])continue;
		s1 += (0 < i ? "/" : "")+ a[i];
		if(!fs.existsSync(s1))
			fs.mkdirSync(s1);
	}
},/* 获取文件状态
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
注意: atimeMs, mtimeMs, ctimeMs, birthtimeMs 是以单位为毫秒保存相对应时间的数字 numbers. 
他们的精度由所在的平台决定. atime, mtime, ctime 以及 birthtime 是表示各个时间的日期对象 [Date][MDN-Date].
Date 与 数值并没有关联. 对数值进行重新赋值, 或者改变 Date 的值, 不会反映到相对应的表示中.
stat 对象中的时间有以下语义：

atime "访问时间" - 文件数据最近被访问的时间。 会被 mknod(2)、 utimes(2) 和 read(2) 系统调用改变。
mtime "修改时间" - 文件数据最近被修改的时间。 会被 mknod(2)、 utimes(2) 和 write(2) 系统调用改变。
ctime "变化时间" - 文件状态最近更改的时间（修改索引节点数据） 会被 chmod(2)、 chown(2)、 link(2)、 
mknod(2)、 rename(2)、 unlink(2)、 utimes(2)、 read(2) 和 write(2) 系统调用改变。
birthtime "创建时间" - 文件创建的时间。 当文件被创建时设定一次。 在创建时间不可用的文件系统中，
该字段可能被替代为 ctime 或 1970-01-01T00:00Z（如 Unix 的纪元时间戳 0）。
 注意，该值在此情况下可能会大于 atime 或 mtime。 在 Darwin 和其它的 FreeBSD 衍生系统中，
 如果 atime 被使用 utimes(2) 系统调用显式地设置为一个比当前 birthtime 更早的值，也会有这种情况。
在 Node.js v0.12 之前的版本中，ctime 在 Windows 系统中保存 birthtime。 注意，在 v0.12 中，
ctime 不是“创建时间”，并且在 Unix 系统中，它从来都不是。
*/
fnGetFileStat:function(s)
{
	if(fs.existsSync(s))
		return fs.statSync(s);
	return null;
},
	fnError:function(e)
	{
		console.log(String(e));
	},
	fnMyHelp:function(fn)
{
	var s = (fn||fnHelp).toString().split(/\n/).slice(2, -2).join('\n');
	if(fn)return s
	console.log(s);
},
// 循环处理本地文件、目录
doFile:function(opt)
{
	var filename = opt.filename || ".",filter = opt.filter || function(s)
	{
		return /\.(txt|log|csv|hta|htm|html)/gmi.test(s);
	},delFilter = opt.delFilter || function(s)
	{
		return /\.DS_Store$/gmi.test(s);
	},fnCbk = opt.fnCbk || function(s){};
	fs.stat(filename,function(e,stats)
	{
		if(stats.isFile() && filter(filename) && fs.existsSync(filename))
		{
			try{
				fnCbk(filename);
				/*
				var k = fs.readFileSync(filename);
				fs.writeFileSync(filename,k);
				console.log(filename);
				console.log(k);*/
			}catch(e1){console.log(e1);}
		}
		else if(stats.isDirectory())
		{
			fs.readdir(filename,opt.options || {"encoding":"utf8"},function(e,aF)
			{
				aF.forEach(function(i)
				{
					if(delFilter(i))
					{
						fs.unlinkSync(filename + "/" + i);
					}
					else doFile(copyO2O({filename:filename + "/" + i},opt,true));
				});
			});
		}
	});
}
},global);

// 加载所有的插件动态库
// 各种插件库分开编写，便于维护
// eval(fs.readFileSync(a[k])+'');
process.title = szMyName;
process.stdin.setEncoding('utf8');
process.env.NODE_ENV = "production";
process.on('uncaughtException', fnError);
process.on('unhandledRejection', fnError);

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