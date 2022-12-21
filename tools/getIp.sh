ip=`ipconfig getifaddr en0`
if [ "$ip" == "" ];
then 
    ip=`ipconfig getifaddr bridge0`
fi
if [ "$ip" == "" ];
then 
    ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
fi

# ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'
# ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'


if [ "$ip" != "" ];
then 
    echo $ip
fi