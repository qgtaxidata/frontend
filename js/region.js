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
                console.log(data);
                if (data.code ==1) {
                    let con = formCon.getElementsByClassName("onShow")[0];
                    // formShow(data.data, data.data.title, con);
                } else {
                    alert(data.msg)
                }    
            }
        })
    	
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

      // $.ajax({
      //   "url":  serverUrl + "",
      //   "method": "GET",
      //   "headers": {
      //     "Content-Type": "application/json"
      //   },
      //   "data": send,
      //   "dataType": "json",
      //   "async": true,
      //   "crossDomain": true,
      //   "success": function(data) {
      //     console.log(data);
      //     if (data.code ==1) {
      //       let con = formCon.getElementsByClassName("onShow")[0];
      //       // formShow(data.data, data.data.title, con);
      //     } else {
      //       alert(data.msg)
      //     }    
      //   }
      // })
      
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
       
      $.ajax({
        "url":  serverUrl + "/analyse/vehicleUtilizationRate",
        "method": "GET",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": send,
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        "success": function(data) {
          console.log(data);
          if (data.code ==1) {
            let con = formCon.getElementsByClassName("onShow")[0];
            // formShow(data.data, data.data.title, con);
          } else {
            alert(data.msg)
          }    
        }
      })

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

    function formShow(x, y, title, con) {
        let chart =  echarts.init(con);
        
        let dateList = x;
        let valueList = y;

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
                text: title
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


});