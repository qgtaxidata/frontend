let map = new AMap.Map("map-container", {
	resizeEnable: true,
	center: [113.31739, 23.209],
	zoom: 11
});


let serverUrl = "http://192.168.31.162:8080";

let timeDiffer = 79200000000;
let allTimeNow = new Date(Date.now() - timeDiffer);
let allTimeNowId = setInterval(function() {
	allTimeNow = new Date(Date.now() - timeDiffer);
}, 1000);

// 图表容器
let formCon = document.getElementsByClassName("form-container")[0];
let onShow = 0;
let changeJudge = true;
function formClose () {
	formCon.style.display = "none";
	onShow = 0;
}

function formNext() {
	let formList = formCon.getElementsByClassName("echartsCon");
	if (!changeJudge) {
		return;
	}
	changeJudge = false;
	setTimeout(function() {
		changeJudge = true;
	}, 1500)
	formList[onShow].classList.remove("onShow");
	onShow = (onShow + 1) % 3;
	formList[onShow].classList.add("onShow");
}
function formPre() {
	let formList = formCon.getElementsByClassName("echartsCon");
	if (!changeJudge) {
		return;
	}
	changeJudge = false;
	setTimeout(function() {
		changeJudge = true;
	}, 1500)
	console.log("执行之前的",onShow);
	formList[onShow].classList.remove("onShow");
	onShow = (onShow + 2) % 3;
	formList[onShow].classList.add("onShow");
}

require.config({
	baseUrl : "js",
    paths : {
    	"main" : "main",
		"search": "search",
		"heatmap": "heatmap",
		"region": "region",
		"route": "route",
        "tools": "tools",
        "set": "set"
    }
})

require(['main']);
require(['search']);
require(["heatmap"]);
require(["region"]);
require(["route"]);
require(['set']);





// let formList = formCon.getElementsByClassName("echartsCon");
// var firstChart = echarts.init(formList[0]);
// var option1 = {
// 	title:{
// 		text:'1',
// 	},
// 	tooltip:{
// 	},
// 	legend:{
// 		data:['猥琐度','颜值'],
// 	},
// 	xAxis:{
// 		data:['郑伟滨','曾华琛','余圣源','林旭','陈子锋']
// 	},
// 	yAxis:{
// 	},
// 	series:[
// 	{
// 		name:'猥琐度',
// 		type:'bar',
// 		data:[29,0,36,22,17]
// 	},
// 	{
// 		name:'颜值',
// 		type:'line',
// 		data:[-22,99,66,87,89]
// 	}
// 	]
// };
// firstChart.setOption(option1);

// var data = {
// 	evaporation:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
// 	precipitation:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
// }
// var secondChart = echarts.init(formList[1]);
// var option2 = {
// 	title:{
// 		text:'2',
// 		subtext:'虚构的数据'
// 	},
// 	toolbox:{
// 		show:true,
// 		feature:{
// 			dataView:{
// 				show:true,
// 				readOnly:false
// 			},
// 			magicType:{
// 				show:true,
// 				type:['line','bar']
// 			},
// 			restore:{
// 				show:true
// 			},
// 			saveAsImage:{
// 				show:true
// 			}
// 		}
// 	},
// 			legend:{						//图例配置
// 				padding:5,
// 				itemGap:10,
// 				data:[
// 				{name:'蒸发量',textStyle:{color:'green'}},
// 				{name:'降水量'}]
// 			},
// 			tooltip:{						//提示框组件
// 				trigger:'axis'
// 			},
// 			xAxis:[							//直角坐标系中X轴
// 			{	
// 					type:'category',//类目轴
// 					data:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
// 				}
// 				],
// 			yAxis:[							//直角坐标系中Y轴
// 			{
// 					type:'value',//数值轴
// 				}
// 				],
// 				series:[
// 				{
// 					name:'蒸发量',
// 					type:'bar',
					
// 					data:data.evaporation,
// 					markPoint:{
// 						data:[
// 						{type:'max',name:'最大蒸发量'},
// 						{type:'min',name:'最小蒸发量'}
// 						]
// 					},
// 					markLine:{
// 						data:[
// 						{type:'average',name:'平均蒸发量'}
// 						]
// 					}
// 				},
// 				{
// 					name:'降水量',
// 					type:'bar',
					
// 					data:data.precipitation,
// 					markPoint:{
// 						data:[
// 						{type:'max',name:'最大降雨量'},
// 						{type:'min',name:'最小降雨量'}
// 						]
// 					},
// 					markLine:{
// 						data:[
// 						{type:'average',name:'平均蒸发量'}
// 						]
// 					}
// 				}
// 				]
// 			};
// 			secondChart.setOption(option2);


// 			var thirdChart = echarts.init(formList[2]);
// 			var option3 = {
// 				title:{
// 					text:'3',
// 					left:'left'
// 				},
// 				toolbox:{
// 					feature:{
// 						dataView:{
// 							show:true,
// 							readonly:true
// 						},
// 						restore:{
// 							show:true
// 						},
// 						saveAsImage:{
// 							show:true
// 						}
// 					}
// 				},
// 				legend:{						
// 					orient:'vertical',
// 					left:'left',
// 					top:'center',
// 					data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
// 				},
// 				tooltip:{					
// 					trigger:'item'
// 				},
// 				series:[
// 				{
// 					name:'访问来源',
// 					type:'pie',
// 					radius: "55%",
// 					data:[
// 					{name:'直接访问',value:100},
// 					{name:'邮件营销',value:78},
// 					{name:'联盟广告',value:234},
// 					{name:'视频广告',value:324},
// 					{name:'搜索引擎',value:789},
// 					]
// 				},
// 				]
// 			};
// 			thirdChart.setOption(option3);