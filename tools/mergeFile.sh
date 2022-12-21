#!/bin/bash
# N * N合并，用户 * 密码 遍历
# ~/safe/myhktools/tools/mergeFile.sh  文档整理/登录安全/yinhai_real_username.txt 文档整理/登录安全/yinhai_real_pass.txt "\t\t\t"
file1=(`cat $1 |xargs|grep -v "^\s*$"`)
file2=(`cat $2 |xargs|grep -v "^\s*$"`)
i=${#file1[@]}
s=$3
if [ "$s" = "" ]; then
	s="\t"
fi

until [ $i -lt 1 ]; do
	let i-=1
	j=${#file2[@]}
	key1=`echo ${file1[$i]}|xargs`

	if [ "$key1" = "" ]; then
		continue
	fi
	until [ $j -lt 1 ]; do
		let j-=1
		key2=`echo ${file2[$j]}|xargs`
		if [ "$key2" = "" ]; then
			continue
		fi
		echo $key1"${s}"$key2
	done
done
