mysvn="$1"
echo "input gpg password"
gpg ${mysvn}.7z.gpg  && rm ${mysvn}.7z.gpg
echo "input 7z password"
7z x ${mysvn}.7z && rm ${mysvn}.7z
# x eXtract with full paths
tar xvf ${mysvn}.tar && rm ${mysvn}.tar
ls -lah ${mysvn}/

