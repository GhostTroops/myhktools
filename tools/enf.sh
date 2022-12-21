# Encrypting files in Linux
# apt-get install p7zip-full p7zip-rar
mysvn="$1"
tar cpvf ${mysvn}.tar ${mysvn}/
echo "input 7z password"
7z a -p -mx=9 -mhe -t7z ${mysvn}.7z ${mysvn}.tar && rm ${mysvn}.tar
# Params
# a            Add
# -p{Password} Set Password
# -mx=9        ultra compression
# -mx=0   no compression - just add the files,more faster
# -mhe         encrypt file names
# -t7z         file type .7z
echo "input gpg password"
gpg -c ${mysvn}.7z && rm ${mysvn}.7z
ls ${mysvn}.*

