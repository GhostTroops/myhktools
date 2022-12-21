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
		if(stats && stats.isFile() && /\.(txt|log|csv|hta|htm|html|js|sql)/gmi.test(filename) && fs.existsSync(filename))
		{
			try{
				var k = fs.readFileSync(filename);
				var charset = detectCharacterEncoding(k);
				console.log(filename + " 检测出来的字符集是：" + charset.encoding);
				if(charset.encoding == "UTF-8")return;
				// console.log(charset.encoding + " " + filename);
				k = iconv.decode(k,charset.encoding || "gbk").toString("utf8");
				fs.writeFileSync(filename,k);
				console.log(filename);
				console.log(k);
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

