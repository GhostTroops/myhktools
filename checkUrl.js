#!/usr/bin/env node
// (function () {
//   var oldCall = Function.prototype.call;
//   var newCall = function(self) {
//     Function.prototype.call = oldCall;
    
//     var args = Array.prototype.slice.call(arguments, 1);
//     var res = this.apply(self, args);
//     console.log('Function called:', this.name);
//     Function.prototype.call = newCall;
//     return res
//   }
//   Function.prototype.call = newCall;
// })();

var kkk = require('./lib/core_new.js');
var r = new kkk(),colors = require('colors');
var fnTTTTT = console.log;
console.log = function(s){
	if(!/(错误页|404\-\-Not Found|<\/body>)/g.test(String(s)))
		fnTTTTT(s);
	// throw "x";
	// console.trace();
}
// -v 参数才会输出
r.on('log',function(s)
{
	if(s)console.log(s);
});
r.on('info',function(s)
{
	if(s)console.log(s);
});
r.on('jspShell',function(s)
{
	if(s)console.log(s);
});

r.on('error',function(s,t,o)
{
	if(s)
	{
		s = String(s.stdout||s.stderr||s);
		if(-1 == s.indexOf("ESOCKETTIMEDOUT") && -1 == s.indexOf("ETIMEDOUT"))
			console.log('=================='),console.log(s);
		else return;
	}
	if(-1 < s.indexOf('ping -c 1'))
	{
		r.g_szError += o.url + "\n";
		r.fs.writeFileSync(r.szErrorPath, r.g_szError);
		return;
	}
	if(o && o.url)console.log(o.url);
	console.log('==================');
});
r.on('vulinfo',function(s)
{
	console.log(s.red);
});
// 发现安全问题才会进入这里
r.on('vul',function(v,t,s)
{
	if(r.program.verbose && v && v.vul)console.log(v);
});

r.on('ready',function()
{
	
	// console.log('准备好了....');
	r.runChecks();
	// cXss.fnDoCheckUrl(r.url);
});
// r.fnInit();
// r.fnMkPayload();
// process.on('SIGUSR1', function(){   console.trace()   });