echo use:
echo sh tools/getHttpsPemFile.sh host:port pemFileName 
echo eg:
echo sh tools/getHttpsPemFile.sh www.baidu.com:443 myPem
openssl s_client -showcerts -connect $1 </dev/null 2>/dev/null|openssl x509 -outform PEM >$2.pem
echo now,your pem file is: $2.pem
echo use openssl show pem file info:
openssl x509 -in $2.pem  -noout -text

