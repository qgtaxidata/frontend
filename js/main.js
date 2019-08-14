define(["require", "tools"], function (require) {

	let tools = require('tools');



	let sidebarClick = document.getElementsByClassName('sidebar-click')[0];
	let sidebar = document.getElementsByClassName('sidebar')[0];
	let onSidebar = "search";
	let sidebarClickJudge = true;
	let barRegList = sidebar.getElementsByClassName('bar-reg-list')[0];
	sidebarClick.onclick = function () {
		if (!sidebarClickJudge) {
			return;
		}
		if (sidebar.getAttribute('tle') == "hiden") {
			sidebar.style.height = "17.7rem";

			sidebar.setAttribute('tle',"show");
			setTimeout(function() {
				sidebar.style.overflow = "visible";
			}, 1000)
		} else {
			sidebar.style.height = "0rem";
			sidebar.style.overflow = "hidden";
			sidebar.setAttribute('tle',"hiden");
		}
		sidebarClickJudge = false;
		setTimeout(function() {
			sidebarClickJudge = true;
		}, 1000);
	}

	sidebar.onclick = function() {
		if (event.target != this && event.target.nodeName == "DIV") {
			sidebar.getElementsByClassName("on-sidebar")[0].classList.remove("on-sidebar");
			event.target.classList.add("on-sidebar");
			document.getElementsByClassName(onSidebar)[0].style.display = "none";
			onSidebar = event.target.getAttribute('tle');
			document.getElementsByClassName(onSidebar)[0].style.display = "block";
			if (event.target == barRegList.parentNode) {
				event.target.getElementsByTagName('ul')[0].style.height = "18.8rem"
			} else {
				sidebar.children[2].getElementsByTagName('ul')[0].style.height = "0";
			}
		} else if (event.target.nodeName == "LI") {
			let pre = barRegList.getElementsByClassName("on-region")[0];
			let now = event.target;
			if (pre == now) {
				return;
			}
			pre.classList.remove("on-region");
			now.classList.add("on-region");
		}
	formCon.style.display = "none";
	let regDataCon =  document.getElementsByClassName("region")[0].getElementsByClassName("data-container")[0];
	regDataCon.style.display = "none";

	}


	let formCon = document.getElementsByClassName("form-container")[0];
	let formClose = formCon.getElementsByClassName("form-close")[0];
	let formPre = formCon.getElementsByClassName("form-pre")[0];
	let formNext = formCon.getElementsByClassName("form-next")[0];
	let formList = formCon.getElementsByClassName("echartsCon");
	let onShow = 0;
	let changeJudge = true;

	formClose.onclick = function() {
		formCon.style.display = "none";
	}
    
    formNext.onclick = function() {
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
    formPre.onclick = function() {
    	if (!changeJudge) {
    		return;
    	}
    	changeJudge = false;
    	setTimeout(function() {
    		changeJudge = true;
    	}, 1500)
    	formList[onShow].classList.remove("onShow");
    	onShow = (onShow + 2) % 3;
    	formList[onShow].classList.add("onShow");
    }


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
	// 			text:'2',
	// 			subtext:'虚构的数据'
	// 		},
	// 		toolbox:{
	// 			show:true,
	// 			feature:{
	// 				dataView:{
	// 					show:true,
	// 					readOnly:false
	// 				},
	// 				magicType:{
	// 					show:true,
	// 					type:['line','bar']
	// 				},
	// 				restore:{
	// 					show:true
	// 				},
	// 				saveAsImage:{
	// 					show:true
	// 				}
	// 			}
	// 		},
	// 		legend:{						//图例配置
	// 			padding:5,
	// 			itemGap:10,
	// 			data:[
	// 				{name:'蒸发量',textStyle:{color:'green'}},
	// 				{name:'降水量'}]
	// 		},
	// 		tooltip:{						//提示框组件
	// 			trigger:'axis'
	// 		},
	// 		xAxis:[							//直角坐标系中X轴
	// 			{	
	// 				type:'category',//类目轴
	// 				data:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	// 			}
	// 		],
	// 		yAxis:[							//直角坐标系中Y轴
	// 			{
	// 				type:'value',//数值轴
	// 			}
	// 		],
	// 		series:[
	// 			{
	// 				name:'蒸发量',
	// 				type:'bar',
					
	// 				data:data.evaporation,
	// 				markPoint:{
	// 					data:[
	// 						{type:'max',name:'最大蒸发量'},
	// 						{type:'min',name:'最小蒸发量'}
	// 					]
	// 				},
	// 				markLine:{
	// 					data:[
	// 						{type:'average',name:'平均蒸发量'}
	// 					]
	// 				}
	// 			},
	// 			{
	// 				name:'降水量',
	// 				type:'bar',
					
	// 				data:data.precipitation,
	// 				markPoint:{
	// 					data:[
	// 						{type:'max',name:'最大降雨量'},
	// 						{type:'min',name:'最小降雨量'}
	// 					]
	// 				},
	// 				markLine:{
	// 					data:[
	// 						{type:'average',name:'平均蒸发量'}
	// 					]
	// 				}
	// 			}
	// 		]
	// 	};
	// secondChart.setOption(option2);


	// var thirdChart = echarts.init(formList[2]);
	// var option3 = {
	// 	title:{
	// 		text:'3',
	// 		left:'left'
	// 	},
	// 	toolbox:{
	// 		feature:{
	// 			dataView:{
	// 				show:true,
	// 				readonly:true
	// 			},
	// 			restore:{
	// 				show:true
	// 			},
	// 			saveAsImage:{
	// 				show:true
	// 			}
	// 		}
	// 	},
	// 	legend:{						
	// 		orient:'vertical',
	// 		left:'left',
	// 		top:'center',
	// 		data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
	// 	},
	// 	tooltip:{					
	// 		trigger:'item'
	// 	},
	// 	series:[
	// 	{
	// 		name:'访问来源',
	// 		type:'pie',
	// 		radius: "55%",
	// 		data:[
	// 		{name:'直接访问',value:100},
	// 		{name:'邮件营销',value:78},
	// 		{name:'联盟广告',value:234},
	// 		{name:'视频广告',value:324},
	// 		{name:'搜索引擎',value:789},
	// 		]
	// 	},
	// 	]
	// };
	// thirdChart.setOption(option3);
});