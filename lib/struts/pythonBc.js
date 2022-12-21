
module.exports={
	tags:"struts2,python",
	des:"struts2 python脚本Vulnerability detection补充",
	dependencies:"python,struts-scan.py",
	VulApps:[],
	urls:[],
	doCheck:function (url,fnCbk)
	{
		if(!url || -1 < url.indexOf(";"))return fnCbk({},this);

		var _t = this,_s = this.self,oRst={},strCmd = "python '" + __dirname + "/../../py/struts-scan.py' '" + url + "' | grep '目标存在'";
		var s = '';//_s.child_process.execSync(strCmd,{cwd: __dirname,shell:'/bin/bash'});
		if(s)
			oRst = {"url":url,vul:true,des:s.toString()};
		fnCbk(oRst,_t);
	}
};