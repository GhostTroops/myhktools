/*
node checkProxy.js >ok1.txt
sort -n -u ok1.txt 
mv autoProxy.txt autoProxy.txt.bak
cut -f 2 -d ',' ok1.txt >autoProxy.txt
node checkProxy.js 
*/
var request = require('request'), fs = require('fs'), async = require('async'),
	EventEmitter = require('events').EventEmitter,nMax = 333;


EventEmitter.prototype._maxListeners = nMax;
EventEmitter.defaultMaxListeners = nMax;

const emitter = new EventEmitter()
emitter.setMaxListeners(nMax)//指定一个最大监听数量
process.setMaxListeners(0);

function fnckip(ip)
{
	//console.log(ip);
	//return;
   var r = request.defaults({'proxy':'http://' + ip,timeout:5000,
		headers:{"User-Agent":'curl/7.54.0',"Accept":'Accept: */*'}
	}),nT = new Date().getTime();

   r.get('http://ip.cn/',function(e,r,b)
   {
	   	if(!e && b && 100 > b.toString().length)
	   	{
	   		var s = ip.replace(/:.*$/gmi,'');
	   		b = b.toString();
	   		if(-1 < b.indexOf(s))
	    		console.log(ip);// [new Date().getTime() - nT, ip].join(',')
	    }
   })
}

var a = fs.readFileSync('autoProxy.txtbak').toString().trim().split(/\n/);

async.mapLimit(a, 333,function(i,cbk)
{
	fnckip(i);
	cbk();
});