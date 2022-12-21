// 校验http、https 代理是否可用
// node checkProxy.js ~/C/ip_log.txt 
var fs  = require("fs"),
	a = process.argv.splice(2),
    request = require("request"),
    g_oR = request,
    g_aProxys = [];


function fnCheck(a,fnCbk)
{
	var aI = a || fs.readFileSync(a[0]).toString().trim().split(/\n/);
	console.log("Ip数量: " + aI.length);

	var i = 0;
	for(; i < aI.length; i++)
	{
		if(aI[i] = aI[i].trim())
		{
			var aT = aI[i].split(/\s*\|\s*/);
			if(3 > aT.length || !aT[1])continue;
			// console.log("Start: " + aT[1]);
			if(aT[3].indexOf(","))aT[3] = aT[3].split(/,/gmi)[0];
			r = request.defaults({'proxy': aT[3].toLowerCase()+ '://' + aT[1] + ":" + aT[2]});
			// process.env[aT[3] + "_PROXY"] = aT[1] + ":" + aT[2];
			// process.env["HTTPS_PROXY"] = ;
			(function(t1,reP,aT2){
				try{
					r.get(
						{
							uri:"http://ipinfo.io/" + aT2[1],
							//headers:{"user-agent":"curl/7.0"},
							"timeout":5000
						},
					function(e,r,b)
					{
						if(!e && b && /\s*\d+\.\d+\.\d+\.\d+\s*/.test(b = b.trim()))
						{
							console.log("Ok: " + b + "  秒:" + (new Date().getTime() - t1) / 1000);
							fs.appendFileSync(__dirname + "/autoProxy.txt", [aT2[3],aT2[1],aT2[2]].join(",") + "\n");
							g_aProxys.push([aT2[3],aT2[1],aT2[2]].join("\t"));
							g_oR = reP;
						}
						// else if(e)console.log(e);
					});
				}catch(e1){};
			})(new Date().getTime(), r,aT);
		}
	}
	var nTm = setInterval(function()
	{
		if(i >= aI.length)
		{
			clearInterval(nTm);
			fnCbk();
		}
	},133);
	
}

// http://www.ip181.com/
// http://www.ip181.com/daili/1.html
// https.globalAgent.options
// https.globalAgent.options
function fnCrawler(url,fnCbk)
{
	console.log(url);
	var a, aT = [], re = /<td>(\d+\.\d+\.\d+\.\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>[^<]*<\/td>\s*<td>([^<]+)<\/td>/gmi;
	g_oR//.defaults({'proxy': 'http://127.0.0.1:8080'})
	.get(url,function(e,r,b)
	{
		while(a = re.exec(e || b))
		{
			aT.push(["",a[1],a[2],a[3]].join("|"))
		}
		fnCheck(aT,fnCbk);
	});
}

fnCrawler("http://ip181.com",function()
{
	;
});


var szFile = "/usr/local/etc/proxychains.conf", s = fs.readFileSync("/usr/local/etc/proxychains.conf.bak").toString();
process.on('exit', (code) => 
{
	var ss = g_aProxys.join("\n");
	s = s.replace(/# start\s*.*?# end\s*/gmi,"# start\n" + ss.toLowerCase() + "\n# end\n");
	fs.writeFileSync(szFile,s);
	// console.log(s);
});

/*////
var g_nI = 1;
function fnDostart()
{
	fnCrawler("http://www.ip181.com/daili/"+ g_nI +".html"
	// "http://www.ip181.com/"
	,function(){
		g_nI++;
		fnDostart();
	});
}
//////*/
// 去重
//  cat autoProxy.txt|sort|uniq >ok.txt
// mv ok.txt autoProxy.txt
// cat autoProxy.txt|wc -l
// fnDostart();
