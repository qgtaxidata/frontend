define(["require", "tools"], function (require) {

  	let tools = require('tools');  
    
    // 区域分析的二级导航栏
  	let barRegList = document.getElementsByClassName('bar-reg-list')[0];
  	// 区域分析容器
  	let con = document.getElementsByClassName('region')[0]; 
  	
  	// 地区选择容器
  	let regCon = con.getElementsByClassName('region-choice')[0];
  	// 选择的地区
 	let regValue = regCon.getElementsByClassName('region-value')[0];
 	// 区域列表下拉和上拉
 	let regChoice = regCon.getElementsByTagName('img');
 	// 选择地区列表
 	let regList = regCon.getElementsByTagName('ul')[0];
 	
 	// 日期选择容器
  	let dateCon = con.getElementsByClassName('date-choice')[0];
  	// 选择的日期
 	let dateValue = dateCon.getElementsByClassName('date-value')[0];
 	// 日期列表下拉和上拉
 	let dateChoice = dateCon.getElementsByTagName('img');
 	// 选择日期列表
 	let dateList = dateCon.getElementsByTagName('ul')[0];


  	
  	regChoice[0].onclick = function() {

  			regChoice[0].style.display = "none";
  			regChoice[1].style.display = "block";
  			regList.setAttribute('style', "height: 15rem;padding-top: 1.5rem");
  	}
  	regChoice[1].onclick = function() {
  			regChoice[1].style.display = "none";
  			regChoice[0].style.display = "block";
  			regList.setAttribute('style', "height: 0;");
  	}
	regList.onclick = function() {
  		if (event.target && event.target.nodeName == "LI") {
  			regValue.value = event.target.innerText;
  			regValue.setAttribute('tle', event.target.getAttribute('tle'));
  			regChoice[1].onclick();
  			changeView(regValue.value);
  		}
  	}

    dateValue.value = `2017-02-03`;
    for (let i = 3; i < 24; i++) {
    	dateList.innerHTML += `<li tle='${i}'>2017-02-${i<10?("0"+i):i}</li>`;
    }
  	dateChoice[0].onclick = function() {
  		dateChoice[0].style.display = "none";
  		dateChoice[1].style.display = "block";
  		dateList.setAttribute('style', "height: 15rem;padding-top: 1.5rem");
  	}
  	dateChoice[1].onclick = function() {
  		dateChoice[1].style.display = "none";
  		dateChoice[0].style.display = "block";
  		dateList.setAttribute('style', "height: 0;");
  	}
  	dateList.onclick = function() {
  		if (event.target && event.target.nodeName == "LI") {
  			dateValue.value = event.target.innerText;
  			dateChoice[1].onclick();
  		}
  	}
    


  	let dataCon = con.getElementsByClassName("data-container")[0];
  	let refresh = con.getElementsByClassName('refresh')[0];
  	let sendClickJudge = true; 
    // 收入排行榜
    refresh.onclick = function() {
    	let onRegion = barRegList.getElementsByClassName("on-region")[0] || null;
    	if (onRegion) {
    		console.log(onRegion.innerText);
    		onRegion.onclick();
    	}
    }
    barRegList.children[0].onclick = function() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);
    	let area = regValue.getAttribute("tle");
    	let date = dateValue.value
    	let send = {
    		area: area,
    		date: date
    	}
    	console.log("司机排行榜sand",send);
    	$.ajax({
    		"url":  serverUrl + "/rank/getRank",
    		"method": "GET",
    		"headers": {
    			"Content-Type": "application/json"
    		},
    		"data": send,
    		"dataType": "json",
    		"async": true,
    		"crossDomain": true,
    		"success": function(data) {
    			console.log(data.data);
    			createDriver(data.data, area, date);
    		}
    	})
    	// var data = [{
    	// 	rank: 1,
    	// 	driverID: "'00045034",
    	// 	income: "234565"},
    	// 	];
    	// createDriver(data, area, date);
    }
    function createDriver(data, area, date) {
    	dataCon.style.display = "block";
    	dataCon.innerHTML = ""
    	dataCon.innerHTML +=   `<div class="item-name">
				                	<span style="width: 4rem">排名</span>
				                	<span style="width: 6rem">司机编号</span>
				                	<span style="width: 4rem">收入</span>
				            	</div>
				            		<ul class="data" style="overflow-x: hidden; max-height: 20rem">
				            	</ul>`;
	    let list = dataCon.getElementsByClassName("data")[0];
    	for (let i = 0; i < data.length; i++) {
    		list.innerHTML +=   `<li clk="show" area="${area}" date="${date}"> 
                    				<span style="width: 4rem">${data[i].rank}</span>
                    				<span style="width: 6rem">${data[i].driverID}</span>
                    				<span style="width: 4rem">${data[i].income}</span>
                				</li>`
    	}
    	console.log(list.children.length);
    	for (let i = 0; i < list.children.length; i++) {
    		console.log(list.children[i])
    		list.children[i].onclick = getDriver;
    	}
    }
    function getDriver() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);

    	if (event.target.getAttribute("clk") == "show") {
    		var list = event.target;
    	} else if(event.target.parentNode.getAttribute("clk") == "show") {
    		var list = event.target.parentNode;
    	} else {
    		return;
    	}
    	let area = list.getAttribute('area');
    	let date = list.getAttribute('date');
    	let rank = list.children[0].innerText;
    	let driverID = list.children[1].innerText;
    	let income = list.children[2].innerText;
    	let send = {
    		area: area,
    		date: date,
    		driverID: driverID
    	};
    	console.log("司机具体信息sand", send);
        $.ajax({
    		"url":  serverUrl + "/rank/getSituation",
    		"method": "GET",
    		"headers": {
    			"Content-Type": "application/json"
    		},
    		"data": send,
    		"dataType": "json",
    		"async": true,
    		"crossDomain": true,
    		"success": function(data) {
    			console.log(data.data);
    			showDriver(data.data, rank, driverID, income)
    		}
    	})


  //   	let data = {
		// 	'companyID': '0200014479',  //公司编号
		// 	'load_mile': 378.51,  // 载客里程(公里)
		// 	'load_time': 703.28,  //载客司机(分钟)
		// 	'no_load_mile': 57.26,  // 空载里程
		// 	'no_load_time': 1005.67 // 空载时间
		// }
		// showDriver(data, rank, driverID, income)
 
    	
    }
    function showDriver(data, rank, driverID, income) {
    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = "";
    	formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" onclick="formClose()">
    						  <div class="echartsCon onShow">
    						      <img src="./images/driver.png">
				                  <div class="driverID">${driverID}</div>
				                  <div>
						              <span>公司编号</span>
						              <span class="value">${data.companyID || ""}</span>
						          </div>
						          <div>
				                      <span>收入金额</span>
				                      <span class="value">${income} 元</span>
				                  </div> 
				                  <div>
				                      <span>收入排名</span>
				                      <span class="value">第 ${rank} 名</span>
				                  </div>
					              <div>
						              <span>运营里程</span>
						              <span class="value">${(data.load_mile?(data.load_mile+" 公里"):"")}</span>
						          </div>
						          <div>
						              <span>运营时长</span>
						              <span class="value">${(data.load_time?(data.load_time+" 分钟"):"")}</span>
						          </div>
						          <div>
						              <span>空车里程</span>
						              <span class="value">${(data.no_load_mile?(data.no_load_mile+" 公里"):"")}</span>
						          </div>
						          <div>
						              <span>空车时长</span>
						              <span class="value">${(data.no_load_time?(data.no_load_time+" 分钟"):"")}</span>
						          </div>
					          </div>`
						          
	}

    // 出租车收入分析和预测
    barRegList.children[1].onclick = function() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);

    	dataCon.style.display = "none";
    	console.log("出租车收入分析和预测");
    }
    // 区域道路质量分析
    barRegList.children[2].onclick = function() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);

    	dataCon.style.display = "none";
    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = ""
    	formCon.innerHTML +=   `<img title="关闭" class="form-close" src="./images/关闭.png" onclick="formClose()">
						        <img class="form-pre" src="./images/上一个.png"onclick="formPre()">
						        <img class="form-next" src="./images/下一个.png" onclick="formNext()">
						        <div class="echartsCon onShow"></div>
						        <div class="echartsCon"></div>
						        <div class="echartsCon"></div>`;
    	let formList = formCon.getElementsByClassName("echartsCon");
    	onShow = 0;
    	console.log("重置过后的的",onShow);
    	var firstChart = echarts.init(formList[2]);
    	var option1 = {
    		title:{
    			text:'1',
    		},
    		tooltip:{
    		},
    		legend:{
    			data:['猥琐度','颜值'],
    		},
    		xAxis:{
    			data:['郑伟滨','曾华琛','余圣源','林旭','陈子锋']
    		},
    		yAxis:{
    		},
    		series:[
    		{
    			name:'猥琐度',
    			type:'bar',
    			data:[29,0,36,22,17]
    		},
    		{
    			name:'颜值',
    			type:'line',
    			data:[-22,99,66,87,89]
    		}
    		]
    	};
    	firstChart.setOption(option1);

    	var data = {
    		evaporation:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    		precipitation:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    	}
    	var secondChart = echarts.init(formList[0]);
    	var option2 = {
    		title:{
    			text:'2',
    			subtext:'虚构的数据'
    		},
    		toolbox:{
    			show:true,
    			feature:{
    				dataView:{
    					show:true,
    					readOnly:false
    				},
    				magicType:{
    					show:true,
    					type:['line','bar']
    				},
    				restore:{
    					show:true
    				},
    				saveAsImage:{
    					show:true
    				}
    			}
    		},
    		legend:{						
    			padding:5,
    			itemGap:10,
    			data:[
    			{name:'蒸发量',textStyle:{color:'green'}},
    			{name:'降水量'}]
    		},
    		tooltip:{						
    			trigger:'axis'
    		},
    		xAxis:[						
    		{	
    			type:'category',
    			data:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    		}
    		],
    		yAxis:[							
    		{
    			type:'value',
    		}
    		],
    		series:[
    		{
    			name:'蒸发量',
    			type:'bar',

    			data:data.evaporation,
    			markPoint:{
    				data:[
    				{type:'max',name:'最大蒸发量'},
    				{type:'min',name:'最小蒸发量'}
    				]
    			},
    			markLine:{
    				data:[
    				{type:'average',name:'平均蒸发量'}
    				]
    			}
    		},
    		{
    			name:'降水量',
    			type:'bar',

    			data:data.precipitation,
    			markPoint:{
    				data:[
    				{type:'max',name:'最大降雨量'},
    				{type:'min',name:'最小降雨量'}
    				]
    			},
    			markLine:{
    				data:[
    				{type:'average',name:'平均蒸发量'}
    				]
    			}
    		}
    		]
    	};
    	secondChart.setOption(option2);

    	var thirdChart = echarts.init(formList[1]);
    	var option3 = {
    		title:{
    			text:'3',
    			left:'left'
    		},
    		toolbox:{
    			feature:{
    				dataView:{
    					show:true,
    					readonly:true
    				},
    				restore:{
    					show:true
    				},
    				saveAsImage:{
    					show:true
    				}
    			}
    		},
    		legend:{						
    			orient:'vertical',
    			left:'left',
    			top:'center',
    			data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    		},
    		tooltip:{					
    			trigger:'item'
    		},
    		series:[
    		{
    			name:'访问来源',
    			type:'pie',
    			radius: "55%",
    			data:[
    			{name:'直接访问',value:100},
    			{name:'邮件营销',value:78},
    			{name:'联盟广告',value:234},
    			{name:'视频广告',value:324},
    			{name:'搜索引擎',value:789},
    			]
    		},
    		]
    	};
    	thirdChart.setOption(option3);
    }
    // 车辆利用率
    barRegList.children[3].onclick = function() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);

    	dataCon.style.display = "none";
    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = ""
    	formCon.innerHTML +=   `<img title="关闭" class="form-close" src="./images/关闭.png" onclick="formClose()">
						        <img class="form-pre" src="./images/上一个.png"onclick="formPre()">
						        <img class="form-next" src="./images/下一个.png" onclick="formNext()">
						        <div class="echartsCon onShow"></div>
						        <div class="echartsCon"></div>
						        <div class="echartsCon"></div>`;

    	let formList = formCon.getElementsByClassName("echartsCon"); 
    	onShow = 0;
    	console.log("重置过后的的",onShow);
    	var firstChart = echarts.init(formList[0]);
    	var option1 = {
    		title:{
    			text:'1',
    		},
    		tooltip:{
    		},
    		legend:{
    			data:['猥琐度','颜值'],
    		},
    		xAxis:{
    			data:['郑伟滨','曾华琛','余圣源','林旭','陈子锋']
    		},
    		yAxis:{
    		},
    		series:[
    		{
    			name:'猥琐度',
    			type:'bar',
    			data:[29,0,36,22,17]
    		},
    		{
    			name:'颜值',
    			type:'line',
    			data:[-22,99,66,87,89]
    		}
    		]
    	};
    	firstChart.setOption(option1);

    	var data = {
    		evaporation:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    		precipitation:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    	}
    	var secondChart = echarts.init(formList[1]);
    	var option2 = {
    		title:{
    			text:'2',
    			subtext:'虚构的数据'
    		},
    		toolbox:{
    			show:true,
    			feature:{
    				dataView:{
    					show:true,
    					readOnly:false
    				},
    				magicType:{
    					show:true,
    					type:['line','bar']
    				},
    				restore:{
    					show:true
    				},
    				saveAsImage:{
    					show:true
    				}
    			}
    		},
    		legend:{						
    			padding:5,
    			itemGap:10,
    			data:[
    			{name:'蒸发量',textStyle:{color:'green'}},
    			{name:'降水量'}]
    		},
    		tooltip:{						
    			trigger:'axis'
    		},
    		xAxis:[						
    		{	
    			type:'category',
    			data:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    		}
    		],
    		yAxis:[							
    		{
    			type:'value',
    		}
    		],
    		series:[
    		{
    			name:'蒸发量',
    			type:'bar',

    			data:data.evaporation,
    			markPoint:{
    				data:[
    				{type:'max',name:'最大蒸发量'},
    				{type:'min',name:'最小蒸发量'}
    				]
    			},
    			markLine:{
    				data:[
    				{type:'average',name:'平均蒸发量'}
    				]
    			}
    		},
    		{
    			name:'降水量',
    			type:'bar',

    			data:data.precipitation,
    			markPoint:{
    				data:[
    				{type:'max',name:'最大降雨量'},
    				{type:'min',name:'最小降雨量'}
    				]
    			},
    			markLine:{
    				data:[
    				{type:'average',name:'平均蒸发量'}
    				]
    			}
    		}
    		]
    	};
    	secondChart.setOption(option2);

    	var thirdChart = echarts.init(formList[2]);
    	var option3 = {
    		title:{
    			text:'3',
    			left:'left'
    		},
    		toolbox:{
    			feature:{
    				dataView:{
    					show:true,
    					readonly:true
    				},
    				restore:{
    					show:true
    				},
    				saveAsImage:{
    					show:true
    				}
    			}
    		},
    		legend:{						
    			orient:'vertical',
    			left:'left',
    			top:'center',
    			data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    		},
    		tooltip:{					
    			trigger:'item'
    		},
    		series:[
    		{
    			name:'访问来源',
    			type:'pie',
    			radius: "55%",
    			data:[
    			{name:'直接访问',value:100},
    			{name:'邮件营销',value:78},
    			{name:'联盟广告',value:234},
    			{name:'视频广告',value:324},
    			{name:'搜索引擎',value:789},
    			]
    		},
    		]
    	};
    	thirdChart.setOption(option3);
    }
    // 异常情况
    barRegList.children[4].onclick = function() {
    	if (!sendClickJudge) {
    		return;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 800);

    	dataCon.style.display = "none";
    	console.log("异常情况");
    }
    

  // map.plugin("AMap.DistrictSearch");
  var opts = {
    extensions: 'all',      
  };
  let polygons = [];
  // 跳转视图
  function changeView(districtName) {
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].setMap(null);
    }
    polygons = [];
    var district = new AMap.DistrictSearch(opts);
    district.search(districtName, function(status, result) {
      if(status=='complete'){
        getData(result.districtList[0]);
          // var position = [result.districtList[0].center.lng, result.districtList[0].center.lat];
          // var marker = new AMap.Marker({position : position});
          // map.add(marker);
        }
      });
    setTimeout(function() {
      map.setFitView();
    }, 500);
  }
  function getData(data) {
    var bounds = data.boundaries;
    if (bounds) {
      for (var i = 0; i < bounds.length; i ++) {
        var polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 0,
          strokeColor: 'rgba(1, 1, 1, 0)',
          fillColor: '#80d8ff',
          fillOpacity: 0,
          path: bounds[i]
        });
        polygons.push(polygon);
      }
      map.setFitView();
    }
  }

// document.getElementsByClassName('sidebar')[0].children[2].

});