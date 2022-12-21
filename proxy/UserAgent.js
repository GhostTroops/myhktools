// cd /usr/local/lib/node_modules/anyproxy/
// node rule_sample/UserAgent.js 
// make data /usr/local/lib/node_modules/anyproxy/rule_sample/allUserAgents.js
var fs = require('fs'), async = require('async'),
	path = "/usr/local/lib/node_modules/anyproxy/rule_sample/",
    szTmpFileName = path + "uas.txt",uas = null,
    r = /<li><a href='\/index\.php\?id=\d+'>([^<]+)</gmi,
    a = null,i = 0;

async.series([
	function(cbk)
	{
		if(fs.existsSync(szTmpFileName))
		{
			uas = fs.readFileSync(szTmpFileName);
			cbk();
		}
		else
		{
			require('request').get("http://www.useragentstring.com/pages/useragentstring.php?name=All",function(e,r)
			{
				uas = e || r;
				cbk();
			});
		}
	},
	function(cbk)
	{
		var fnAp = function(s)
		{
			fs.appendFileSync(path + 'allUserAgents.js',s,function(){});
		},a;
		fnAp("exports={");
		while(a = r.exec(uas))
		{
			i++;
			fnAp(['"',a[1],'",'].join(""));
			// g_ua.push(a[1]);
		}
		fnAp("};");
		cbk();
	}
	],function(e,r)
{
	console.log("处理完: " + i);
});


