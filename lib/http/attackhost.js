module.exports={
    tags:"http,host,spoof,web",
    dependencies:"",
	des:"spoof host,Vulnerability detection",
	VulApps:[],
	urls:[],
	doCheck:function (url,fnCbk)
	{
        url = url.trim().replace(/[\s\r\n]*/gmi,'');
        var _t = this,_s = this.self,hst = _s.parseUrl(url),szXx = "m.t.x.hktalent";
        hst.port = hst.port||(-1 < hst.protocol.indexOf("https")?443:80);
        try{
        var szPaload = `GET ${hst.pathname} HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Host: ${szXx}
User-Agent: ${_s.g_szUa}
Connection: close


`;
        // console.log(hst.port)
            _s.fnSocket(hst.hostname,hst.port,szPaload,function(s)
            {
                s = String(s);
                // re = /(Content-Security-Policy|X-Webkit-CSP|X-Content-Security-Policy):([^\n]+)/gmi,
                var aIp = 0,szInfo = '',aIps={}, ipR = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?/gmi;
                
                while(aIp = ipR.exec(s))
                {
                    if(!aIps[aIp[0]] && -1 == url.indexOf(aIp[0]))
                    {
                        aIps[aIp[0]]=1;
                        szInfo += aIp[0] + "; ";
                    }
                }
                var r = {"url":url,"send":szPaload};
                if(szInfo)r.vul = true,r.leakInfo = szInfo;
                var i = s.indexOf(szXx);
                if(-1 < i)
                {
                    r.result = s.substr(i - 20, szXx.length * 5);
                    r.vul = true;
                }
                fnCbk(r,_t);
            });
        }catch(e){
            _s.error(e)}
	}
};