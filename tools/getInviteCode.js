// get hackthebox Invite code
// 2017-07-31 hktalent Tianxia 11602011
/*
1、first
https://www.hackthebox.eu/js/inviteapi.min.js
2、use 压缩.hta 
3、..
//////////////*/

var request = require("request");

var s = "https://www.hackthebox.eu/en/invite";

// https://www.hackthebox.eu/api/invite/how/to/generate
request.post({uri:"https://www.hackthebox.eu/api/invite/generate",headers:
	{
		"referer":"https://www.hackthebox.eu/en/invite",
		"origin":"https://www.hackthebox.eu"
	}},function(e,r,b)
{
	var o = JSON.parse(b);
	var s =  Buffer.from(o.data.code, 'base64');
	console.log(s.toString());
})