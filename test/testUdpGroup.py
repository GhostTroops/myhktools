#!/usr/bin/python
# -*- coding:utf-8 -*-
import threading, sys, os, socket, time, struct, select

class R():
    def __init__(self):
        pass
    @staticmethod
    def exit():
        os.system("kill -9 " + str(os.getpid())) #杀掉进程

class MulticastServer(threading.Thread):
    def __init__(self, addr, groupaddr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        mreq = struct.pack("=4sl", socket.inet_aton(groupaddr), socket.INADDR_ANY)
        sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)
        sock.bind(addr)
        self.sock = sock
        self.groupaddr = groupaddr
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "MulticastServer recv data: ", data, "client: ", client
                    sock.sendto("MulticastServer" + str(i), client)
                    i += 1
            except:
                break

class MulticastClient(threading.Thread):
    def __init__(self, addr, destaddr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        self.sock = sock
        self.destaddr = destaddr
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                sock.sendto("MulticastClient" + str(i), self.destaddr)
                i += 1
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "MulticastClient recv data: ", data, "client: ", client
                time.sleep(0.5)
            except:
                break

class BroadcastServer(threading.Thread):
    def __init__(self, addr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        self.sock = sock
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "BroadcastServer recv data: ", data, "client: ", client
                    sock.sendto("BroadcastServer" + str(i), client)
                    i += 1
            except:
                break

class BroadcastClient(threading.Thread):
    def __init__(self, addr, destaddr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        self.sock = sock
        self.destaddr = destaddr
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                sock.sendto("BroadcastClient" + str(i), self.destaddr)
                i += 1
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "BroadcastClient recv data: ", data, "client: ", client
                time.sleep(0.5)
            except:
                break

class UnicastServer(threading.Thread):
    def __init__(self, addr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        self.sock = sock
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "UnicastServer recv data: ", data, "client: ", client
                    sock.sendto("UnicastServer" + str(i), client)
                    i += 1
            except:
                break

class UnicastClient(threading.Thread):
    def __init__(self, addr, destaddr):
        threading.Thread.__init__(self)
        self.addr = addr
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(addr)
        self.sock = sock
        self.destaddr = destaddr
        self.r = 1
    def run(self):
        sock = self.sock
        packSize = 1024
        i = 0
        while(self.r):
            try:
                sock.sendto("UnicastClient" + str(i), self.destaddr)
                i += 1
                infds, outfds, errfds = select.select([sock,],[],[],5)
                if len(infds) > 0:
                    data, client = sock.recvfrom(packSize)
                    print "UnicastClient recv data: ", data, "client: ", client
                time.sleep(0.5)
            except:
                break

def main(argv):
    try:
        mserver = MulticastServer(("0.0.0.0", 10010), "224.0.1.255")
        mserver.start()
        mclient = MulticastClient(("0.0.0.0", 10011), ("224.0.1.255", 10010))
        mclient.start()
        bserver = BroadcastServer(("0.0.0.0", 10012))
        bserver.start()
        bclient = BroadcastClient(("0.0.0.0", 10013), ("255.255.255.255", 10012))
        bclient.start()
        userver = UnicastServer(("0.0.0.0", 10014))
        userver.start()
        uclient = UnicastClient(("0.0.0.0", 10015), ("127.0.0.1", 10012))
        uclient.start()
        uclient2 = UnicastClient(("0.0.0.0", 10017), ("127.0.0.1", 10014))
        uclient2.start()
    except:
        R.exit()
    while 1:
        try:
            time.sleep(1000)
        except:
            R.exit()

if __name__ == "__main__":
    main(sys.argv)