module.exports={
	tags:"report",// 报告处理插件
	doCheck:function(o,_t)
	{
		if(!o)return;
		_t || (_t = {});
		var _s = this.self;
		if(_t.ID)o.ID = _t.ID;
		// console.log("======");
		// console.log(_t.tags);
		// delete o.send;
		// delete o.body;
		// console.log(o);
		if(!o.body)delete o.body;
		// _s.log(o);
		// console.log("======");
		if(_s.g_socketIO && o)
		{
			// 发送消息
			_s.g_socketIO.emit("url",o,_t);
		}
		// -v 参数才会在控制台输出
		if(o && o.vul)
		{
			// console.log(_t.tags);
			delete o.send;
			delete o.body;
			var sFn = _s.rstPath + '/' + _s.md5(_s.url) + ".txt";
			o.tags = _t.tags;
			o.srcUrl = _s.url;
			o.date = _s.moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
			_s.vulinfo(JSON.stringify(o,null,' '));
			// 合并结果，便于记录多个高危漏洞
			if(_s.fs.existsSync(sFn))
			{
				try{
					var oT = JSON.parse(_s.fs.readFileSync(sFn).toString());
					for(var k in oT)
					{
						o[k] = oT[k];
					}
				}catch(e){}
			}
			_s.fs.writeFileSync(sFn, JSON.stringify(o,null,' '));
			
			// console.log([_t.tags,o.url]);
			// console.log(_t);
		}
		_s.g_oForm[_s.url + _t.tags] = 1;
		_s.emit('vul',o,_t,_s);
		if(_s.program.cmd)_s.log(o.body);
	}
};