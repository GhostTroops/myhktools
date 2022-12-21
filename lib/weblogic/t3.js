
module.exports={
	tags:"t3,weblogic",// 驱动监测到这里的关键词，都调用该插件进行检测
	"ID":"030104",
	des:"T3开放状态监测",
	suport:"建议关闭T3协议，或者限定特定ip可访问",
// check weblogic T3
// sort ip.txt|uniq>ip2.txt;mv ip2.txt ip.txt
	doCheck:function (url,fnCbk)
	{
		var _s = this.self, oU = _s.parseUrl(url),
			h = oU.hostname,p = oU.port || 80,_t = this,
			s = "t3 12.2.1\nAS:255\nHL:19\nMS:10000000\nPU:t3://us-l-breens:7001\n\n";
		_s.t3 || (_s.t3 = {});
		if(_s.t3[h + ":" + p])return;
		_s.t3[h + ":" + p] = 1;

		// var s  = "t3 12.1.2\nAS:2048\nHL:19\n\n";
		_s.fnSocket(h,p,s,function(data)
		{
			data=(data||"").toString().trim();
			var r = {"url":url,"send":s,"data":data};
			
			if(data && /(weblogic\.security\.net\.FilterException)|(Bad Request)|(10\.3\.)/gmi.test(data))
			{
				_s.copyO2O({des:"建议关闭互联网对T3协议对访问，同时限定特定ip可访问","vul":true},r);
				_s.log("found T3 " + h + ":" + p);
			}
			else console.log(data)
			_s.t3[h + ":" + p] = r;
			fnCbk(r,_t);
		});
	}
};