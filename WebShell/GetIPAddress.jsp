<%@ page contentType="text/xml; charset=UTF-8" %>
<?xml version="1.0" encoding="utf-8"?>
<systemdata clientIP='<%=request.getRemoteHost()%>'
			sessionid='<%=request.getSession().getId()%>'
			contextRealPath='<%=pageContext.getServletContext().getRealPath("/")%>'
			requestURL='<%=request.getRequestURL()%>'
			requestURI='<%=request.getRequestURI()%>'/>