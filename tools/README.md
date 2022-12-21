## 发送匿名邮件，并携带邮件跟踪信息，获得对方的ip、浏览器信息
需要你适当修改代码
```
proxychains4 -f ~/pc.conf  node sendmail.js  title msg
```
各种简单的解码、编码
```
open strDecodeEncode.html
```

## 各种简单的解码
```
node decode.js youCode
```
## get pdf file pages number
```
getPdfPagesNum.sh pdfilename
```

## 内网服务转发
1. 别人能够访问的机器
2. 你可以访问内网其他机器服务，但是别人不能访问
3. 将内网服务转换为你的服务
4. 你将得到9000的端口服务等同于192.168.10.115:8080的服务

```
node portForward.js 9000 192.168.10.115 8080
或者
node port2IP_Port.js  -p 8080 -v -t 8070 -i xxxx
```


## jsXSS 绕过 编码
```
npm i -g hieroglyphy
hieroglyphy -h
```


## 反爬虫、对抗爬虫时，或者生僻字处理，需要将文本转换svg
```
node txt2SVG.js '齫 齬 齭 齮 齯 齰 齱 齲 齳'>kkkk.svg
```


## 获取文件经纬度等信息
mac os：

```
mdls  ~/Desktop/3581520995599_.pic_hd.jpg 

node getFileInfo.js fileName
node getFileMetadata.js fileName
```

## ssh密码破解或者命令执行
有时候需要批量检测机器是否已经被入侵，批量运行netstat -antlp，分析结果是很有必要的

```
node ssh2Cmd.js --port 29156 --host 192.168.17.74 --username root --password xxx123

node ssh2Cmd.js --port 29156 --host 192.168.17.74 --username root --password xxx123 --cmd  'netstat -antlp'
```

## socks代理
```
node tools/mySocks5.js --user mtxuser --password Wr90,_x*d -p 15533
node proxy/ProxyServer.js --proxy 'socks://mtxuser:Wr90,_x*d@127.0.0.1:15533'
```
### 测试代理
```
curl -x "http://127.0.0.1:15533" http://ip.cn
curl -x "socks5://mtxuser:Wr90,_x*d@127.0.0.1:15533" http://ip.cn
curl -x "socks5://127.0.0.1:15533" http://ip.cn
```

同时使用多个vps线路的情况，苹果系统代理不能设置密码，否则各种问题
```
proxychains4 -f ~/safe/`whoami`/proxychains.conf node /Users/`whoami`/safe/myhktools/tools/mySocks5.js -p 15533
```

```
cat ~/safe/`whoami`/proxychains.conf
random_chain
# dynamic_chain按照列表中出现的代理服务器的先后顺序组成一条链，如果有代理服务器失效，则自动将其排除，但至少要有一个是有效的
#dynamic_chain
proxy_dns
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0
localnet 192.168.1.0/255.255.0.0
localnet 172.16.1.0/255.255.0.0
[ProxyList]
socks5	127.0.0.1	1086
socks5  127.0.0.1       1089
socks5  127.0.0.1       1099
socks5  127.0.0.1       1088
socks5  127.0.0.1	1199
# 172.12.
# socks5  192.168.1.150	1299
```


## https,openssl
增加获取https证书的工具，方便中间人攻击时用  tools/getHttpsPemFile.sh
```
sh tools/getHttpsPemFile.sh www.baidu.com:443 myPem
```

## 压缩、解码js代码(windowns下运行)
压缩.hta

## windows下导出RTX通讯录
1. 先登录RTX
2. 运行、导出通讯录
win_导出RTX_client通讯录mytels.hta

## 文件、目录下所有文本文件转换为utf-8
node gbk2utf8.js fileOrDir

## 入侵取证获取文件、目录中的ip信息
node getIps.js fileOrDir

