// node emlToFileToos.js /Volumes/MyWork/eml /Volumes/MyWork/eml_data
var fs = require('fs'),
	a = process.argv.splice(2),
	emlformat = require('eml-format'),
	Iconv = require('iconv').Iconv,
	iconv = require('iconv-lite'),
	detectCharacterEncoding = require('detect-character-encoding'),
	path = "/Volumes/MyWork/eml_data/", g_n = 0;

// 记录处理过的，避免重复处理，这样支持断点处理
var g_oCach = {};

function fnFdPath()
{
	var t;
	while(fs.existsSync(t = path + g_n))
	{
		g_n++;
	}
	fs.mkdirSync(t);
	return t + "/";
}

// 多个文件的写
function fnWB(p, b)
{
	for(var i =0; i < b.length; i++)
	{
		/*
"boundary": "_000_16fb43c9e4bf426084e5fea890c10d15HQMB03intralegendseccom_",
     "part": {
      "headers": {
       "Content-Type": "text/plain; charset=\"utf-8\"; name=\"image001.png\"",
       "contentType": "image/png; name=\"image001.png\"",
       "Content-Transfer-Encoding": "base64"
      },
      "body": 
		*/
		var o = b[i],szFn = o.boundary || (1+i),szDc = "", bInline = o.inline || 0,szCharset = "UTF-8",
		    szFlExt = "", szFlName = szFn, szTT;
		// 是辨别类型、编码、文件名
		if(o.part)
		{
			if(o.part['headers'])
			var oCt = o.part['headers']["Content-Type"] || o.part['headers']["contentType"];
			oCt = oCt.splice(/;\s*/gmi);
			if(-1 < oCt[0].indexOf("/plain"))szFlExt = ".txt";
			else if(-1 < oCt[0].indexOf("/html"))szFlExt = ".html";
			if(0 < oCt.length)
			{
				if(-1 < oCt[1].indexOf("charset="))szCharset = /charset=["'](.*?)["']/gmi.exe(oCt[1])[1];
				if(-1 < oCt[1].indexOf("name="))szFlName = /name=["'](.*?)["']/gmi.exe(oCt[1])[1];
			}
			szDc = o.part['headers']["Content-Transfer-Encoding"]|| szDc;
			if(szDc && o.body)o.body = fnBase(o.body,szCharset);
		}
		fs.writeFileSync(szTT = p + szFlName + szFlExt,o.body);
		console.log("::::>> " + szTT);
	}
}

// 写文件
function fnWrite(o,f)
{
	var p = fnFdPath();
	if(o.html)fs.writeFileSync(p + "body.html",o.html);
	else if(o.text)fs.writeFileSync(p + "body.txt",o.text);
	// 处理附件
	var oOld = o,t = o.attachments;
	// delete o.attachments;
	
	o = t;
	if(o && 0 < o.length)
	{
		for(var i = 0; i < o.length;i++)
		{
			if(!o[i])continue;
			// 多附件构造正文
			if(o[i].data && o[i].data.length && o[i].data[0].body)
			{
				fnWB(p,o[i].data);
				continue;
			}
			// 没有文件名，就不写了
			if(!o[i].name || o[i].name == "undefined")continue;
			var szT = p + o[i].name;
			fs.writeFileSync(szT,o[i].data);
			delete o[i].data;
			console.log(szT);
		}
	}
	fs.writeFileSync(p + "info.json.txt",JSON.stringify(oOld,null,' '));
	g_oCach[f] = 1;

	fs.writeFileSync(path + "index.json",JSON.stringify(g_oCach,null,' '));
	// fs.unlinkSync(f);
}

// base64解码
function fnBase(s,c)
{
	var b = Buffer.from(s, 'base64');
	c = c || detectCharacterEncoding(Buffer.from(s)).encoding || "utf-8";
	b = new Iconv(c,'UTF-8').convert(b).toString();
	return b;
	// return Buffer.from(s, 'base64').toString(c || "utf-8");
}

// 去除html标签
function fnT(s)
{
	return String(s).replace(/<.*?>/gmi,'');
}

// 解码
function fnDeCode(d,o1)
{
	var re = /=\?(.*?)\?(B|Q)\?(.*?)\?=/gmi,o = {B:fnBase,Q:function(s){return s}};
	d = String(d).replace(re,function(s0,s1,s2,s3)
		{
			try{
				if(o1 && s1)o1["charset"] = s1;
				return o[s2](s3,s1);}catch(e)
			{console.log(e);return s0}
		});
	// console.log(d);
	return d.replace(/\r|\n/gmi,'').trim();
}

function fnDc(o,body)
{
	if(o)
	for(var k in o)
	{
		if(o[k])o[k] = fnDeCode(o[k],body);
	}
}

// 读取一个文件
function fnReadOneEml(s)
{
	var eml = fs.readFileSync(s, "utf-8");
	emlformat.read(eml, function(error, data) 
	{
	    if (error) return console.log(error);
		fnDc(data.to,data);
		fnDc(data.from,data)
		if(data.text)
		{
			// if(data.charset)data.text = iconv.decode(Buffer.from(data.text),data.charset).toString("utf-8");
			// else data.text = iconv.decode(Buffer.from(data.text),detectCharacterEncoding(Buffer.from(data.text)).encoding).toString("utf-8");
			data.text = fnT(data.text);
		}
		// data.html = fnT(data.html);
		var a = "From,Subject,Cc,To,Thread-Topic".split(","), o = data.headers;
		for(var k in a)
		{
			if(o[a[k]])o[a[k]] = fnDeCode(o[a[k]]);
		}
		if(o.Subject)data.subject = o.Subject,delete o.Subject;
		o = data.attachments;
		if(o && 0 < o.length)
		{
			for(var i = 0; i < o.length;i++)
			{
				if(o[i].name)o[i].name = fnDeCode(o[i].name);
				if(o[i].contentType)o[i].contentType = fnDeCode(o[i].contentType);
			}
		}
		// data.headers['X-CM-SenderInfo'] = fnBase(data.headers['X-CM-SenderInfo']);
		// data.headers['X-Coremail-Antispam'] = fnBase(data.headers['X-Coremail-Antispam']);
		  // fs.writeFileSync("sample.json", JSON.stringify(data, " ", 2));
		fnWrite(data,s);
	});
}

function doFile(filename)
{
	fs.stat(filename,function(e,stats)
	{
		if(stats.isFile() && /\.(eml)/gmi.test(filename) && fs.existsSync(filename))
		{
			try{
				// 跳过mac系统临时文件
				if(-1 == filename.indexOf("/._") && !g_oCach[filename])
				{
					console.log(filename);
					fnReadOneEml(filename);
				}
			}catch(e1){console.log(e1);}
		}
		else if(stats.isDirectory())
		{
			fs.readdir(filename,{},function(e,aF)
			{
				aF.forEach(function(i)
				{
					if(".DS_Store" == i)
					{
						fs.unlinkSync(filename + "/" + i);
					}
					else doFile(filename + "/" + i);
				});
			});
		}
	});
}

if(0 < a.length && a[0])
{
	if(1 < a.length)path = a[1];
	if(fs.existsSync(path + "index.json"))
		g_oCach = JSON.parse(fs.readFileSync(path + "index.json").toString());
	doFile(a[0]);
}