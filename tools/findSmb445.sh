k=`rm mtx_7.tmp`
mtx_7=`echo ${rtpswd} | sudo -S masscan -p445 --rate=1000 192.168.1.1/16`
mtx_71=''
mtx_71=$mtx_71`echo $mtx_7|grep Discovered|awk '{print $6}'`
echo $mtx_71 >> mtx_7.tmp
cat mtx_7.tmp
echo ${rtpswd} | sudo -S nmap -Pn -sS -T4 -iL mtx_7.tmp --script smb-vuln-ms17-010,smb-vuln-ms08-067 -n --max-retries 5 -p 445 -oA smb-scan
rm mtx_7.tmp

