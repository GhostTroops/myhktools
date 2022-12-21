// 各种解码 xiatian 2017-03-30
var Entities = require('html-entities'),AE = new Entities.AllHtmlEntities(),
    xmlEt = new Entities.XmlEntities(),Html4Entities = new Entities.Html4Entities(),
    jsQR = require("jsqr")
    ;

// QRCode 解码
function decodeQRCode(s)
{
	try{
		var decoded = jsQR.decodeQRFromImage(s, 300, 300);
		return decoded;
	}catch(e){return null;}
}

// base64解码
function fnBase64(s)
{
	 var b = new Buffer(s, 'base64'), s1 = b.toString('utf8');
	 if(s1.length < s.length / 3)s1 = s;
	 return s1;
}

// unzip
function fnUnzipFromBase64(s)
{
	var o = new require('node-zip')(s, {base64: true, checkCRC32: true});
	// console.log();
	return o.toString("UTF-8");
}
/*
function fnUnzip(s)
{
	const zlib = require('zlib');
	const buffer = Buffer.from(s, 'base64');
	zlib.unzip(buffer, (err, buffer) => {
	  if (!err) 
	  {
	    console.log(buffer.toString());
	  } else {
	    // handle error
	  }
	});
}////////////*/

// 16进制解码
function fnHex(s)
{
	 var b = new Buffer(s, 'hex');
	 return b.toString('utf8');
}

// html解码
function decodeHtml(s)
{
	var a = [AE,xmlEt,Html4Entities];
	for(var k in a)
	{
		try{
			s = a[k].decode(s);
		}catch(e){}
	}
	return s;
}

// js解码
function decodeJsU(s)
{
	return s.replace(/\\u([0-9a-fA-F]{4})/gmi,function(a,b)
	{
		return String.fromCharCode(parseInt(b,16));
	});
}

// url解码
function decodeUrl(s)
{
	return s.replace(/%([0-9a-fA-F]{2})/gmi,function(a,b)
	{
		return String.fromCharCode(parseInt(b,16));
	});
}

// console.log(fnHex('9bed67ade8f04951b1d4cd43dfa0d2f2').toString("16"));

// 解码统一入口： 自动各种解码，可以多次调用
function mtxDecode(s,fncbk)
{
	// ,QrCode.deCodeQrCode
	var a = [decodeURI,decodeJsU,decodeUrl,fnHex,fnUnzipFromBase64,fnBase64,decodeHtml,fnUnzipFromBase64,decodeURI];
	var szOld = s,szO2;
	for(var k in a)
	{
		szO2 = s;
		try
		{
			s = a[k](s);
			console.log(s);
			// console.log(a[k](szOld));
			if(!s)s = szO2;
		}catch(e){s = szO2;
			// console.log(k); console.log(e);
		}
	}
	if(fncbk)fncbk(s);
}
module.exports = {"mtxDecode":mtxDecode};
//*
if(process.argv)
{
	var a = process.argv.splice(2);
	if(a && 0 < a.length)
	mtxDecode(a[0],
		function(s)
	{
		mtxDecode(s,
		function(s)
		{
			console.log(s);
		});
		console.log(s);
	});
}//*/
