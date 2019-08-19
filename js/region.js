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
    for (let i = 3; i < 22; i++) {
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
    // 刷新
    refresh.onclick = function() {
    	let onRegion = barRegList.getElementsByClassName("on-region")[0] || null;
    	if (onRegion) {
    		onRegion.onclick();
    	}
    }
    // 二级导航栏添加限制
    function addClickLimit() {
    	if (!sendClickJudge) {
    		return false;
    	}
    	sendClickJudge = false;
    	setTimeout(function() {
    		sendClickJudge = true;
    	}, 500);

    	let pre = barRegList.getElementsByClassName("on-region")[0] || null;
    	let now = this;

    	if (pre) {
    		pre.classList.remove("on-region");
    	}
    	now.classList.add("on-region");
    	if (this.innerText == "出租车司机收入排行榜") {
    		formCon.style.display = "none";
    	}
    	return true;
    }
    // 出租车司机收入排行榜
    barRegList.children[0].onclick = function() {
    	if (!addClickLimit.call(this)) {
    		return;
    	}
    	console.log("执行【出租车司机收入排行榜】");
    	// sendClickJudge = false;
    	// setTimeout(function() {
    	// 	sendClickJudge = true;
    	// }, 800);
    	let area = regValue.getAttribute("tle");
    	let date = dateValue.value
    	let send = {
    		area: area,
    		date: date
    	}
    	console.log("司机排行榜send",send);
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
                if (data.code ==1) {
                    createDriver(data.data, area, date);
                } else {
                    alert(data.msg)
                }	
    		}
    	})
    	// var data = [
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "643",
    	// 		income: "24"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "32",
    	// 		income: "245"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "45",
    	// 		income: "78"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "4",
    	// 		income: "wttrwrtw"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "re44",
    	// 		income: "657"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "34435",
    	// 		income: "423"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "34",
    	// 		income: "433457"
    	// 	},
    	// 	{
    	// 		rank: 1,
    	// 		driverID: "trew",
    	// 		income: "42762"
    	// 	}
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
    	for (let i = 0; i < list.children.length; i++) {
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
                if (data.code == 1) {
                    showDriver(data.data, rank, driverID, income)
                } else {
                    alert(data.msg);
                }
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
    	formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose">
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
    	if (!addClickLimit.call(this)) {
    		return;
    	}
    	console.log("执行【出租车收入分析和预测】");

    	dataCon.style.display = "none";


    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = ""
    	formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose">
                              <div class="echartsCon onShow"></div>`;
    	
    	
        let area = regValue.getAttribute("tle");
        let date = dateValue.value
        let send = {
            area: area,
            date: date
        }

        // $.ajax({
        //     "url":  serverUrl + "/rank/getRank",
        //     "method": "GET",
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     "data": send,
        //     "dataType": "json",
        //     "async": true,
        //     "crossDomain": true,
        //     "success": function(data) {
        //         console.log(data);
        //         if (data.code ==1) {
        //             let con = formCon.getElementsByClassName("onShow")[0];
        //             formShow(data.data, con);
        //         } else {
        //             alert(data.msg)
        //         }    
        //     }
        // })
        let data = {
            "msg": "success",
            "code": 1,
            "data": {
                "title": "天河区区域收入分析及预测",
                "graph": {
              "x": [
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-03",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-04",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-05",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-06",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-07",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08",
              "02-08"
              ],
              "y": [
              4433.0,
              3473.0,
              2028.0,
              1031.0,
              1397.0,
              1063.0,
              1591.0,
              2555.0,
              4007.0,
              8734.0,
              4294.0,
              3892.0,
              4574.0,
              5133.0,
              6067.0,
              6613.0,
              6139.0,
              4785.0,
              5989.0,
              5196.0,
              4632.0,
              5323.0,
              5932.0,
              4290.0,
              4315.0,
              2269.0,
              1533.0,
              718.0,
              840.0,
              1198.0,
              1618.0,
              3901.0,
              5701.0,
              4244.0,
              4610.0,
              5446.0,
              5199.0,
              5118.0,
              6941.0,
              5877.0,
              5970.0,
              6137.0,
              5844.0,
              5466.0,
              5698.0,
              5114.0,
              5318.0,
              3347.0,
              4019.0,
              2480.0,
              1845.0,
              1526.0,
              876.0,
              1198.0,
              2073.0,
              2293.0,
              5143.0,
              3819.0,
              4135.0,
              4575.0,
              4713.0,
              5555.0,
              5971.0,
              6186.0,
              6585.0,
              5827.0,
              5125.0,
              5818.0,
              5472.0,
              5754.0,
              6605.0,
              3728.0,
              3340.0,
              1908.0,
              1731.0,
              1114.0,
              1067.0,
              2058.0,
              2432.0,
              4832.0,
              7661.0,
              6945.0,
              7086.0,
              5752.0,
              4958.0,
              6306.0,
              6681.0,
              6594.0,
              6265.0,
              4959.0,
              5420.0,
              5148.0,
              4660.0,
              4512.0,
              4734.0,
              3491.0,
              3716.4,
              2259.2,
              1874.4,
              1414.7,
              1075.1,
              1739.2,
              2362.3,
              2484.5,
              4762.0,
              5523.4,
              5733.5,
              5275.6,
              4951.3,
              6046.5,
              6443.4,
              6515.6,
              6552.9,
              5525.4,
              5419.8,
              5642.9,
              5232.8,
              5309.1,
              5853.3,
              5225.9,
              3936.4,
              2472.4,
              2080.6,
              1615.1,
              1270.8,
              1930.8,
              2550.6,
              2670.0,
              4945.2,
              5704.7,
              5913.2,
              5454.0,
              5128.6,
              6222.9,
              6619.0,
              6690.5,
              6727.3,
              5699.3,
              5593.4,
              5816.2,
              5405.8,
              5481.9,
              6026.0,
              5398.4
              ]
                }
            }
        }

       

       let con = formCon.getElementsByClassName("onShow")[0];
       formShow(data.data, con);


    	
    }
    // 区域道路质量分析
    barRegList.children[2].onclick = function() {
    	if (!addClickLimit.call(this)) {
    		return;
    	}
    	console.log("执行【区域道路质量分析】");

    	dataCon.style.display = "none";
    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = ""
    	formCon.innerHTML +=   `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose">
                              <img class="form-pre" src="./images/上一个.png" click="formPre">
                              <img class="form-next" src="./images/下一个.png" click="formNext">
                              <div class="echartsCon onShow"></div>
                              <div class="echartsCon next"></div>
                              <div class="echartsCon pre"></div>`;
      let formList = formCon.getElementsByClassName("echartsCon");
      

      let chart0 =  echarts.init(formList[0]);
      let chart1 =  echarts.init(formList[1]);
      let chart2 =  echarts.init(formList[2]);

      let data0 = {
        x:[1,2,3,4,5,6,7,8,9],
        y:[12,23,76,23,5,62,75,48,9],
        title: "test0000000"
      }
      chart0.setOption(createOption(data0));

      let data1 = {
        x:[1,2,3,4,5,6,7,8,9,10,11,12,2,3,4,5,6,7,8,9,10,11,12],
        y:[152,2543,1436,253,5,1762,755,4348,94,2,211,1233,2543,1436,253,5,1762,755,4348,94,2,211,1233],
        title: "test11111111"
      }
      chart1.setOption(createOption(data1));

      let data2 = {
        x:[1,2,3,4,5,6,7,8,9],
        y:[0.3,0.23,0.76,2.2,0.05,6.2,3.5,1.8,0.09],
        title: "test22222222"
      }
      chart2.setOption(createOption(data2));
    	
    }
    // 车辆利用率
    barRegList.children[3].onclick = function() {
    	if (!addClickLimit.call(this)) {
    		return;
    	}
    	console.log("执行【车辆利用率】");

    	dataCon.style.display = "none";
    	let formCon = document.getElementsByClassName("form-container")[0];
    	formCon.style.display = "block";
    	formCon.innerHTML = ""
    	formCon.innerHTML +=   `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose">
						        <img class="form-pre" src="./images/上一个.png" click="formPre">
						        <img class="form-next" src="./images/下一个.png" click="formNext">
						        <div class="echartsCon onShow"></div>
						        <div class="echartsCon"></div>
						        <div class="echartsCon"></div>`;

    	let formList = formCon.getElementsByClassName("echartsCon"); 

       
      let chart0 =  echarts.init(formList[0]);
      let chart1 =  echarts.init(formList[1]);
      let chart2 =  echarts.init(formList[2]);

    }
    // 异常情况
    barRegList.children[4].onclick = function() {
    	if (!addClickLimit.call(this)) {
    		return;
    	}
    	console.log("执行【异常情况】");

    	dataCon.style.display = "none";
        formCon.style.display = "none";
    }
    
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
                    strokeWeight: 1,
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

    function formShow(data, con) {
        let chart =  echarts.init(con);
        
        let dateList = data.graph.x;
        let valueList = data.graph.y;

        let option = {

            visualMap: {
                show: false,
                dimension: 0,
                pieces: [{
                    gt: 0,
                    lte: dateList.length - 48,
                    color: '#366f9b'
                }, {
                    gt: dateList.length - 48,
                    color: '#f58020'
                }]
            },
            title: {
                left: 'center',
                text: data.title
            },
            textStyle: {color:"#000",fontSize:"18"},
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                axisTick: {
                    alignWithLabel: true, 
                    interval: 23             
                },
                axisLabel: {
                    interval: 23             
                },
                data: dateList
            },
            yAxis: {
            },
            series: {
                type: 'line',
                showSymbol: false,
                color: "#aed9d8",
                smooth: true,
                data: valueList,
                markArea: {
                  data: [
                  [{name: '预测数据',xAxis: dateList[dateList.length - 49]}, {xAxis: dateList[dateList.length - 1]}] 
                  ]
                }
            }
        };

        chart.setOption(option);

    }















    function createOption(data) {
    var option = {
      title: {
        text: data.title,
      },
      tooltip: {},
      legend: {
        data:["line"],
      },
      xAxis: {
        data:data.x
      },
      yAxis: {},
      series: [
        {
          name:'line',
          type:'line',
          data:data.y
        }
      ]
    }
    return option;
  }




});