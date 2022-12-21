if [[ -f "ins.tmp" ]];then
    rm ins.tmp
fi
find . -name "*.js" -exec grep -h -R  -Eo "require\(['\"]([^\.][^'\"\/]+?)['\"]\)" {} \; >>ins.tmp
grep -Eo  "['\"]([^'\"\.\/]+?)['\"]" ins.tmp |sed 's/"//g'|sed "s/'//g"|sort|uniq >>ins1.tmp
if [[ -f "ins.tmp" ]];then
    rm ins.tmp
fi
xx="/root/local/lib/node_modules/"
if ! [[ -d $xx ]];then
    xx="/usr/local/lib/node_modules/"
fi
if ! [[ -d $xx ]];then
    xx="/root/mytools/node-v10.12.0-linux-x64/lib/node_modules/"
fi
ls -1 $xx >ins3.tmp
grep -F -f ins3.tmp ins1.tmp| sort | uniq > ins4.tmp
chmod 777 install.sh
cat ins4.tmp | awk '{print "npm i "$1}' > install.sh
rm ins1.tmp
rm ins4.tmp
rm ins3.tmp
chmod 555 install.sh
git add install.sh
git commit -m "update install.sh" .

