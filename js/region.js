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


  	// barRegList.onclick = function() {
  	// 	if (event.target && event.target.nodeName == "LI") {
  	// 		let pre = barRegList.getElementsByClassName("on-region")[0];
  	// 		let now = event.target;
  	// 		if (pre == now) {
  	// 			return;
  	// 		}
  	// 		pre.classList.remove("on-region");
  	// 		now.classList.add("on-region");
  	// 	}
  	// }
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
    // 收入排行榜
    barRegList.children[0].onclick = function() {
    	
    	let send = {
    		area: regValue.getAttribute("tle"),
    		date: dateValue.value
    	}

    	console.log(send);

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
    			createDriver(data.data);
    		}
    	})
    }
    function createDriver(data) {
    	dataCon.innerHTML = ""
    	dataCon.style.display = "block";
    	dataCon.innerHTML +=   `<div class="item-name">
				                	<span style="width: 4rem">排名</span>
				                	<span style="width: 6rem">司机编号</span>
				                	<span style="width: 4rem">收入</span>
				            	</div>
				            		<ul class="data" style="overflow-x: hidden; max-height: 20rem">
				            	</ul>`
	    let List = dataCon.getElementsByClassName("data")[0];
    	for (let i = 0; i < data.length; i++) {
    		List.innerHTML +=   `<li>
                    				<span style="width: 4rem">${data[i].rank}</span>
                    				<span style="width: 6rem">${data[i].driverID}</span>
                    				<span style="width: 4rem">${data[i].income}</span>
                				</li>`
    	}
    }
    // 出租车收入分析和预测
    barRegList.children[1].onclick = function() {
    	dataCon.style.display = "none";
    	console.log("出租车收入分析和预测");
    }
    // 区域道路质量分析
    barRegList.children[2].onclick = function() {
    	dataCon.style.display = "none";
    	console.log("区域道路质量分析");
    }
    // 车辆利用率
    barRegList.children[3].onclick = function() {
    	dataCon.style.display = "none";
    	console.log("车辆利用率");
    }
    // 异常情况
    barRegList.children[4].onclick = function() {
    	dataCon.style.display = "none";
    	console.log("异常情况");
    }




// document.getElementsByClassName('sidebar')[0].children[2].

});