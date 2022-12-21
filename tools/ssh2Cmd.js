/* 
msfconsole中拷贝，生成sshIps.txt
cat sshIps.txt |awk '{print $1" "$5" "$6}'|xargs -I {} echo {}|xargs -n3 sh ./sshCmd.sh

cat /mysvn/22U_P.txt|sed 's/"//g'|awk -F ',' '{print $1" "$4" "$5}'|xargs -n3 sh ./tools/sshCmd.sh
cat sshCmd.sh
echo "$1"
node ../tools/ssh2Cmd.js --port 22 --host "$1" --username "$2" --password "$3" --cmd "netstat -antp"

# node ssh2Cmd.js --port 29156 --host 12.8.22.48 --username root --password '#$'

*/
var Client = require('ssh2').Client,
  fs = require('fs'),
  ci = require(__dirname + '/../commonlib/ci.js'),
  os = require('os'),
  child_process = require('child_process'),
  mypath = os.homedir() + '/mtx/db/',
  moment = require('moment'),
  ipInt = require('ip-to-int'),
  program = require('commander');
program.version("远程命令执行")
  .option('-p, --port [value]', '端口,默认 22')
  .option('-h, --host [value]', '访问主机的ip')
  .option('-f, --fileName [value]', 'ip信息文件，转化，获取其经纬度信息，格式：["ip1","ip2"]')
  .option('-u, --username [value]', '用户名, 默认：root')
  .option('-k, --key [value]', 'key,/root/.ssh/id_rsa')
  .option('-s, --password [value]', "密码")
  .option('-c, --cmd [value]', "命令")
  .parse(process.argv);
// 必须放在program后面
var mysql = null;

if(!program.cmd)
  mysql = require(__dirname + '/../myapp/lib/myMysql.js');

function fnErr(e)
{
  console.log(e);
}
process.on('uncaughtException', fnErr);
process.on('unhandledRejection', fnErr);

// ip转换为数字
// "16802816","16803071","JP","Japan","Shimane","Izumo","35.367000","132.767000"
function ipStringToLong(szIp)
{
    return ipInt(szIp).toInt();
}
// 文件存在判断
function isExists(t)
{
  return fs.existsSync( mypath+ t);
}

// 获得ip经纬度信息
function fnGetIpInfo(ip,fnCbk)
{
  mysql.fnGetIpInfo(ip,fnCbk);
}
var g_nCnt = 0;
// ip连接分析
function fnGetIps(s,myCurIp,fnCbk)
{
  var r = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gmi,a, oT = {},x = [];
  while(a = r.exec(s))
  {
    var szTT = a[1]+ "," + a[2];
    if( oT[szTT] || 
        -1 < szTT.indexOf('0.0.0.0') ||
        -1< szTT.indexOf('127.0.0.1') ||
        -1< a[2].indexOf('192.168') ||
        -1< a[2].indexOf('172.1') ||
        (myCurIp == a[1] && a[1] == a[2]))
      continue;
    oT[szTT] = 1;

    // console.log("start .. " + a[2]);
    //*
    fnGetIpInfo(a[2],function(o)
    {
      // console.log("start .. " + o.ip);
      if(o && o.ctj && "中国CN" != o.ctj)
        console.log("=========注意，发现了国外的ip=========");
      console.log([o.ip, o.ctj,o.ctq,o.city,o.loc1,o.loc2].join(", "));
      ++g_nCnt;
      if(g_nCnt >= x.length)
        mysql.fnEnd();
      if(fnCbk)fnCbk(o);
    });//*/
    
    x.push(a[2]);
  }
  if(fnCbk)fnCbk(null,x);
}

function fnMySsh(prm,fnCbk)
{
  var conn = new Client(),oConfig = {
    host: prm.host,
    port: prm.port || 22,
    username: prm.username || 'root'
    // ,privateKey: require('fs').readFileSync('/here/is/my/key')
  };
  if(prm.key)
  {
    oConfig.privateKey = fs.readFileSync(prm.key);
    // delete oConfig.username;
  }
  else oConfig.password = prm.password || "xxx123";
  conn.on('ready', function()
  {
    var a = [];
    conn.shell(function(err, stream) 
    {
      if (err) throw err;
      stream.on('close', function() 
      {
        var ss = a.join("");
        if(!prm.cmd)
          fnGetIps(ss,prm.host,fnCbk);
        else console.log(ss);
        conn.end();
      }).on('data', function(data)
      {
        a.push(data);
      }).stderr.on('data', function(data)
      {
        a.push(data);
      });
      stream.end((prm.cmd || 'netstat -antlp\n') + '\nhistory -c\nexit\n');
    });
  }).connect(oConfig);
}

function fnCvtIps(s)
{
  var a = "string" == typeof(s) && JSON.parse(fs.readFileSync(s)) || s,j = 0;
  for(var i = 0; i < a.length; i++)
  {
     fnGetIpInfo(a[i],function(o)
      {
        // console.log("start .. " + o.ip);
        if(o && o.ctj && "中国CN" != o.ctj)
          console.log("=========注意，发现了国外的ip=========");
        console.log([o.ip, o.ctj,o.ctq,o.city,o.loc1,o.loc2].join(", "));
        j++;
        
        if(j >= a.length)mysql.fnEnd();
        // if(fnCbk)fnCbk(o);
        // if("中国CN" != o.ctj)
      });//*/
  }
}

// ip信息查询
if(program && program.fileName)
  fnCvtIps(program.fileName);

var aR = [];
var fTmpCbk = function(x,a)
{
  if(x)aR.push(x);
  else
  {
    // if(0 == aR.length && a)aR = a;
    if(0 < aR.length)
      console.log(o.host + " 发现的ip数量:" + aR.length),
      console.log(aR),
      // appendFileSync
      fs.writeFileSync(sxPa + "/" + o.host,JSON.stringify(aR));
  }
};
if(program && program.host)
  fnMySsh(program,fTmpCbk);
else 
{
  var a = [
  ];
  var sxPa = __dirname + "/ips/" + moment(new Date().getTime()).format('YYYY-MM-DD');
  if (!fs.existsSync(sxPa))
    fs.mkdirSync(sxPa);
  if(0 < a.length)
  for(var k in a)
  {
    +function(o)
    {
      fnMySsh(o,fTmpCbk);
    }({host:a[k][2],username:a[k][0],password:a[k][1]});
  }
}

module.exports ={"fnCvtIps":fnCvtIps}

process.on('exit', (code) => 
{
  if(mysql)mysql.fnEnd();
});