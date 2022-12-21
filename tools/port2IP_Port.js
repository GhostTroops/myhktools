var net = require('net'),
	program = require('commander');
	

program.version("MTX_port2IpPort_1.0 2017-09-22")
	.option('-p, --port [value]', '接受数据的端口,默认为80',parseInt)
	.option('-t, --toPort [value]', '将数据转到该端口，默认8080',parseInt)
	.option('-i, --ip [value]', '数据转到的ip,可以是外网、内网的ip,默认是127.0.0.1')
	.option('-v, --verbose', '显示日志')
	.option('-u, --unZip', 'http转发时间Accept-Encoding:.*?\\n替换掉，这样返回的数据就不是压缩的了')
	.option('-o, --timeoutOut [value]', 'default 3000毫秒')
	.description("说明：将本地http端口8080转向118.112.188.108的8080,例子：\nnode port2IP_Port.js  -p 8080 -v -t 8070 -i 118.112.188.108")
	// .usage("node port2IP_Port.js  -p 8080 -v -t 8070 -i 118.112.188.108")
	.parse(process.argv);

var timeout = program.timeoutOut || 3000, 
	portS = program.port || 80,
	portD = program.toPort || 8080,
	ip = program.ip || '127.0.0.1',
	verbose = program.verbose || false,
	bunZip = program.unZip || false;


function start()
{
	var server = net.createServer(function (socket)
	{
    	socket.on('data', function (msg) 
    	{
    		if(verbose)console.log(ip,':', portS);
    		if(bunZip)
    		{
    			msg = new Buffer(msg.toString().replace(/Accept-Encoding:.*?\n/gmi,""));
    		}
    		
	        if(verbose)console.log(msg.toString());
	        var serviceSocket = new net.Socket();
	        serviceSocket.connect(parseInt(portD), ip, function () 
	        {
	            serviceSocket.write(msg);
	        });
	        serviceSocket.on("data", function (data) 
	        {
	            if(verbose)
	            {
	            	var s = data.toString();
	            	if(-1 < s.indexOf("Content-Type:") && -1 == s.indexOf("Content-Type: text/"))
	            	{
	            		s = s.substr(0, s.indexOf("\r\n\r\n")) + "\r\n\r\n...."
	            	}
	            	console.log(s);
	            }
	            socket.write(data);
		    });
	    });
	    
	});
	server.on("error",function(e)
	{
		if(verbose)console.log(e);
	});

	server.listen({port:portS,host:"0.0.0.0",exclusive:true});
}

process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.defaultMaxListeners = 0
process.env.NODE_ENV = "production";
start();