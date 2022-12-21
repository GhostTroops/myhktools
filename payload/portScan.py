#!/usr/bin/env python
#-*-coding:utf8;-*-
import socket
import subprocess
import sys
import threading
from datetime import datetime

# Clear the screen
subprocess.call('clear', shell=True)

# Ask for input
remoteServer    = raw_input("Enter a remote host to scan: ")
remoteServerIP  = socket.gethostbyname(remoteServer)
timeout = 0.5

print "-" * 60
print "Please wait, scanning remote host", remoteServerIP
print "-" * 60

t1 = datetime.now()

# AF_INET Address Family version 4 or IPv4
# SOCK_STREAM tcp
# SOCK_DGRAM udp

def checkConn1(remoteServerIP,port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        result = sock.connect_ex((remoteServerIP, port))
        if result == 0:
            print "Port {}:      Open".format(port)
        sock.close()
    except KeyboardInterrupt:
        print "You pressed Ctrl+C"
        sys.exit()

    except socket.gaierror:
        print 'Hostname could not be resolved. Exiting'
        sys.exit()

    except socket.error:
        print "Couldn't connect to server"
        sys.exit()

def checkConn(remoteServerIP):
    try:
        for port in range(1,65535): 
            t = threading.Thread(target=checkConn1,kwargs={'remoteServerIP':remoteServerIP,'port':port})
            t.start() 

    except KeyboardInterrupt:
        print "You pressed Ctrl+C"
        sys.exit()

checkConn(remoteServerIP)
# Checking the time again
t2 = datetime.now()

# Calculates the difference of time, to see how long it took to run the script
total =  t2 - t1

# Printing the information to screen
print 'Scanning Completed in: ', total