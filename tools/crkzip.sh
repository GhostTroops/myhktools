# crack zip password，破解zip文件密码
crunch 6 6 1234567890 -o /root/numericwordlist.lst
fcrackzip  -v -l 4-6 -D -p /root/numericwordlist.lst -m zip2 -u $1

