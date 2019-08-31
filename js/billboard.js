define(["require", "tools"], function (require) {

	let tools = require('tools');

	// 广告牌推荐容器
	let con = document.getElementsByClassName('billboard')[0];

	// 地区选择容器
	let regionCon = con.getElementsByClassName('region-choice')[0];
	// 天数类型容器
	let dateTypeCon = con.getElementsByClassName("date-type-choice")[0];
	// 目标时段容器
	let timeIntervalCon = con.getElementsByClassName("time-interval-choice")[0];
	// 刷新按钮
	let refresh = con.getElementsByClassName("refresh")[0];
	// 广告牌推荐点数据 容器
	let dataCon = con.getElementsByClassName("data-container")[0];
	// 广告牌推荐点数据 每项
	var billboardLi = dataCon.getElementsByTagName("li");
	// 防止频繁监控
	let clickJudge = true;
    // 
	let arr = [];

	let polygons = [];

	function liFun() {
		let input = this.getElementsByTagName("input")[0];
		input.value = event.target.innerText;
		imgFun.call(this);
		input.setAttribute("tle", event.target.getAttribute("tle"));
		if (this.getAttribute("class") == "region-choice") {
			changeView(input.value);
		}
	}

	function imgFun() {
		let img = this.getElementsByTagName("img")[0];
		let ul = this.getElementsByTagName("ul")[0];
		if (img.getAttribute("tle") == "xiala") {
			img.setAttribute("tle", "shouqi");
			img.setAttribute("src", "./images/shouqi.png");
			if (this.getAttribute("class") == "region-choice") {
				ul.setAttribute('style', "height: 20.5rem;padding-top: 1.5rem;");
			} else {
				ul.setAttribute('style', "height: 6rem;padding-top: 1.5rem;");
			}
		} else {
			img.setAttribute("tle", "xiala");
			img.setAttribute("src", "./images/xiala.png");
			ul.setAttribute('style', "height: 0;");
		}
	}

	function chooseFun() {
		if (event.target.nodeName == "IMG") {
			imgFun.call(this);
			window.event ? window.event.cancelBubble = true : e.stopPropagation();
		} else if (event.target.nodeName == "LI") {
			liFun.call(this);
			window.event ? window.event.cancelBubble = true : e.stopPropagation();
		}
	}

	regionCon.onclick = chooseFun.bind(regionCon);
	dateTypeCon.onclick = chooseFun.bind(dateTypeCon);
	timeIntervalCon.onclick = chooseFun.bind(timeIntervalCon);

	refresh.onclick = positionAjax;
	// 请求推荐点 
	function positionAjax() {

		// 点击频率限制，0.5秒
		if (!clickJudge) {
			return;
		}
		clickJudge = false;
		setTimeout(function () {
			clickJudge = true;
		}, 500);

		for(let i = 0; i < arr.length; i++) {
			map.remove(arr[i]);
		}
		for (let i = 0; i < polygons.length; i++) {
			polygons[i].setMap(null);
		}


		// 地区代号
		let area = con.getElementsByClassName("region-value")[0].getAttribute("tle");
		// 日期类型
		let targetTime = con.getElementsByClassName("date-type-value")[0].getAttribute("tle");
		// 时段
		let targetDay = con.getElementsByClassName("time-interval-value")[0].getAttribute("tle");

		// insertFun(" ");
		// AJAX

		let send = {
			area: area,
			targetTime: targetTime,
			targetDay: targetDay
		}

		$.ajax({
			"url":  serverUrl + "/analyse/billboard",
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
		           if (data.code == 1) {
					insertFun(data.data);
					console.log(data.data[0])
		           } else {
		               alert(data.msg)
		           }	
			}
		})
	}
	// 引入查询地理位置插件
	map.plugin("AMap.Geocoder");

	// 数据插入 
	function insertFun(data) {
		// 出现容器
		dataCon.style.display = "block";
		// 清空容器原本数据
		dataCon.innerHTML = "";
		// 插入得到的数据，生成节点
		var str = `
		<p>广告牌位置推荐</p>
		<ul>
			<li marker-data="${data[0].boardLon}, ${data[0].boardLat}" vehicle-flow="${data[0].boardFlow}" arrival-rate="${data[0].boradRate}"><img src="./images/Placeholder.png"><span>广告牌位置1</span></li>
			<li marker-data="${data[1].boardLon}, ${data[1].boardLat}" vehicle-flow="${data[1].boardFlow}" arrival-rate="${data[1].boradRate}"><img src="./images/Placeholder.png"><span>广告牌位置2</span></li>
			<li marker-data="${data[2].boardLon}, ${data[2].boardLat}" vehicle-flow="${data[2].boardFlow}" arrival-rate="${data[2].boradRate}"><img src="./images/Placeholder.png"><span>广告牌位置3</span></li>
			<li marker-data="${data[3].boardLon}, ${data[3].boardLat}" vehicle-flow="${data[3].boardFlow}" arrival-rate="${data[3].boradRate}"><img src="./images/Placeholder.png"><span>广告牌位置4</span></li>
			<li marker-data="${data[4].boardLon}, ${data[4].boardLat}" vehicle-flow="${data[4].boardFlow}" arrival-rate="${data[4].boradRate}"><img src="./images/Placeholder.png"><span>广告牌位置5</span></li>
		</ul>
		<button>生成对比图表</button>
		`;
		dataCon.insertAdjacentHTML("beforeend", str);

		// 根据坐标查询地理位置
		var geocoder = new AMap.Geocoder({
			city: "020", //城市设为广州
			radius: 1000 //范围，默认：500
		});

		for (let i = 0; i < billboardLi.length; i++) {
			var markerData = billboardLi[i].getAttribute("marker-data");
			geocoder.getAddress(markerData.split(","), function (status, result) {
				if (status === 'complete' && result.regeocode) {
					var address = result.regeocode.formattedAddress;
					if (address.length >= 10) {
						if(address.substring(9, 16).length >= 7) {
							var addressSimple = address.substring(9, 16) + "...";
						} else {
							var addressSimple = address.substring(9);
						}	
					} else {
						var addressSimple = address;
					}
					dataCon.getElementsByTagName("span")[i].innerHTML = addressSimple;
					dataCon.getElementsByTagName("span")[i].setAttribute("address", address);
				} else {
					console.log('根据经纬度查询地址失败');
				}
			});
		}
        
		// 绑定事件
		dataCon.onclick = function () {			
			// 给生成的节点绑定地图显示点事件 
			if (event.target && event.target.nodeName == "SPAN") {
				var markerData = event.target.parentNode.getAttribute("marker-data");
				console.log(markerData.split(",")[0], markerData.split(",")[1]);
				let title = event.target.getAttribute("address");
				var marker = new AMap.Marker({
					position: new AMap.LngLat(markerData.split(",")[0], markerData.split(",")[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
					title: title.substring(9),
					offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
					icon: 'images/定位.png' // 添加 Icon 图标 URL
				});
				map.add(marker);
				map.setFitView();
				marker.setTitle();
				arr.push(marker)
			}
			// 图表按钮绑定点击事件, 显示图表数据
			if(event.target && event.target.nodeName == "BUTTON") {
				formShow();
			}
		}
	}

	// 生成图表
	function formShow() {
		// 图表容器
		let formCon = document.getElementsByClassName("form-container")[0];
		// 显示容器
		formCon.style.display = "block";
		// 清空数据
		formCon.innerHTML = "";
		// 获取数据
		var vehicleFlow = [];
		var arrivalRate = [];
		for (let i = 0; i < billboardLi.length; i++) {
			vehicleFlow.push(billboardLi[i].getAttribute("vehicle-flow"));
			arrivalRate.push((billboardLi[i].getAttribute("arrival-rate")*100).toFixed(2));
		}
		// 插入数据
		formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose"><div class="echartsCon onShow"></div>`;
		var chartCon = formCon.getElementsByClassName("onShow")[0];
		let chart = echarts.init(chartCon);
		var option = {
			title: {
				text: '对比图表',
				subtext: "车流量: 经过该位置的车辆数目\n抵达率: 车流量中抵达该位置的车辆比例",
				subtextStyle: {
					fontWeight: "lighter",
					fontSize: 13,
					color: "#666",
					lineHeight: 15
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				formatter: "{a0} : {c0}% <br/>{a1} : {c1}辆"
			},
			legend: {
				data: ['到达率(%)', '车流量(辆)'],
				left: "right"
			},
			grid: {
				left: '0',
				right: '5%',
				top: '20%',
				bottom: '0',
				containLabel: true
			},
			xAxis: [{
					type: 'value',
					axisLabel: {
						formatter: `{value} %`
					}
				},{
					type: 'value',
					axisLabel: {
						formatter: `{value} 辆`
					}
				}],
			yAxis: {
				type: 'category',
				data: ['广告牌位置1','广告牌位置2','广告牌位置3','广告牌位置4','广告牌位置5']
			},
			series: [
				{
					name: '到达率(%)',
					xAxisIndex:0,
					type: 'bar',
					data: arrivalRate
				},
				{
					name: '车流量(辆)',
					xAxisIndex: 1,
					type: 'bar',
					data: vehicleFlow
				}
			]
		};
		chart.setOption(option);
	}

	
	var opts = {
		extensions: 'all',
	};

	// 跳转视图
	function changeView(districtName) {
		for (let i = 0; i < polygons.length; i++) {
			polygons[i].setMap(null);
		}
		polygons = [];
		var district = new AMap.DistrictSearch(opts);
		district.search(districtName, function (status, result) {
			if (status == 'complete') {
				getData(result.districtList[0]);
			}
		});
		setTimeout(function () {
			map.setFitView();
		}, 500);
	}
	function getData(data) {
		var bounds = data.boundaries;
		if (bounds) {
			for (var i = 0; i < bounds.length; i++) {
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

	function clearBillboard() {
		let dataCon = con.getElementsByClassName("data-container")[0];
		let formCon = document.getElementsByClassName("form-container")[0];

		dataCon.innerHTML = "";
		dataCon.style.display = "none";
		formCon.innerHTML = "";
		for(let i = 0; i < arr.length; i++) {
			map.remove(arr[i]);
		}
		for (let i = 0; i < polygons.length; i++) {
			polygons[i].setMap(null);
		}

	}

	return {
		clear: clearBillboard
	}
});