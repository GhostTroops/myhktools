#!/usr/bin/env node
// parse svn authz file
// node tools/parseSvnAuthz.js -f "./authz" -k slname
// 查找md5 hash字符串
// grep 'xxx' ./svn.sql|cut -f 5 -d','
var fs  = require("fs");

var a = null,
    // 分组
    groups = {},
    program = require('commander'),
    // 人
    oR = {},
    // 项目
    xx = {};
program.version("svn配置文件解析")
	.option('-k, --key [value]', '搜索的人有哪些目录权限')
	.option('-f, --file [value]', '配置文件')
	.option('-p, --pswd [value]', 'passwd，or file')
	.option('-c, --cmd  [value]', '生成cmd，eg: "wget -x -c -nH --remote-encoding=UTF8 --progress=bar:force:noscroll --tries=0 -N --timeout=3 no-http-keep-alive -r  --header=\'authorization:Basic xxx\'http://xxxx"')
	.parse(process.argv);
process.setMaxListeners(0);
process.on('uncaughtException', function(e){console.log(e)});
process.on('unhandledRejection', function(e){console.log(e)});


if(program.pswd)
{
	if(fs.existsSync(program.pswd))
	{
		var szPswdFl = fs.readFileSync(program.pswd).toString(),re = new RegExp(program.key + ":([^\\n]+)\\n","mgi");
		szPswdFl = re.exec(szPswdFl);
		if(szPswdFl)
		{
			program.pswd=szPswdFl[1];
			// console.log(program.pswd);
		}
	}
}

function fnGet(u,p)
{
	if("true" == p || true === p)return '';
	return Buffer.from(u + ":" + p).toString("base64").replace(/\s/gmi, '');
}
var xxx = '';
if(program.key && program.pswd)xxx = fnGet(program.key,program.pswd);

a = program.file && fs.readFileSync(program.file).toString("utf-8").trim().replace(/\r/gmi,'').replace(/\n+/gmi,'\n') || '';
a = a.split(/\n/);

var nLstXm = 0,szLstPath = '';
a.forEach(function(i,n)
{
	if(-1 == i.indexOf('='))
	{
		// 记录项目路径位置
		nLstXm = n;
		szLstPath = '';
		return;
	}
	var t = i.split(/=/);
	if(2 == t.length && t[1])
	{
		// 分组与项目路径的读写权限
		if(/^[rw]*$/gmi.test(t[1]))
		{
			// 读写权限路径
			if(!szLstPath && 1 < nLstXm)
				szLstPath = a[nLstXm].replace(/\[|\]/gmi,'');
			t[0] = t[0].replace(/^@/,'');
			// console.log([t[0],groups[t[0]],szLstPath,nLstXm]);
			if(szLstPath)
			{
				var oD = groups[t[0]] || (groups[t[0]] = {});
				oD = oD['dirs'] || (oD['dirs'] = {});
				oD[szLstPath] = 1;
				return;
			}
			else{console.log(i + "没有找到授权路径");}
		}
		// 人与分组的关系，确保通过人、分组能够查到关系
		var oD = groups[t[0]] || (groups[t[0]] = {});
		oD['rs'] = t[1];
		var aR1 = t[1].split(/[,;]/);
		aR1.forEach(function(iR,rN)
		{
			var oTr = oR[iR] || (oR[iR] = {});
			oTr[t[0]] = 1;
		});
		
		// console.log([i,n]);
	}
});

process.on('exit',function()
{
	var szK = '', o1, a = [],szCmd = '';
	if(program.cmd)szCmd = program.cmd;
	if(xxx && szCmd)
	{
		szCmd = szCmd.replace(/xxx/gim,xxx);
	}
	if(szK = program.key)
	{
		// 分组信息
		if(o1 = oR[szK])
		{
			for(var k in o1)
			{
				var oDir = groups[k]['dirs'];
				if(oDir)
				{
					for(var x in oDir)
					{
						a.push(szCmd + x);
					}
				}
			}
		}
	}
	if(0 < a.length)
	{
		if(!szCmd)console.log("找到读目录权限：");
		console.log(a.join('/\n'));
	}else if(!szCmd)console.log("sorry 没有找到");
});

// console.log(require("os").userInfo().username);
/////*
//// # 用户信息
// ls -la data/nmap/*.xml|sed 's/.*\///g'|sed 's/\..*$//g'|sort -u
////# fnTest(); 密码信息
////node tools/parseSvnAuthz.js
////# 获取mac地址
// cat /Users/`whoami`/safe/myhktools/data/nmap/*.xml | grep 'NetBIOS MAC: '|sed 's/.*NetBIOS MAC://g'|sed 's/(.*//'
// grep -Eo 'NetBIOS MAC: [a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}' /Users/`whoami`/safe/myhktools/data/nmap/*.xml
// grep -Eo 'Java RMI Registry' /Users/`whoami`/safe/myhktools/data/nmap/*.xml
////*/
function fnTest(sN)
{
	var s = JSON.parse(fs.readFileSync('/Users/'+ require("os").userInfo().username +'/safe/myhktools/data/svn/indexAll.txt').toString('utf8'));
	for(var k in s)
	{
		a = s[k].pwd;
		if(!a || /(账号|yh\d*|1|,)/gmi.test(k))continue;
		//console.log(a);
		for(var x = 0; x < a.length; x++)
		{
			if(sN && sN == k)return a[x];
			console.log([k, a[x]].join(','));
		}
	}
}
// fnTest();
