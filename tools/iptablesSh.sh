iptables --flush
iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP
iptables -A INPUT -p tcp -s  45.78.0.0/16  -j DROP
iptables -A OUTPUT  -p tcp -s 45.78.0.0/16  -j DROP
iptables  -L -n -v
iptables -nL --line-number
apt-get install iptables-persistent;sudo netfilter-persistent save
/etc/rc.d/init.d/iptables save


