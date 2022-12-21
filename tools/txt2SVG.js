// 用于对抗爬虫
var TextToSVG = require('text-to-svg'),
	textToSVG = TextToSVG.loadSync('./bin/方正宋_人口信息字库32309.TTF'),
	args = process.argv.splice(2);
function fnT2Svg(s,fnCbk)
{
	svg = textToSVG.getSVG(s,{
		// x:0,y:0,
		anchor:'top',// 必须为top，否则显示不全
		fontSize:72,
		kerning:true,
		// letterSpacing:0,
		// anchor:'center'
	});
	if(fnCbk)fnCbk(svg);
}

fnT2Svg(args[0],function(s)
{
	console.log(s);
});

// test
// node txt2SVG.js '齫 齬 齭 齮 齯 齰 齱 齲 齳'>kkkk.svg