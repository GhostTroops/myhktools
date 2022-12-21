/*
npm install gps-util exif -g
$node getFileMetadata.js /Users/Downloads/tlfb.jpg
{
 "fileName": "/Users/Downloads/tlfb.jpg",
 "createTime": "2016-10-11 00:49:00",
 "GPSLatitude": 54.318917000000006,
 "GPSLongitude": -4.376291000073051,
 "address": "Queen's Promenade, Ramsey, Isle of Man"
}
*/
var a = process.argv.splice(2),
  fs = require("fs"),
  md5File = require('md5-file'),
  request = require("request"),
	gpsUtil = require("gps-util"),
  exif = require("exif").ExifImage;

function fmt(d)
{
   return require('moment')(d).format('YYYY-MM-DD HH:mm:ss');
}
var aGpsO = {};

// 通过经纬度获得地址
function fnGetAddrFromGps(GPSLatitude,GPSLongitude,fnCbk)
{
  request.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="
   + GPSLatitude + ","
   + GPSLongitude + "&sensor=false",function(e,r)
  {
    if(!e)
    {
      var oR = JSON.parse(r.body);
      if("OK" == oR.status)
      {
         if(oR.results && oR.results.length)
         {
            fnCbk(oR.results[0].formatted_address,oR);
         }
      }// console.log(r.body);
    }
  });
}
// 拷贝一些属性
function fnMyCopy(s, aS, aD)
{
  var a = s.split(/[,;\s]/);
  for(var i = 0; i < a.length; i++)
  {
    if(aS[a[i]])aD[a[i]] = aS[a[i]];
  }
}

// 获得图片metadata
function getFileMetaDataInfo()
{
  // 获取图片的经纬度信息
  new exif({image:a[0]},function(e,d)
  {
    if(d && d.image)
    {
      fnMyCopy("Make,Software,ModifyDate", d.image,aGpsO);
    }
    if(d.exif)
    {
      fnMyCopy("CreateDate,DateTimeOriginal", d.exif,aGpsO);
    }
    fs.stat(a[0],function(e,stats)
    {
      // GPSLatitudeRef：S 南方；N北方 GPSLongitudeRef：W 西方 E 东方
      aGpsO.fileName = a[0];
      if(stats && stats.birthtime)aGpsO.createTime = fmt(stats.birthtime);
      if(d && d.gps && d.gps.GPSLatitude && d.gps.GPSLongitude)
      {
        // console.log(d.gps);
        var aK = d.gps.GPSLatitude, aK2 = d.gps.GPSLongitude,
            aGps = [aK[0] + aK[1] / 60 + aK[2] / 3600, aK2[0] + aK2[1] / 60 + aK2[2] / 3600]
        if('S' == d.gps.GPSLatitudeRef)aGps[0] = 0 - aGps[0];
        if('W' == d.gps.GPSLongitudeRef)aGps[1] = 0 - aGps[1];
        aGpsO.GPSLatitude = aGps[0];
        aGpsO.GPSLongitude = aGps[1];
      }
      fnGetAddrFromGps(aGpsO.GPSLatitude,aGpsO.GPSLongitude,function(r)
      {
        aGpsO.address = r;
      });
    });
  });
}

md5File(a[0],function(e,r)
{
  if(!e)
  {
    aGpsO.md5 = r;
    var s = '';
    if(fs.existsSync(s = "db/" + r))
    {
      var k = fs.readFileSync(s);
      aGpsO = JSON.parse(k);
      // console.log("读取历史");
      return;
    }
    getFileMetaDataInfo();
  }
});

process.on('exit', (code) => 
{
  var s = '';
  console.log(s = JSON.stringify(aGpsO,null,' '));
  fs.writeFileSync("db/" + aGpsO.md5, s);
});