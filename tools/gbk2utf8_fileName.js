#!/usr/bin/env node

// 别忘记了，后渗透meterpreter会产生大量的gbk文件，在mac osx、linux下无法正常阅读
var a = process.argv.splice(2),
	fs = require('fs'),
	detectCharacterEncoding = require('detect-character-encoding'),
    iconv = require("iconv-lite");

function doFile(filename)
{
	fs.stat(filename,function(e,stats)
	{
		if(stats && stats.isFile() && fs.existsSync(filename))
		{
			try{
				if(/index\.html/.test(filename))return;
				// filename = iconv.decode(filename,"gbk").toString("utf8");
				// console.log(filename);
				var charset = detectCharacterEncoding(Buffer.from(filename));
				if(-1 < charset.encoding.indexOf("ISO-8859-"))return;
				// if(charset.encoding == "UTF-8")return;
				// console.log(filename + " 检测出来的字符集是：" + charset.encoding);

				var szGbk = iconv.decode(filename,"gbk").toString("utf8");
				if(fs.existsSync(szGbk))
				{
					console.log(" 可以删除： " + filename);
					fs.unlink(filename,(e)=>{});
				}
				// if(-1 < szGbk.indexOf("\\u"))return;
				// if(szGbk != filename)console.log(["gbk:" + szGbk, "utf8:"+ filename]);
				
				// console.log(charset.encoding + " " + filename);
				// k = iconv.decode(k,charset.encoding || "gbk").toString("utf8");
				// fs.writeFileSync(filename,k);
				// console.log(filename);
				// console.log(k);
			}catch(e1){console.log(e1);}
		}
		else if(stats && stats.isDirectory())
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

doFile(a[0]);

